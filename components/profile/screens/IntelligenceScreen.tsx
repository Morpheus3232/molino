"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { ARCHETYPES } from "@/lib/data";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber } from "@/lib/utils/score";
import { fetchSynthesis, fetchInterpretation, type SynthesisResult, type MolinoInterpretationResult } from "@/lib/api/client";
import dynamic from "next/dynamic";
import ShareableImageCard from "@/components/profile/ShareableImageCard";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import PremiumGate from "@/components/profile/PremiumGate";
import DecisionMapSection from "@/components/profile/DecisionMapSection";
import MomentOrientation from "@/components/profile/MomentOrientation";
import Button from "@/components/ui/Button";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import type { ProfileTab } from "@/components/profile/ProfileTabs";
import { analyzeTiming, type TimingIntention } from "@/lib/engines/timingEngine";
import { loadTimingIntention } from "@/lib/session/timingIntention";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";

const ProfileRadar = dynamic(() => import("@/components/charts/ProfileRadar"), { ssr: false });

interface IntelligenceScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function IntelligenceScreen({ profile, onNavigate }: IntelligenceScreenProps) {
  const router = useRouter();
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  const lifePath = safeNumber(profile.lifePath, 1);
  const expressionNumber = safeNumber(profile.expressionNumber, 0);
  const soulNumber = safeNumber(profile.soulNumber, 0);
  const personalityNumber = safeNumber(profile.personalityNumber, 0);
  const name = typeof profile.name === "string" ? profile.name : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const archetype = ARCHETYPES[lifePath];
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

  const [showPremiumGate, setShowPremiumGate] = useState(false);

