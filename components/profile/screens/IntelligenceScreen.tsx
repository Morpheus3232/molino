"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber, getScoreLabel } from "@/lib/utils/score";
import { fetchSynthesis, type SynthesisResult } from "@/lib/api/client";
import { useCachedFetch } from "@/lib/hooks/useCachedFetch";
import dynamic from "next/dynamic";
import ShareableImageCard from "@/components/profile/ShareableImageCard";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import PremiumGate from "@/components/profile/PremiumGate";
import DecisionMapSection from "@/components/profile/DecisionMapSection";
import ChatWithMolino from "@/components/profile/ChatWithMolino";
import { smoothReveal } from "@/lib/utils/premiumMotion";
import type { ProfileTab } from "@/components/profile/ProfileTabs";
import { analyzeTiming, type TimingIntention } from "@/lib/engines/timingEngine";
import { loadTimingIntention } from "@/lib/session/timingIntention";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import type { MolinoInterpretation as MolinoInterpretationType } from "@/lib/engines/intelligenceEngine";
import { buildPatterns, buildTensions, buildRules, buildMomentState } from "@/lib/engines/synthesisEngine";

const ProfileRadar = dynamic(() => import("@/components/charts/ProfileRadar"), { ssr: false });

const SYNTHESIS_CACHE = new Map<string, SynthesisResult>();

interface IntelligenceScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

/** Cabecera de capítulo — la firma editorial de la pantalla: número grande en
 * el color del elemento, regla de transición y título. Puramente presentacional. */
function ChapterHeader({ number, title, elementColor }: { number: string; title: string; elementColor: string }) {
  return (
    <div className="mb-10 sm:mb-14">
      <div className="flex items-center gap-4 sm:gap-6 mb-5 sm:mb-6">
        <span className="number-display text-4xl sm:text-6xl leading-none" style={{ color: elementColor }} aria-hidden="true">
          {number}
        </span>
        <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
      </div>
      <h2 className="font-display text-3xl sm:text-4xl tracking-tight leading-[1.02] text-foreground">
        <span className="sr-only">Capítulo {number}. </span>
        {title}
      </h2>
    </div>
  );
}

/** Cabecera de cierre (apéndice) — sin número, para "Para profundizar" y "Compartir". */
function BackmatterHeader({ title }: { title: string }) {
  return (
    <div className="mb-8 sm:mb-10">
      <span className="block w-10 h-0.5 bg-accent/60 mb-5" aria-hidden="true" />
      <h2 className="font-display text-3xl sm:text-4xl tracking-tight leading-[1.05] text-foreground">
        {title}
      </h2>
    </div>
  );
}

