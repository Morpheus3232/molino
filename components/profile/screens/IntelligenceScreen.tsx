"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import { smoothReveal } from "@/lib/utils/premiumMotion";
import type { ProfileTab } from "@/components/profile/ProfileTabs";
import { analyzeTiming, type TimingIntention } from "@/lib/engines/timingEngine";
import { loadTimingIntention } from "@/lib/session/timingIntention";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { buildPatterns, buildTensions, buildMomentState } from "@/lib/engines/synthesisEngine";

const ProfileRadar = dynamic(() => import("@/components/charts/ProfileRadar"), { ssr: false });

const SYNTHESIS_CACHE = new Map<string, SynthesisResult>();

interface IntelligenceScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function IntelligenceScreen({ profile }: IntelligenceScreenProps) {
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

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

  return (
    <div
      id="panel-intelligence"
      role="tabpanel"
      aria-labelledby="tab-intelligence"
      className="animate-in fade-in duration-300"
    >
      {/* Hero */}
      <section className="py-12 sm:pt-16 pb-8">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <p className="label-micro mb-3">Tu Inteligencia</p>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.05]">
              Tu mapa profundo
            </h1>
            <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
              Lo interesante no está en cada sistema por separado, sino en lo que aparece cuando los miramos juntos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 01 · TU LECTURA — tu motor / tu tensión / tu próximo movimiento: el
          núcleo de la pantalla. Va inmediatamente después del hero, sin nada
          entre medio — antes "Tus dimensiones" (un desglose por-sistema, no
          una convergencia) ocupaba este lugar y hacía que el usuario llegara
          al corazón de Intelligence recién en el tercer scroll. */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">01 · Tu lectura</h2>
          </div>
          {synthesisError && !synthesisData && (
            <div role="status" className="flex items-center gap-2 mb-6">
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
                className="py-8 border-b border-ink/10 last:border-b-0"
              >
                <h2 className="font-display text-2xl sm:text-3xl tracking-tight mb-3" style={{ color: elementColor }}>
                  {pattern.label.toUpperCase()}
                </h2>
                <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-2xl">
                  <span className="font-semibold">{pattern.keyword}.</span> {pattern.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {pattern.sources.map((src) => (
                    <span key={src} className="uppercase text-xs tracking-[0.15em] text-muted px-2 py-1 border border-ink/10">
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
          Molino: no un dato nuevo, sino que dos o más sistemas ya calculados
          apuntan a la misma conclusión. Usa pattern.sources (qué sistemas
          alimentaron cada patrón), no una relación inventada. */}
      {patterns.some((p) => p.sources.length > 1) && (
        <section className="py-8 sm:py-12 border-t border-ink/10">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">02 · Cuando tus sistemas se encuentran</h2>
            </div>
            <div className="space-y-4 max-w-2xl">
              {patterns
                .filter((p) => p.sources.length > 1)
                .map((p) => (
                  <p key={p.label} className="text-sm text-foreground leading-relaxed">
                    <span className="font-semibold">{p.sources.join(" y ")}</span> coinciden en{" "}
                    <span style={{ color: elementColor }}>{p.keyword}</span>: no es una lectura aislada, es lo que
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
        <section className="py-8 sm:py-12 border-t border-ink/10">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">03 · Tus tensiones</h2>
            </div>
            <div className="space-y-8 max-w-2xl">
              {tensions.map((tension) => (
                <div key={tension.title}>
                  <h3 className="font-display text-xl sm:text-2xl tracking-tight mb-3" style={{ color: elementColor }}>
                    {tension.title}
                  </h3>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">{tension.evidence}</p>
                  <p className="text-sm text-muted leading-relaxed mt-3">{tension.implication}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {tension.sources.map((src) => (
                      <span key={src} className="uppercase text-xs tracking-[0.15em] text-muted px-2 py-1 border border-ink/10">
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

      {/* 04 · QUÉ SIGNIFICA PARA VOS — momentState.narrative ya es, en sí
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
        <section className="py-8 sm:py-12 border-t border-ink/10">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">04 · Qué significa para vos</h2>
            </div>
            <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-2xl">
              {momentState.narrative}
            </p>
            <p className="text-sm mt-6">
              <Link href="/hoy" className="text-accent hover:underline">
                Ver tu día de hoy en detalle →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* 05 · DE LA LECTURA A LA ACCIÓN — DecisionMapSection no repite Mundo
          (esa es afinidad con entidades); acá es qué tan preparado está cada
          área de tu vida según decisionsEngine. */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">05 · De la lectura a la acción</h2>
          </div>
          <DecisionMapSection profile={profile} />
        </div>
      </section>

      {/* 06 · SÍNTESIS PROFUNDA — un único paywall (PremiumGate), no dos
          pantallas de venta seguidas. Antes esta sección mostraba gratis el
          resumen, "qué significa" y "por qué importa" de la MISMA
          interpretación que después pedía $8 por leer — pagabas por dos
          campos más del mismo objeto. Ahora el contenido no se filtra: lo
          único que se ve gratis es la propuesta (en PremiumGate), nunca la
          lectura en sí. PremiumGate ya promete "interpretación, no más
          datos" (cómo convergen, qué tensiones, qué significa el momento,
          una recomendación) — se verificó contra intelligenceEngine y no
          hizo falta tocarlo. */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">06 · Síntesis profunda</h2>
          </div>
          <PremiumGate
            name={name}
            birthDate={birthDate}
            preview={{ lifePath, chineseZodiac, pattern: patterns.find((p) => p.label === "Tu motor") ?? null }}
          >
            <MolinoInterpretation
              profile={profile}
              type="personal_profile"
              dailyEnergy={dailyEnergy}
              timing={timing ?? undefined}
              label="Tu síntesis"
              description="La lectura que conecta tus números, tu cielo y tus ciclos en una sola conclusión"
            />
          </PremiumGate>
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
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.2em] text-muted font-semibold mb-6">Para profundizar</p>

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
                      <p className="uppercase text-xs tracking-[0.15em] text-muted mt-0.5">{dim.influences.join(" + ")}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.15em] font-medium shrink-0 ml-4" style={{ color: elementColor }}>
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
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">Compartir</h2>
          </div>
          <ShareableImageCard profile={profile} currentTab="intelligence" />
        </div>
      </section>
    </div>
  );
}
