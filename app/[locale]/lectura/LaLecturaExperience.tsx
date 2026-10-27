"use client";
import { useL } from "@/lib/i18n/useL";
import { pageLocale } from "@/lib/i18n/pageLocale";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { usePremiumAccess } from "@/lib/hooks/usePremiumAccess";
import { usePremiumActivation } from "@/components/premium/PremiumActivationContext";
import { getProfileSalt } from "@/lib/profile-salt";
import { getPremiumTokenClient } from "@/lib/premium";
import { getCachedLectura, setCachedLectura } from "@/lib/session/lecturaCache";
import {
  buildPatterns,
  buildTensions,
  generatePaywallHook,
} from "@/lib/engines/synthesisEngine";
import { safeNumber } from "@/lib/utils/score";
import PremiumGate from "@/components/profile/PremiumGate";
import PremiumActivationFeedback from "@/components/premium/PremiumActivationFeedback";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import type { MolinoInterpretation } from "@/lib/engines/intelligence/types";
import Logo from "@/components/ui/Logo";
import BuildingMolino from "@/components/ui/BuildingMolino";
import LecturaGratis from "@/components/lectura/LecturaGratis";
import PremiumChatSection from "@/components/chat/PremiumChatSection";

const SUCCESS_BANNER_MS = 4000;

interface Props {
  profile: UserProfile;
  catalog: LightweightEntity[];
}