export default function IntelligenceScreen({ profile }: IntelligenceScreenProps) {
  const prefersReducedMotion = useSafeReducedMotion();
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);
  // Lectura Premium resuelta por MolinoInterpretation — se eleva aquí para
  // alimentar el export sin re-generar (sin coste extra de IA).
  const [aiInterpretation, setAiInterpretation] = useState<MolinoInterpretationType | null>(null);

  const lifePath = safeNumber(profile.lifePath, 1);
  const name = typeof profile.name === "string" ? profile.name : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";
  const element = typeof profile.element === "string" ? profile.element : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile), [profile]);

  // Lectura diferida a post-mount: loadTimingIntention() toca localStorage,
  // que no existe en el render de servidor.
  const [savedIntention, setSavedIntention] = useState<TimingIntention | null>(null);
  useEffect(() => {
    setSavedIntention(loadTimingIntention());
  }, []);

  const timing = useMemo(
    () => (savedIntention ? analyzeTiming(profile, new Date(), savedIntention) : null),
    [profile, savedIntention]
  );

  // Fallback local — los mismos motores puros que la API llama. Si la síntesis
  // remota falla o tarda, la pantalla nunca queda vacía.
  const localPatterns = useMemo(() => buildPatterns(profile), [profile]);
  const tensions = useMemo(() => buildTensions(profile), [profile]);
  const rules = useMemo(() => buildRules(profile), [profile]);
  const localMomentState = useMemo(
    () => buildMomentState(profile, dailyEnergy.overallScore, dailyEnergy.theme),
    [profile, dailyEnergy.overallScore, dailyEnergy.theme]
  );

  const synthesisKey = birthDate ? `${birthDate}:${name}` : "";
  const { data: synthesisData, error: synthesisError, retry: retrySynthesis } = useCachedFetch(
    SYNTHESIS_CACHE,
    synthesisKey,
    () => fetchSynthesis(birthDate, name, true)
  );

  // API data takes precedence; local fallback fills gaps instantly.
  // `dimensions` needs a name to vary — without one, 4 of 5 collapse to the
  // same value (lp*10). The onboarding never asks for a name, so
  // `dateDimensions` is the correct fallback.
  const dimensions = (name ? synthesisData?.dimensions : synthesisData?.dateDimensions) || [];
  const patterns = synthesisData?.patterns ?? localPatterns;
  const momentState = synthesisData?.momentState ?? localMomentState;

  // Reveal de capítulo — el header de cada capítulo entra con un fade+rise
  // suave al entrar al viewport. Con prefers-reduced-motion, sin animación.
  const chapterReveal = {
    ...smoothReveal,
    initial: prefersReducedMotion ? false : smoothReveal.initial,
  };

  return (
    <div
      id="panel-intelligence"
      role="tabpanel"
      aria-labelledby="tab-intelligence"
      className="animate-in fade-in duration-300"
    >
      {/* Portada */}
      <section className="pt-14 sm:pt-20 pb-12 sm:pb-16">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <span className="block w-10 h-0.5 mb-5" style={{ backgroundColor: elementColor }} aria-hidden="true" />
            <p className="label-micro mb-3">Tu lectura</p>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.05]">
              La conversación entre tus sistemas
            </h1>
            <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
              Hasta ahora viste las piezas. Aquí aparece la conversación
              entre ellas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 01 · TU LECTURA — tu motor / tu tensión / tu próximo movimiento: el
          núcleo de la pantalla. Va inmediatamente después del hero, sin nada
          entre medio — antes "Tus dimensiones" (un desglose por-sistema, no
          una convergencia) ocupaba este lugar y hacía que el usuario llegara
          al corazón de Intelligence recién en el tercer scroll. */}
      <section className="pt-2 sm:pt-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...chapterReveal}>
            <ChapterHeader number="01" title="Tu lectura" elementColor={elementColor} />
          </motion.div>
          {synthesisError && !synthesisData && (
            <div role="status" className="flex items-center gap-2 mb-8">
              <p className="text-xs text-muted">Mostrando tu lectura calculada localmente.</p>
              <button
                type="button"
                onClick={retrySynthesis}
                className="text-xs text-accent hover:underline"
              >
                Reintentar síntesis completa
              </button>
            </div>
          )}
          <div className="space-y-0">
            {patterns.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="py-7 sm:py-8 border-b border-ink/10 last:border-b-0"
              >
                <h3 className="font-heading text-2xl sm:text-3xl tracking-tight mb-3" style={{ color: elementColor }}>
                  {pattern.label.toUpperCase()}
                </h3>
                <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-3xl">
                  <span className="font-heading font-semibold" style={{ color: elementColor }}>
                    {pattern.keyword}.
                  </span>{" "}
                  {pattern.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {pattern.sources.map((src) => (
                    <span key={src} className="uppercase text-xs tracking-[0.2em] text-muted px-2 py-1 border border-ink/10">
                      {src}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 · CUANDO TUS SISTEMAS SE ENCUENTRAN — el diferencial real de
          // Unidad: no un dato nuevo, sino que dos o más sistemas ya calculados
          apuntan a la misma conclusión. Usa pattern.sources (qué sistemas
          alimentaron cada patrón), no una relación inventada. */}
      {patterns.some((p) => p.sources.length > 1) && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...chapterReveal}>
              <ChapterHeader number="02" title="Cuando tus sistemas se encuentran" elementColor={elementColor} />
            </motion.div>
            <div className="space-y-5 max-w-3xl">
              {patterns
                .filter((p) => p.sources.length > 1)
                .map((p) => (
                  <p key={p.label} className="text-base sm:text-lg text-foreground leading-relaxed">
                    <span className="font-heading font-semibold">{p.sources.join(" y ")}</span> coinciden en{" "}
                    <span className="font-heading font-semibold" style={{ color: elementColor }}>{p.keyword}</span>
                    : no es una lectura aislada, es lo que
                    aparece cuando ambos sistemas se miran juntos.
                  </p>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 03 · TUS TENSIONES — el reverso de "02": ahí dos sistemas COINCIDEN,
          acá dos sistemas ya calculados apuntan en direcciones DISTINTAS.
          buildTensions() solo declara una tensión cuando hay una
          contradicción real y trazable (ritmo del Life Path vs. ritmo del
          elemento) — si no la hay, la sección entera no se renderiza en vez
          de mostrar una tensión débil o inventada. No oculta la
          contradicción: la explica (evidence) y dice qué significa
          (implication), sin resolverla como si una señal fuera la correcta. */}
      {tensions.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...chapterReveal}>
              <ChapterHeader number="03" title="Tus tensiones" elementColor={elementColor} />
            </motion.div>
            <div className="space-y-10 sm:space-y-12 max-w-3xl">
              {tensions.map((tension) => (
                <div key={tension.title}>
                  <h3 className="font-heading text-2xl sm:text-3xl tracking-tight mb-3" style={{ color: elementColor }}>
                    {tension.title}
                  </h3>
                  <p className="text-base sm:text-lg text-foreground leading-relaxed">{tension.evidence}</p>
                  <div className="mt-4 border-l border-ink/10 pl-4 sm:pl-5">
                    <p className="text-sm sm:text-base text-muted leading-relaxed">{tension.implication}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {tension.sources.map((src) => (
                      <span key={src} className="uppercase text-xs tracking-[0.2em] text-muted px-2 py-1 border border-ink/10">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 04 · TUS REGLAS — deterministas (buildRules, sin IA), no relleno
          motivacional genérico: cada regla cita el rasgo/patrón real del que
          sale (ver source en el chip debajo de cada una). Nunca fuerza un
          conteo fijo — un perfil con menos señales reales muestra menos
          reglas, en vez de inventar hasta completar diez. */}
      {rules.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...chapterReveal}>
              <ChapterHeader number="04" title="Tus reglas" elementColor={elementColor} />
            </motion.div>
            <ol className="max-w-4xl">
              {rules.map((r, i) => (
                <motion.li
                  key={r.rule}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                  className="relative py-9 sm:py-12 border-t border-ink/10 first:border-t-0"
                >
                  <div className="flex items-start gap-5 sm:gap-8">
                    <span
                      className="number-display shrink-0 text-5xl sm:text-6xl"
                      style={{ color: elementColor }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 pt-1 sm:pt-2">
                      <p className="font-heading text-2xl sm:text-3xl leading-[1.4] tracking-tight text-foreground">
                        {r.rule}
                      </p>
                      <div className="flex items-center gap-3 mt-4 sm:mt-5">
                        <span className="w-8 h-px bg-accent/50 shrink-0" aria-hidden="true" />
                        <span className="font-mono text-xs sm:text-xs uppercase tracking-[0.2em] text-muted">
                          {r.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 05 · QUÉ SIGNIFICA PARA VOS — momentState.narrative ya es, en sí
          misma, una síntesis cruzada (ciclo numerológico + energía del día +
          elemento astrológico + Life Path) en una sola oración. Antes esto
          vivía adentro de un <MomentOrientation> entero que repetía la
          postura ACTUAR/ESPERAR/OBSERVAR y la grilla de evidencia que YA
          muestra /hoy (con más contexto: racha, continuidad ayer/hoy).
          Mantener esa duplicación completa acá competía con el clímax de la
          pantalla sin agregar nada que /hoy no hiciera mejor — se eliminó el
          componente (sin otros consumidores). Lo que sí es exclusivo de acá
          — la traducción de esta lectura a "qué significa ahora" — se
          conserva en una sola oración. */}
      {momentState?.narrative && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <motion.div {...chapterReveal}>
              <ChapterHeader number="05" title="Qué significa para vos" elementColor={elementColor} />
            </motion.div>
            <motion.div {...chapterReveal}>
              <p className="font-heading text-xl sm:text-2xl lg:text-3xl leading-[1.5] text-foreground max-w-3xl">
                {momentState.narrative}
              </p>
              <p className="mt-8">
                <Link href="/hoy" className="text-accent hover:underline text-sm sm:text-base inline-flex items-center gap-2">
                  Ver tu día de hoy en detalle
                  <span aria-hidden="true">→</span>
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* 06 · DE LA LECTURA A LA ACCIÓN — DecisionMapSection no repite Mundo
          (esa es afinidad con entidades); acá es qué tan preparado está cada
          área de tu vida según decisionsEngine. */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...chapterReveal}>
            <ChapterHeader number="06" title="De la lectura a la acción" elementColor={elementColor} />
          </motion.div>
          <DecisionMapSection profile={profile} />
        </div>
      </section>

      {/* 07 · SÍNTESIS PROFUNDA — un único paywall (PremiumGate), no dos
          pantallas de venta seguidas. Antes esta sección mostraba gratis el
          resumen, "qué significa" y "por qué importa" de la MISMA
          interpretación que después pedía $8 por leer — pagabas por dos
          campos más del mismo objeto. Ahora el contenido no se filtra: lo
          único que se ve gratis es la propuesta (en PremiumGate), nunca la
          lectura en sí. PremiumGate ya promete "interpretación, no más
          datos" (cómo convergen, qué tensiones, qué significa el momento,
          una recomendación) — se verificó contra intelligenceEngine y no
          hizo falta tocarlo. */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...chapterReveal}>
            <ChapterHeader number="07" title="Síntesis profunda" elementColor={elementColor} />
          </motion.div>
          <motion.div {...chapterReveal} className="max-w-2xl">
            <p className="font-heading text-xl sm:text-2xl leading-[1.5] text-foreground mb-8">
              Hasta ahora viste las piezas. Aquí aparece la conversación
              entre ellas — tu identidad, tus ciclos y tus patrones vistos
              como un solo sistema.
            </p>
          </motion.div>
          <PremiumGate
            name={name}
            birthDate={birthDate}
            preview={{ lifePath, chineseZodiac, pattern: patterns[0] ?? null }}
          >
            <MolinoInterpretation
              profile={profile}
              type="personal_profile"
              dailyEnergy={dailyEnergy}
              timing={timing ?? undefined}
              label="Tu síntesis"
              description="La lectura que conecta tus números, tu cielo y tus ciclos en una sola conclusión"
              onInterpretationReady={setAiInterpretation}
            />
          </PremiumGate>
        </div>
      </section>

      {/* 08 · PREGUNTALE A TU MOLINO — el chat contextual, no un asistente
          genérico: cada pregunta se responde SOLO con el perfil, patrones y
          tensiones ya calculados de este usuario (ver el caso "question" en
          intelligenceEngine.ts), distinguiendo dato calculado / interpretación
          simbólica / recomendación en la propia respuesta. Gating vía
          usePremiumAccess (no un segundo PremiumGate) — ver el comentario en
          ese hook sobre por qué no se reutiliza el paywall de la sección 06. */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...chapterReveal}>
            <ChapterHeader number="08" title="Preguntale a tu mapa" elementColor={elementColor} />
          </motion.div>
          <p className="text-sm text-muted mb-8 max-w-xl">
            Una pregunta concreta sobre tu momento, tu perfil o una decisión — respondida solo con lo que tu mapa ya calculó sobre vos.
          </p>
          <ChatWithMolino profile={profile} />
        </div>
      </section>

      {/* Para profundizar — Dimensiones + Sistemas, demovidos a referencia
          secundaria. Antes "Tus dimensiones" abría la pantalla con un radar
          a página completa (mismo contenido que el Adelanto del onboarding,
          ver dateDimensions más arriba) y "Tus sistemas" era una sección
          entera de navegación entre el clímax y la acción. Ninguna de las
          dos es parte de la síntesis (son desglose por-sistema o links de
          salida), así que quedan acá, después de que la lectura ya terminó,
          en un formato compacto que no compite con ella. No se elimina
          capacidad: los 4 links a /conocimiento/* y el detalle de
          dimensiones siguen disponibles. */}
      <section className="pt-20 sm:pt-28 pb-20 sm:pb-24 border-t border-ink/10 mt-4">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...chapterReveal}>
            <BackmatterHeader title="Para profundizar" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start mb-10">
            <div>
              <p className="text-sm text-muted mb-4">
                Tus dimensiones — la misma lectura de tu Adelanto, ahora con tu perfil completo.
              </p>
              {synthesisError && !synthesisData && (
                <p className="text-sm text-muted mb-4" role="alert">
                  No pudimos cargar esta parte de tu mapa.{" "}
                  <button type="button" onClick={retrySynthesis} className="text-accent hover:underline">
                    Reintentar
                  </button>
                </p>
              )}
              <ProfileRadar
                data={dimensions.map((d) => ({ subject: d.dimension, value: d.value }))}
                color={elementColor}
              />
            </div>

            <div className="space-y-0">
              {dimensions.map((dim, i) => (
                <motion.button
                  key={dim.dimension}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  onClick={() => setExpandedDimension(expandedDimension === dim.dimension ? null : dim.dimension)}
                  aria-expanded={expandedDimension === dim.dimension}
                  className="w-full text-left py-4 border-b border-ink/10 last:border-b-0 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{dim.dimension}</p>
                      <p className="uppercase text-xs tracking-[0.2em] text-muted mt-0.5">{dim.influences.join(" + ")}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] font-medium shrink-0 ml-4" style={{ color: elementColor }}>
                      {getScoreLabel(dim.value)}
                    </p>
                  </div>
                  <AnimatePresence>
                    {expandedDimension === dim.dimension && (
                      <motion.div
                        key="expanded"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-muted mt-3 leading-relaxed border-t border-ink/10 pt-3">{dim.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted max-w-xl mb-4 pt-6 border-t border-ink/10">
            Tus sistemas por separado:
          </p>
          <p className="text-sm leading-relaxed">
            {[
              { title: "Numerología", href: "/conocimiento/numerologia" },
              { title: "Astrología", href: "/conocimiento/astrologia" },
              { title: "Zodiaco Chino", href: "/conocimiento/zodiaco-chino" },
              { title: "Arquetipos", href: "/conocimiento/numerologia" },
            ].map((sys, i, arr) => (
              <span key={sys.title}>
                <Link href={sys.href} className="text-foreground hover:text-accent transition-colors underline underline-offset-4 decoration-ink/20">
                  {sys.title}
                </Link>
                {i < arr.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Compartir */}
      <section className="pt-20 sm:pt-28 pb-20 sm:pb-24 border-t border-ink/10 mt-4">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...chapterReveal}>
            <BackmatterHeader title="Compartir" />
          </motion.div>
          <ShareableImageCard
            profile={profile}
            currentTab="intelligence"
            interpretation={aiInterpretation}
            patterns={patterns}
            tensions={tensions}
            momentState={momentState}
            dailyEnergy={dailyEnergy}
          />
        </div>
      </section>
    </div>
  );
}
