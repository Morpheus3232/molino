"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { usePremiumAccess } from "@/lib/hooks/usePremiumAccess";
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
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import type { MolinoInterpretation } from "@/lib/engines/intelligence/types";
import Logo from "@/components/ui/Logo";
import BuildingMolino from "@/components/ui/BuildingMolino";
import LecturaAfinidadesFull from "@/components/lectura/LecturaAfinidadesFull";
import PremiumChatSection from "@/components/chat/PremiumChatSection";
import { Gift } from "lucide-react";

interface Props {
  profile: UserProfile;
  catalog: LightweightEntity[];
}

async function fetchLectura(profile: UserProfile): Promise<MolinoInterpretation | null> {
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
    });
    const data = await res.json();
    if (!res.ok) return null;
    return (data.ai as MolinoInterpretation) ?? (data.fallback as MolinoInterpretation) ?? null;
  } catch {
    return null;
  }
}

export default function LaLecturaExperience({ profile, catalog }: Props) {
  const reduceMotion = useSafeReducedMotion();

  const [interpretation, setInterpretation] = useState<MolinoInterpretation | null>(null);
  const [fetchDone, setFetchDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

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

  // "La Lectura" es un documento único e irrepetible — si ya se generó para
  // este perfil, reabrirla la muestra tal cual quedó, sin recrearla ni
  // repetir la animación de construcción (ver lib/session/lecturaCache.ts).
  // El chequeo vive en este efecto (no en el estado inicial) a propósito:
  // localStorage no existe en el render de servidor, así que leerlo en el
  // inicializador de useState produce un mismatch de hidratación — server y
  // cliente arrancan iguales (revealed=false) y este efecto, que solo corre
  // en el cliente después del mount, resuelve el caché sin ese desajuste.
  useEffect(() => {
    const cached = getCachedLectura(profile.birthDate, profile.name || "");
    if (cached) {
      setInterpretation(cached);
      setFetchDone(true);
      setRevealed(true);
      return;
    }
    // `null` = todavía consultando el entitlement; `false` = hay que pagar.
    // En ninguno de los dos casos tiene sentido disparar la llamada de IA
    // (que puede tardar hasta 55s y, sin acceso, termina en 403 igual).
    if (isPremium !== true) return;
    let cancelled = false;
    fetchLectura(profile).then((result) => {
      if (cancelled) return;
      setInterpretation(result);
      setFetchDone(true);
      if (result) setCachedLectura(profile.birthDate, profile.name || "", result);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.birthDate, profile.name, isPremium]);

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

      <div className="mx-auto max-w-[760px] px-6 sm:px-8 pb-32">
        {/* La IA es un enriquecimiento encima del contenido determinista de
            abajo, no un gate para verlo — mientras carga o si falla, el
            zodíaco/número de la suerte/afinidades siguen disponibles. */}
        {locked ? (
          /* Falta pagar ESTA lectura. PremiumGate ya es el dueño del checkout
             (Mercado Pago, cupón, recuperar compra) y del copy de venta, así
             que se reutiliza tal cual en vez de escribir un segundo paywall
             que después se desincroniza del precio o del flujo de pago. Al
             desbloquear, sus children pasan a renderizarse y el efecto de
             arriba dispara la generación real. */
          <div className="pt-4 pb-16">
            {/* Encabezado del tramo pago. El detalle de qué incluye lo arma
                PremiumGate → PremiumPaywallContent → FeatureComparison, que
                ya es la fuente única del precio y de la tabla gratis/Pro; un
                segundo listado acá se desincronizaría del primero. */}
            <div className="mb-10 border-b border-ink/10 pb-8">
              <p className="font-mono text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-4">
                LECTURA PRO
              </p>
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.9] tracking-tight text-foreground">
                LA CONVERSACIÓN
                <br />
                ENTRE TUS SISTEMAS.
              </h2>
              <p className="mt-6 max-w-xl text-base text-muted leading-relaxed">
                Todo lo de arriba es tuyo y no se paga. Lo que sigue es la parte que cruza los tres
                sistemas en una sola lectura escrita para tu mapa, más las preguntas abiertas sobre
                tus decisiones. Pago único de 8 dólares, acceso permanente — sin suscripción.
              </p>
            </div>
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
          <>
            {/* Panel central — el ícono de este testamento. Antes las tres
                piezas (epígrafe, titular, párrafo) llevaban el mismo
                tratamiento centrado, sin distinguir cuál es la cita, cuál el
                titular y cuál el desarrollo. Ahora solo el epígrafe queda
                centrado (es una cita, no un título); titular y párrafo se
                alinean a la izquierda como el resto de la lectura, con el
                titular en acento — antes tomaba el color de elemento chino,
                que el sistema de diseño reserva a un punto de 8px, nunca a
                un titular entero. */}
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.1 }}
              className="mb-16 sm:mb-20"
            >
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
          </>
        )}

        {/* Companion — contenido determinista, calculado localmente sin IA.
            Espera a `revealed` igual que la lectura narrativa: mostrarlo
            mientras BuildingMolino todavía está en pantalla se leía como
            "ya terminó" a mitad de carga. Primero las 4 lecturas nuevas del
            zodíaco chino, después el número de la suerte, después las
            afinidades. Una sola franja visual (border-t-2) marca dónde
            termina la lectura narrativa (si la hubo) y empieza el material
            de referencia. */}
        {(revealed || locked) && catalog.length > 0 && (
              <div className="border-t-2 border-ink/15 pt-10 mt-4 space-y-14 sm:space-y-16">
                {/* 05 — Tu relación con el mundo: catálogo completo categorizado por relación */}
                <LecturaAfinidadesFull userAnimal={userAnimal} catalog={catalog} />
              </div>
        )}

        <div className="mt-16 rounded-2xl border border-accent/25 bg-accent/[0.04] p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-accent mb-1">
              <Gift className="w-4 h-4" />
              ¿Pensaste en alguien mientras leías esto?
            </span>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              Regalale su propio mapa personal
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed max-w-md">
              No necesitás saber su fecha de nacimiento. Comprás el regalo ($8 USD) y se lo mandás por WhatsApp en un enlace listo para canjear.
            </p>
          </div>
          <Link
            href="/regalar"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-background rounded-xl font-heading text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-accent-hover active:scale-[0.98] transition-all shrink-0 w-full sm:w-auto shadow-md"
          >
            <Gift className="w-4 h-4" />
            Regalar mapa · $8 USD
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link href="/profile" className="text-xs font-mono text-muted hover:text-accent transition-colors">
            ← Volver a tu mapa
          </Link>
        </div>
      </div>
    </section>
  );
}
