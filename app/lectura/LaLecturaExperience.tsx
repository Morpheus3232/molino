"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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

interface Props {
  profile: UserProfile;
  catalog: LightweightEntity[];
}

async function fetchLectura(profile: UserProfile): Promise<MolinoInterpretation | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch("/api/intelligence/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        dob: profile.birthDate,
        salt: getProfileSalt(),
        type: "personal_profile",
        premiumToken: getPremiumTokenClient(),
      }),
      signal: controller.signal,
    });
    const data = await res.json();
    if (!res.ok) return null;
    return (data.ai as MolinoInterpretation) ?? (data.fallback as MolinoInterpretation) ?? null;
  } catch (err) {
    console.warn("[fetchLectura] aborted or error:", err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export default function LaLecturaExperience({ profile, catalog }: Props) {
  const reduceMotion = useSafeReducedMotion();

  const [interpretation, setInterpretation] = useState<MolinoInterpretation | null>(null);
  const [fetchDone, setFetchDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { step, setStep } = usePremiumActivation();

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
  const prevIsPremium = useRef(isPremium);

  // La fetch arranca cuando el cupón es aceptado (step='success' desde
  // usePremiumCoupon) O cuando isPremium pasa a true (pago normal por
  // Mercado Pago). En ambos casos el servidor ya confirmó el acceso.
  useEffect(() => {
    const premiumJustActivated = isPremium === true && prevIsPremium.current !== true;
    prevIsPremium.current = isPremium;
    if (step !== 'success' && !premiumJustActivated && !isPremium) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    setStep('preparing');
    // Transición inmediata a ready: el fetch de la lectura corre en
    // background sin bloquear la UI.
    setTimeout(() => setStep('ready'), 0);
    let cancelled = false;
    fetchLectura(profile).then((result) => {
      if (cancelled) return;
      setInterpretation(result);
      setFetchDone(true);
      if (result) setCachedLectura(profile.birthDate, profile.name || "", result);
    });
    return () => { cancelled = true; };
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
      // Solo marcar como lista si venimos de una activación reciente
      if (step === 'success') setStep('ready');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.birthDate, profile.name]);

  const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";

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
  const locked = isPremium === false && !interpretation;

  // Para usuarios no premium, mostrar LecturaGratis directamente
  // sin pasar por BuildingMolino (el fetch solo es para la lectura Pro).
  const isNonPremiumFreeUser = isPremium === false;

  return (
    <section className="bg-background border-t border-ink/10">

      {/* Cresta — el molino, quieto, coronando la lectura. Solo una vez
          revelada: mientras carga, BuildingMolino ya trae su propio molino
          girando — mostrar los dos a la vez (uno quieto arriba, uno girando
          más abajo) leía como dos elementos sin relación, no como una sola
          idea. */}
      {(revealed || isNonPremiumFreeUser) && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
          className="flex justify-center pt-8 pb-8"
        >
          <Logo className="h-10 w-10 text-accent" />
        </motion.div>
      )}

      <div className="mx-auto max-w-[760px] px-6 sm:px-8 pb-32">
        {/* La IA es un enriquecimiento encima del contenido determinista de
            abajo, no un gate para verlo — mientras carga o si falla, el
            zodíaco/número de la suerte/afinidades siguen disponibles. */}
        {isNonPremiumFreeUser ? (
          <section id="lectura-contenido" className="space-y-0">
            <LecturaGratis profile={profile} />
          </section>
        ) : locked ? (
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
        ) : !revealed ? (
          <div className="pt-4 pb-16">
            <BuildingMolino done={fetchDone} onComplete={() => setRevealed(true)} />
          </div>
        ) : !interpretation ? (
          <p className="text-center text-muted text-sm py-16">
            No pudimos generar tu lectura esta vez. El resto de tu lectura sigue disponible abajo.
          </p>
        ) : (
          <section id="lectura-contenido" className="space-y-0">
            <LecturaGratis profile={profile} />
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.1 }}
              className="mb-16 sm:mb-20"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted/70 mb-4">
                Lo que sigue sale de tu mapa
              </p>
              {interpretation.opening && (
                <p className="text-center font-display italic text-lg sm:text-xl leading-[1.4] text-muted mb-10 max-w-xl mx-auto">
                  {interpretation.opening}
                </p>
              )}
              <p className="font-display italic text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.08] tracking-tight text-accent max-w-2xl">
                {interpretation.summary}
              </p>
              {interpretation.corePattern && (
                <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-xl mt-6">
                  {interpretation.corePattern.whyItMatters}
                </p>
              )}
            </motion.section>

            {/* Las dos alas — fortalezas y tensiones, abriéndose desde el centro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10 mb-16 sm:mb-20">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.25 }}
                className="bg-paper p-8 sm:p-10"
              >
                <h2 className="font-heading text-lg sm:text-xl text-foreground mb-5">Lo que te sostiene</h2>
                {interpretation.strengths.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {interpretation.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground leading-relaxed">
                        <span className="w-3 h-px bg-accent mt-[0.6em] shrink-0" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {interpretation.howYouOperate && (
                  <p className="text-sm text-muted leading-relaxed pt-4 border-t border-ink/10">
                    {interpretation.howYouOperate}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.25 }}
                className="bg-paper-alt p-8 sm:p-10"
              >
                <h2 className="font-heading text-lg sm:text-xl text-foreground mb-5">Lo que pide tu atención</h2>
                {interpretation.tensions.length > 0 && (
                  <ul className="space-y-3 mb-6">
                    {interpretation.tensions.map((t, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                        <span className="w-3 h-px bg-ink/30 mt-[0.6em] shrink-0" aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {interpretation.whatToConsider.length > 0 && (
                  <ul className="space-y-2 pt-4 border-t border-ink/10">
                    {interpretation.whatToConsider.map((c, i) => (
                      <li key={i} className="text-xs text-muted leading-relaxed">{c}</li>
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
                className="section-dark rounded-[--radius-lg] p-8 sm:p-12 mb-16 sm:mb-20 shadow-lg"
              >
                {/* accent-light, no accent: --color-accent (#A83A23) está
                    calibrado contra el papel claro y sobre ink queda en 2.7:1,
                    abajo del 4.5:1 que pide un texto de 12px.
                    --color-accent-light (#D9805F) es el par del mismo acento
                    pensado para superficies oscuras. */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-6 h-px bg-accent-light" aria-hidden="true" />
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light">
                    El punto ciego
                  </p>
                </div>
                {/* text-paper explícito, no heredado: globals.css baja a
                    --color-muted los <p> dentro de .section-dark, lo que acá
                    dejaba el párrafo más importante de la lectura paga en
                    2.93:1 sobre el fondo ink — abajo del piso de 3:1 de WCAG
                    AA incluso contando como texto grande. */}
                <p className="font-display italic text-[clamp(1.4rem,3.4vw,2rem)] leading-[1.3] max-w-2xl text-paper">
                  {interpretation.blindSpot}
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
                <h2 className="font-heading text-lg sm:text-xl text-foreground mb-1">
                  Dónde se nota
                </h2>
                <p className="text-xs text-muted mb-6">
                  El mismo patrón, manifestándose distinto en cada dominio.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/10">
                  {([
                    ["01", "Trabajo", interpretation.lifeAreas.work],
                    ["02", "Vínculos", interpretation.lifeAreas.relationships],
                    ["03", "Decisiones", interpretation.lifeAreas.decisions],
                  ] as const).map(([num, label, body]) => (
                    <div key={label} className="bg-paper p-6 sm:p-7">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-mono text-xs text-accent">{num}</span>
                        <h3 className="font-heading text-sm uppercase tracking-[0.1em] text-foreground">
                          {label}
                        </h3>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{body}</p>
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
                className="text-center mb-16 sm:mb-20 py-8 border-y border-ink/10"
              >
                <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed max-w-xl mx-auto">
                  {interpretation.suggestedNextStep}
                </p>
              </motion.div>
            )}

            {/* Cierre — la síntesis, como colofón */}
            {interpretation.closingSynthesis && (
              <motion.blockquote
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.5 }}
                className="text-center font-display italic text-xl sm:text-2xl leading-[1.5] text-foreground max-w-xl mx-auto mb-16 sm:mb-20"
              >
                &ldquo;{interpretation.closingSynthesis}&rdquo;
              </motion.blockquote>
            )}

            {/* Diferencial Principal de Molino: Conversación contextual con tu mapa */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.55 }}
              className="mb-20 sm:mb-24"
            >
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
          </section>
        )}

        {/* Regalar — bajado de rango (Fase 4). Antes era un bloque en caja de
            acento, con precio, y era LO ÚLTIMO que se leía: la lectura
            terminaba en un upsell. Ahora es una línea al pie, al lado de
            "volver a tu mapa", donde corresponde a una acción secundaria. */}
        <div className="mt-16 pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <Link
            href="/profile"
            className="text-xs font-mono uppercase tracking-[0.15em] text-muted hover:text-accent transition-colors"
          >
            ← Volver a tu mapa
          </Link>
          <p className="text-xs text-muted leading-relaxed">
            ¿Pensaste en alguien mientras leías?{" "}
            <Link href="/regalar" className="text-accent hover:underline underline-offset-4">
              Regalale una lectura
            </Link>{" "}
            — no hace falta que sepas su fecha.
          </p>
        </div>
        </div>
        <PremiumActivationFeedback />
      </section>
    );
  }