async function fetchLectura(profile: UserProfile): Promise<MolinoInterpretation | null> {
  const controller = new AbortController();
  // 60s: Vercel cold start + generación IA de ~10-15s + latencia de red.
  // El anterior 30s provocaba aborts en cold starts y mostraba "No pudimos
  // generar" cuando el servidor estaba respondiendo bien, solo que lento.
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    console.log("[fetchLectura] starting request...");
    const res = await fetch("/api/intelligence/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        dob: profile.birthDate,
        salt: getProfileSalt(),
        type: "personal_profile",
        premiumToken: getPremiumTokenClient(),
        locale: pageLocale(),
      }),
      signal: controller.signal,
    });
    console.log("[fetchLectura] response received, status:", res.status);
    const data = await res.json();
    if (!res.ok) {
      console.warn("[fetchLectura] not ok:", res.status, data?.error);
      return null;
    }
    const result = (data.ai as MolinoInterpretation) ?? (data.fallback as MolinoInterpretation) ?? null;
    console.log("[fetchLectura] result:", result ? "ok" : "null");
    return result;
  } catch (err) {
    console.warn("[fetchLectura] aborted or error:", err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export default function LaLecturaExperience({ profile, catalog }: Props) {
  const L = useL();
  const reduceMotion = useSafeReducedMotion();

  const [interpretation, setInterpretation] = useState<MolinoInterpretation | null>(null);
  const [fetchDone, setFetchDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { step, setStep } = usePremiumActivation();
  // El paso y el estado de la lectura, leídos desde callbacks y timers sin
  // volver a armarlos en cada render.
  const stepRef = useRef(step);
  const revealedRef = useRef(revealed);
  useEffect(() => {
    stepRef.current = step;
    revealedRef.current = revealed;
  }, [step, revealed]);

  // El acceso premium es por (fecha de nacimiento + dispositivo), no por
  // dispositivo a secas: cargar un mapa nuevo sin pagarlo NO da acceso a su
  // lectura aunque ya hayas pagado otro. Antes esto se descubría recién en el
  // 403 de /api/intelligence/interpret, que el fetch colapsaba a `null` y la
  // UI mostraba como "no pudimos generar tu lectura" — un error técnico donde
  // en realidad faltaba pagar. Ahora se consulta antes de gastar la llamada
  // de IA. usePremiumAccess además re-emite el token de dispositivo si se
  // perdió (localStorage limpiado, navegador nuevo), así que un usuario que
  // ya pagó no cae nunca en el paywall por no tener el token a mano.
  const { isPremium } = usePremiumAccess(profile.name, profile.birthDate);

  const hasFetched = useRef(false);
  // Antes de saber si pagó no se muestra la animación de la lectura paga (el
  // que no pagó la veía un instante antes del paywall): solo un molino quieto.
  const [started, setStarted] = useState(false);
  // Guard de montaje, NO de cancelación por cleanup: el código anterior
  // ponía `cancelled = true` apenas el setStep interno (preparing → ready)
  // re-corría el efecto — y como `step` está en sus dependencias, la
  // transición descartaba la respuesta del fetch cuando llegaba (segundos
  // después). Resultado: `interpretation` quedaba en null y la UI mostraba
  // "No pudimos generar tu lectura" para siempre, sin importar cuántas
  // veces se recargara. isMounted solo corta si el componente se desmontó.
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Aplica la respuesta de /api/intelligence/interpret. Un fetch fallido
  // (null) NO pisa una lectura cacheada que ya está en pantalla: el error
  // solo aparece cuando no hay nada que mostrar.
  const applyLecturaResult = useCallback(
    (result: MolinoInterpretation | null) => {
      if (!isMounted.current) return;
      setFetchDone(true);
      if (result) {
        setInterpretation(result);
        setCachedLectura(profile.birthDate, profile.name || "", result);
      }
    },
    [profile]
  );

  const launchLecturaFetch = useCallback(() => {
    fetchLectura(profile).then(applyLecturaResult);
  }, [profile, applyLecturaResult]);

  // Arranca la generación UNA vez por perfil (guard de hasFetched): el fetch
  // corre en background y la UI no se bloquea mientras tanto.
  const startLectura = useCallback(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    setStarted(true);
    // 'preparing' hasta que la lectura se revela (ahí pasa a 'idle'). Si se
    // llegó por un cupón recién aceptado, el "Código aceptado" se queda en
    // pantalla unos segundos: pisarlo acá mismo lo borraba en el mismo render
    // y quien canjeaba el código no veía ninguna confirmación.
    if (stepRef.current !== 'success') setStep('preparing');
    launchLecturaFetch();
  }, [launchLecturaFetch, setStep]);

  // La fetch arranca cuando el cupón es aceptado (step='success' desde
  // usePremiumCoupon) O cuando isPremium pasa a true (pago normal por
  // Mercado Pago). En ambos casos el servidor ya confirmó el acceso.
  //
  // SAFETY: si isPremium queda null (KV lento/caído), un timeout de 6s
  // fuerza el inicio de la fetch de todas formas — el servidor hace su
  // propio check de premium y rechaza con 403 si no corresponde. Sin esto,
  // BuildingMolino se muestra pero la fetch nunca arranca y la UI queda
  // trabada en "Detectando tus tensiones" para siempre.
  useEffect(() => {
    if (step === 'success' || isPremium === true) {
      startLectura();
      return;
    }
    if (isPremium === null) {
      const safetyTimer = setTimeout(() => {
        console.log("[LaLectura] safety timeout: isPremium still null, starting fetch anyway");
        startLectura();
      }, 6_000);
      return () => clearTimeout(safetyTimer);
    }
    // isPremium === false → falta pagar ESTE mapa: PremiumGate se ocupa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isPremium, profile.birthDate, profile.name]);

  // Reabre la lectura cacheada sin refetch: localStorage no existe en SSR,
  // así que el efecto post-mount resuelve el caché sin desajuste de hidratación.
  useEffect(() => {
    const cached = getCachedLectura(profile.birthDate, profile.name || "");
    if (cached) {
      setInterpretation(cached);
      setFetchDone(true);
      setRevealed(true);
      return;
    }
  }, [profile.birthDate, profile.name]);

  // El banner fijo (PremiumActivationFeedback) es una confirmación
  // transitoria post-activación, no un aviso permanente: apenas la lectura
  // está en pantalla se descarta solo — también cuando la generación arranca
  // DESPUÉS de reabrir una lectura cacheada (refresco silencioso).
  useEffect(() => {
    if (revealed && step !== 'idle' && step !== 'success') setStep('idle');
  }, [revealed, step, setStep]);

  // "Código aceptado" dura lo justo para leerlo: después pasa a "preparando"
  // si la lectura todavía no llegó, o se va si ya está en pantalla.
  useEffect(() => {
    if (step !== 'success') return;
    const t = setTimeout(() => {
      if (stepRef.current === 'success') setStep(revealedRef.current ? 'idle' : 'preparing');
    }, SUCCESS_BANNER_MS);
    return () => clearTimeout(t);
  }, [step, setStep]);

  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";

  // Reintentar manual: resetea el guión del 401/429/timeout y vuelve a
  // intentar la generación. Sin esto, un fallo puntual (cold start lento,
  // KV ocupado, rate limit) condenaba al usuario para siempre al mensaje
  // "No pudimos generar tu lectura" — no había camino de recuperación sin
  // recargar la página, y a veces ni eso (la fetch sigue corriendo a mano).
  const retryLectura = useCallback(() => {
    console.log("[LaLectura] retryLectura");
    setInterpretation(null);
    setFetchDone(false);
    setRevealed(false);
    launchLecturaFetch();
  }, [launchLecturaFetch]);

  // Mismo preview que arma LecturaPremium en /profile (LecturaProfunda.tsx) —
  // el paywall muestra un patrón y una tensión reales de ESTE perfil, no una
  // promesa genérica.
  const gatePreview = useMemo(
    () => ({
      lifePath: safeNumber(profile.lifePath, 1),
      chineseZodiac: typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "",
      pattern: buildPatterns(profile)[0] ?? null,
      tension: buildTensions(profile)[0] ?? null,
      hook: generatePaywallHook(profile),
    }),
    [profile]
  );

  // Solo se muestra el paywall cuando el servidor ya confirmó que falta pagar.
  // Mientras `isPremium` es null seguimos en el estado de carga: PremiumGate
  // arranca en 'locked' y acá ocupa la pantalla entera, así que montarlo antes
  // de saber la respuesta le haría ver el paywall un instante a alguien que ya
  // pagó — justo el usuario al que no hay que mostrárselo.
  //
  // El que no pagó ve el paywall (beneficios + comprar), sin animación; el que
  // pagó ve la animación solo la primera vez y después su lectura + chat
  // directo (el caché de /lectura reabre con `revealed=true`, ver reproceso
  // de abajo).
  //
  // Una vez montado, PremiumGate queda montado hasta que la lectura se revela:
  // si se desmontara apenas `isPremium` pasa a true (lo invalida el propio
  // desbloqueo), la confirmación del pago destellaba y desaparecía. La vuelta
  // de Mercado Pago (o de /premium/claim) lo monta de entrada aunque el webhook
  // ya haya otorgado el acceso: es PremiumGate quien confirma el pago, muestra
  // pendiente/rechazado y limpia los parámetros de la URL.
  const [gateShown, setGateShown] = useState(false);
  useEffect(() => {
    if (isPremium === false || /[?&](payment_status|claimed)=/.test(window.location.search)) {
      setGateShown(true);
    }
  }, [isPremium]);
  const locked = gateShown && !revealed;

  return (
    <section className="bg-background border-t border-ink/10">

      {/* Cresta — el molino, quieto, coronando la lectura. Solo una vez
          revelada: mientras carga, BuildingMolino ya trae su propio molino
          girando — mostrar los dos a la vez (uno quieto arriba, uno girando
          más abajo) leía como dos elementos sin relación, no como una sola
          idea. */}
      {revealed && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
          className="flex justify-center pt-8 pb-8"
        >
          <Logo className="h-10 w-10 text-accent" />
        </motion.div>
      )}

      <div className={`mx-auto ${revealed && interpretation ? "max-w-[1000px]" : "max-w-[760px]"} px-6 sm:px-8 pb-32`}>
        {locked ? (
          /* Falta pagar ESTA lectura. PremiumGate ya es el dueño del checkout
             (Mercado Pago, cupón, recuperar compra) y del copy de venta, así
             que se reutiliza tal cual en vez de escribir un segundo paywall
             que después se desincroniza del precio o del flujo de pago. Al
             desbloquear, sus children pasan a renderizarse y el efecto de
             arriba dispara la generación real. */
          <div className="pt-4 pb-16">
            {/* El paywall muestra la conversación entre los tres sistemas
                (LA CONVERSACIÓN ENTRE TUS SISTEMAS), la síntesis y el
                checkout. PremiumGate → PremiumPaywallContent es la fuente
                única del precio y del copy de venta; un segundo listado
                acá se desincronizaría del primero. */}
            <PremiumGate name={profile.name} birthDate={profile.birthDate} preview={gatePreview}>
              <div className="pt-4 pb-16">
                <BuildingMolino done={fetchDone} onComplete={() => setRevealed(true)} />
              </div>
            </PremiumGate>
          </div>
        ) : !revealed && !started ? (
          <div className="flex justify-center py-24" aria-busy="true">
            <Logo className="h-8 w-8 text-accent/40" />
          </div>
        ) : !revealed ? (
          <div className="pt-4 pb-16">
            <BuildingMolino done={fetchDone} onComplete={() => setRevealed(true)} />
          </div>
        ) : !interpretation ? (
          <div className="text-center py-16 px-4">
            <p className="text-muted text-sm mb-4">{L("No pudimos generar tu lectura esta vez. Esperá un momento y volvé a intentarlo.", "We couldn't generate your reading this time. Wait a moment and try again.")}</p>
            <button
              type="button"
              onClick={retryLectura}
              className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-background transition hover:bg-ink/90"
            >{L(<>
              <span aria-hidden="true">↻</span>
              Reintentar
            </>, <><span aria-hidden="true">↻</span> Try again</>)}</button>
          </div>
        ) : (
          <section id="lectura-contenido">
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.1 }}
              className="mb-16 sm:mb-20"
            >
              <p className="text-sm text-muted mb-6 label-caps">{L("I · La frase que te resume", "I · The sentence that sums you up")}</p>
              {interpretation.opening && (
                <p className="text-center font-display italic text-lg sm:text-xl leading-[1.4] text-muted mb-10 max-w-xl mx-auto">
                  {L.t(interpretation.opening)}
                </p>
              )}
              <p className="font-display text-[clamp(2.1rem,5.5vw,3.5rem)] leading-[1.06] tracking-tight text-foreground max-w-2xl">
                {L.t(interpretation.summary)}
              </p>
              {interpretation.corePattern && (
                <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-xl mt-8 pt-6 border-t border-ink/15">
                  {L.t(interpretation.corePattern.whyItMatters)}
                </p>
              )}
            </motion.section>

            {/* Las dos alas — fortalezas y tensiones, abriéndose desde el centro */}
            <p className="text-sm text-muted mb-4 label-caps">{L("II · Lo que te sostiene y lo que pide atención", "II · What holds you up and what needs attention")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15 mb-16 sm:mb-24">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.25 }}
                className="bg-paper p-8 sm:p-10"
              >
                <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-5">{L("Lo que te sostiene", "What holds you up")}</h2>
                {interpretation.strengths.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {interpretation.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-base text-foreground leading-relaxed">
                        <span className="w-3 h-px bg-ink mt-[0.75em] shrink-0" aria-hidden="true" />
                        {L.t(s)}
                      </li>
                    ))}
                  </ul>
                )}
                {interpretation.howYouOperate && (
                  <p className="text-base text-muted leading-relaxed pt-4 border-t border-ink/10">
                    {L.t(interpretation.howYouOperate)}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.25 }}
                className="bg-paper-alt p-8 sm:p-10"
              >
                <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-5">{L("Lo que pide tu atención", "What needs your attention")}</h2>
                {interpretation.tensions.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {interpretation.tensions.map((t, i) => (
                      <li key={i} className="flex items-start gap-3 text-base text-foreground/85 leading-relaxed">
                        <span className="w-3 h-px bg-ink/40 mt-[0.75em] shrink-0" aria-hidden="true" />
                        {L.t(t)}
                      </li>
                    ))}
                  </ul>
                )}
                {interpretation.whatToConsider.length > 0 && (
                  <ul className="space-y-2 pt-4 border-t border-ink/10">
                    {interpretation.whatToConsider.map((c, i) => (
                      <li key={i} className="text-base text-muted leading-relaxed">{L.t(c)}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </div>

            {/* El punto ciego — el pico visual de la lectura. Es el único
                bloque invertido de toda la página: el contraste contra el
                papel es lo que lo convierte en "el momento", sin necesidad de
                subir el tamaño de fuente hasta que grite. Usa .section-dark,
                la utilidad de superficie invertida que ya define
                globals.css, en vez de inventar un par de colores nuevo. */}
            {interpretation.blindSpot && (
              <motion.section
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.3 }}
                className="section-dark p-8 sm:p-14 mb-16 sm:mb-24"
              >
                {/* accent-light, no accent: --color-accent (#A83A23) está
                    calibrado contra el papel claro y sobre ink queda en 2.7:1,
                    abajo del 4.5:1 que pide un texto de 12px.
                    --color-accent-light (#D9805F) es el par del mismo acento
                    pensado para superficies oscuras. */}
                <p className="text-sm text-paper/70 mb-6 label-caps">{L("III · Tu punto ciego", "III · Your blind spot")}</p>
                {/* text-paper explícito, no heredado: globals.css baja a
                    --color-muted los <p> dentro de .section-dark, lo que acá
                    dejaba el párrafo más importante de la lectura paga en
                    2.93:1 sobre el fondo ink — abajo del piso de 3:1 de WCAG
                    AA incluso contando como texto grande. */}
                <p className="font-display text-[clamp(1.6rem,3.8vw,2.4rem)] leading-[1.25] max-w-2xl text-paper">
                  {L.t(interpretation.blindSpot)}
                </p>
              </motion.section>
            )}

            {/* Los tres dominios — el mismo patrón central bajando a tierra.
                Misma retícula de hairlines (gap-px sobre ink/10) que "las dos
                alas" de arriba, para que se lea como parte del mismo
                documento y no como un módulo pegado aparte. */}
            {interpretation.lifeAreas && (
              <motion.section
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.35 }}
                className="mb-16 sm:mb-20"
              >
                <p className="text-sm text-muted mb-3 label-caps">{L("IV · Dónde se nota", "IV · Where it shows")}</p>
                <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-2">{L("El mismo patrón, en tres lugares", "The same pattern, in three places")}</h2>
                <p className="text-base text-muted mb-6">{L("Se manifiesta distinto en el trabajo, en los vínculos y en las decisiones.", "It shows up differently at work, in relationships and in decisions.")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
                  {([
                    ["trabajo", L("Trabajo", "Work"), interpretation.lifeAreas.work],
                    ["vinculos", L("Vínculos", "Relationships"), interpretation.lifeAreas.relationships],
                    ["decisiones", L("Decisiones", "Decisions"), interpretation.lifeAreas.decisions],
                  ] as const).map(([num, label, body]) => (
                    <div key={num} className="bg-paper p-6 sm:p-7">
                      <h3 className="font-display text-xl text-foreground mb-3">{L.t(label)}</h3>
                      <p className="text-base text-muted leading-relaxed">{L.t(body)}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Recomendación — el paso siguiente, destacado */}
            {interpretation.suggestedNextStep && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.4 }}
                className="mb-8 sm:mb-10 py-8 border-y-2 border-ink"
              >
                <p className="text-sm text-muted mb-3 label-caps">{L("El paso siguiente", "The next step")}</p>
                <p className="font-display text-2xl sm:text-3xl text-foreground leading-snug max-w-2xl">
                  {L.t(interpretation.suggestedNextStep)}
                </p>
              </motion.div>
            )}

            {/* Cierre — la síntesis, como colofón */}
            {interpretation.closingSynthesis && (
              <motion.blockquote
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.5 }}
                className="text-center font-display italic text-2xl sm:text-3xl leading-[1.45] text-foreground max-w-xl mx-auto py-10 sm:py-16 mb-16 sm:mb-20"
              >
                &laquo;{L.t(interpretation.closingSynthesis)}&raquo;
              </motion.blockquote>
            )}

            {/* Diferencial Principal de Molino: Conversación contextual con tu mapa */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.55 }}
              className="mb-20 sm:mb-24"
            >
              <p className="text-sm text-muted mb-4 label-caps">{L("V · Preguntale a Molino", "V · Ask Molino")}</p>
              <PremiumChatSection
                profile={profile}
                readingContext={{
                  summary: interpretation.summary,
                  corePattern: interpretation.corePattern
                    ? { what: interpretation.corePattern.what, source: interpretation.corePattern.source }
                    : undefined,
                  howYouOperate: interpretation.howYouOperate,
                  closingSynthesis: interpretation.closingSynthesis,
                  tensions: interpretation.tensions,
                  alignment: interpretation.alignment,
                  timing: interpretation.timing,
                  strengths: interpretation.strengths,
                  whatToConsider: interpretation.whatToConsider,
                  suggestedNextStep: interpretation.suggestedNextStep,
                  opening: interpretation.opening,
                  relationalNote: interpretation.relationalNote,
                }}
              />
             </motion.div>

            {/* Referencias — sincronicidad histórica y fórmulas, después del
                AI reading para que la lectura interpretativa sea la estrella. */}
            <LecturaGratis profile={profile} />
          </section>
        )}

        {/* Regalar — bajado de rango (Fase 4). Antes era un bloque en caja de
            acento, con precio, y era LO ÚLTIMO que se leía: la lectura
            terminaba en un upsell. Ahora es una línea al pie, al lado de
            "volver a tu mapa", donde corresponde a una acción secundaria. */}
        <div className="mt-16 pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <Link
            href="/profile"
            className="text-sm text-muted hover:text-accent transition-colors label-caps"
          >{L("← Volver a tu mapa", "← Back to your map")}</Link>
          <p className="text-sm text-muted leading-relaxed">{L(<>
            ¿Pensaste en alguien mientras leías?{" "}
            <Link href="/regalar" className="text-foreground underline underline-offset-4 hover:no-underline">
              Regalale una lectura
            </Link>{" "}
            — no hace falta que sepas su fecha.
          </>, <>Did someone come to mind while you were reading?{" "}<Link href="/regalar" className="text-foreground underline underline-offset-4 hover:no-underline">Give them a reading</Link>{" "}— you don't need to know their date.</>)}</p>
        </div>
        </div>
        <PremiumActivationFeedback />
      </section>
    );
  }