  const [synthesisData, setSynthesisData] = useState<SynthesisResult | null>(null);
  const [previewInterpretation, setPreviewInterpretation] = useState<MolinoInterpretationResult | null>(null);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);
  const [previewInterpretationError, setPreviewInterpretationError] = useState<string | null>(null);

  useEffect(() => {
    if (!birthDate) return;
    let cancelled = false;
    fetchSynthesis(birthDate, name, true)
      .then((data) => {
        if (!cancelled) {
          setSynthesisData(data);
        }
      })
      .catch((err) => {
        if (!cancelled) setSynthesisError(err.message);
      });
    return () => { cancelled = true; };
  }, [birthDate, name]);

  useEffect(() => {
    // `timing` solo existe una vez que el usuario eligió una intención en /timing
    // (ver loadTimingIntention). No es un requisito real de la API — fetchInterpretation
    // lo declara opcional — así que no debe bloquear este fetch.
    if (!dailyEnergy || !birthDate) return;
    let cancelled = false;
    fetchInterpretation("personal_profile", birthDate, name, { dailyEnergy, timing: timing ?? undefined })
      .then((data) => {
        if (!cancelled) setPreviewInterpretation(data.fallback || null);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Interpretation error:", err);
          setPreviewInterpretationError(
            err instanceof Error ? err.message : "No pudimos cargar tu interpretación."
          );
        }
      });
    return () => { cancelled = true; };
  }, [birthDate, name, dailyEnergy, timing]);

  const dimensions = synthesisData?.dimensions || [];
  const patterns = synthesisData?.patterns || [];

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
              Síntesis, patrones, dimensiones y las conexiones que Molino detecta entre tus sistemas.
            </p>
            <p className="text-sm text-muted mt-3">La síntesis integral que conecta tus sistemas forma parte de Premium — <span className="text-foreground font-semibold">$8 USD</span> · pago único · acceso permanente.</p>
          </motion.div>
        </div>
      </section>

      {/* Tus Dimensiones */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <motion.div {...smoothReveal}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                  <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">Tus dimensiones</h2>
                </div>
                <p className="text-sm text-muted mb-4">Una síntesis simbólica de tu perfil, no una medición científica.</p>
              </motion.div>
              <div className="mt-6">
                <ProfileRadar
                  data={dimensions.map((d) => ({ subject: d.dimension, value: d.value }))}
                  color={elementColor}
                />
              </div>
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
                      <p className="uppercase text-[11px] tracking-[0.15em] text-muted mt-0.5">{dim.influences.join(" + ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium" style={{ color: elementColor }}>{dim.value}</p>
                      <p className="uppercase text-[11px] tracking-[0.15em] text-muted">/ 100</p>
                    </div>
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
        </div>
      </section>

      {/* Tus Patrones */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">Tus patrones</h2>
            </div>
          </motion.div>

          <div className="space-y-0">
            {patterns.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="py-6 border-b border-ink/10 last:border-b-0"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="uppercase text-[11px] tracking-[0.25em] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-muted">{pattern.label}</span>
                </div>
                <p className="font-display text-lg sm:text-xl mb-2" style={{ color: elementColor }}>
                  {pattern.keyword}
                </p>
                <p className="text-sm text-muted leading-relaxed mb-3 max-w-2xl">{pattern.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pattern.sources.map((src) => (
                    <span key={src} className="uppercase text-[11px] tracking-[0.15em] text-muted px-2 py-1 border border-ink/10">
                      {src}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tus Sistemas */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">Tus sistemas</h2>
            </div>
            <p className="text-sm text-muted max-w-xl mb-6">
              Estos sistemas no están aislados. Molino los conecta para construir una lectura integrada.
            </p>
          </motion.div>

          <div className="space-y-0">
            {[
              { title: "Numerolog\u00eda", detail: `Camino de Vida ${lifePath} \u00b7 ${ARCHETYPES[lifePath]?.name || ""}`, href: "/conocimiento/numerologia", color: "var(--element-fire)", system: "El lenguaje de los n\u00fameros" },
              { title: "Astrología", detail: `${sunSign} · ${element} · ${modality}`, href: "/conocimiento/astrologia", color: "var(--layer-astrology)", system: "El mapa del cielo" },
              { title: "Zodiaco Chino", detail: `${chineseZodiac}`, href: "/conocimiento/zodiaco-chino", color: "var(--layer-moment)", system: "El ciclo de los animales" },
              { title: "Arquetipos", detail: archetypeName || archetype?.name || "", href: "/conocimiento/numerologia", color: elementColor, system: "La síntesis de tus patrones" },
            ].map((sys, i) => (
              <motion.button
                key={sys.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => router.push(sys.href)}
                className="w-full flex items-center gap-4 py-6 border-b border-ink/10 last:border-b-0 text-left group hover:pl-3 transition-all"
              >
                <span className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: sys.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{sys.title}</p>
                  <p className="uppercase text-[11px] tracking-[0.15em] text-muted mt-0.5">{sys.detail}</p>
                </div>
                <span className="uppercase text-[11px] tracking-[0.15em] text-muted group-hover:text-accent transition-colors shrink-0">{sys.system} &rarr;</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Explora tus Afinidades */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <DecisionMapSection profile={profile} />
        </div>
      </section>

      {/* Tu momento / Orientación */}
      <MomentOrientation profile={profile} dailyEnergy={dailyEnergy} timing={timing} />

      {/* Tu interpretación */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">Tu interpretación</h2>
          </div>
          {!showPremiumGate ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {previewInterpretation ? (
                <>
                  <div className="space-y-4 pb-4">
                    <p className="font-heading text-lg text-foreground leading-relaxed">{previewInterpretation.summary}</p>
                    <div className="pt-4 border-t border-ink/10">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Qué significa</p>
                      <p className="text-sm text-foreground leading-relaxed">{previewInterpretation.alignment}</p>
                    </div>
                    <div className="pt-4 border-t border-ink/10">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Por qué importa</p>
                      <p className="text-sm text-foreground leading-relaxed">{previewInterpretation.timing}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted mb-4">Una lectura que conecta lo que tus números, tu cielo y tus ciclos dicen en conjunto.</p>
                </>
              ) : previewInterpretationError ? (
                <p className="text-sm text-muted mb-4">
                  No pudimos preparar tu interpretación en este momento. Probá de nuevo más tarde.
                </p>
              ) : (
                <p className="text-sm text-muted mb-4" role="status">Cargando interpretación...</p>
              )}
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-6">
                <span className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">$8 USD</span>
                <span className="text-sm text-muted">Pago único · acceso permanente</span>
              </div>
              <Button
                variant="accent"
                size="lg"
                onClick={() => setShowPremiumGate(true)}
                className="w-full sm:w-auto"
              >
                Leer la síntesis completa
              </Button>
            </motion.div>
          ) : (
            <PremiumGate name={name} birthDate={birthDate}>
              <MolinoInterpretation
                profile={profile}
                type="personal_profile"
                dailyEnergy={dailyEnergy}
                timing={timing ?? undefined}
                label="Interpretación de Molino"
                description="Análisis integrado de tu perfil personal"
              />
            </PremiumGate>
          )}
        </div>
      </section>

      {/* Tu Próximo Movimiento */}
      <section className="py-8 sm:py-12 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">Tu próximo movimiento</h2>
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10">
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => router.push("/explore")}
              className="text-left p-6 bg-background hover:bg-ink/[0.02] transition-colors group"
            >
              <p className="uppercase text-[11px] tracking-[0.2em] text-muted mb-2">Conexiones</p>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">¿Con qué resonás?</p>
              <p className="text-sm text-muted mt-1 leading-relaxed">Explorá compatibilidad con personas, países, marcas y conceptos.</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16, duration: 0.5 }}
              onClick={() => router.push("/academy")}
              className="text-left p-6 bg-background hover:bg-ink/[0.02] transition-colors group"
            >
              <p className="uppercase text-[11px] tracking-[0.2em] text-muted mb-2">Conocimiento</p>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">¿Querés entender el sistema?</p>
              <p className="text-sm text-muted mt-1 leading-relaxed">Explorá numerología, astrología, zodiaco chino y más.</p>
            </motion.button>
          </div>
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
