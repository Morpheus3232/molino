"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { ARCHETYPES } from "@/lib/data";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber } from "@/lib/utils/score";
import {
  buildSynthesisInsights,
  buildPatterns,
  buildDimensions,
} from "@/lib/engines/synthesisEngine";
import dynamic from "next/dynamic";
import ShareableImageCard from "@/components/profile/ShareableImageCard";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import DecisionMapSection from "@/components/profile/DecisionMapSection";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import CrossLinks from "@/components/profile/CrossLinks";
import type { ProfileTab } from "@/components/profile/ProfileTabs";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";

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

  const synthesisInsights = useMemo(() => buildSynthesisInsights(profile), [profile]);
  const patterns = useMemo(() => buildPatterns(profile), [profile]);
  const dimensions = useMemo(() => buildDimensions(profile), [profile]);
  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile, new Date()), [profile]);
  const timing = useMemo(() => analyzeTiming(profile, new Date(), "start_project"), [profile]);

  return (
    <div
      id="panel-intelligence"
      role="tabpanel"
      aria-labelledby="tab-intelligence"
      className="animate-in fade-in duration-300"
    >
      {/* Hero */}
      <section className="py-12 sm:pt-16 pb-8">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">Tu Inteligencia</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Tu mapa profundo
            </h1>
            <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
              Síntesis, patrones, dimensiones y las conexiones que Molino detecta entre tus sistemas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* La Síntesis */}
      <section className="py-8 sm:py-12 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">La síntesis</h2>
            </div>
          </motion.div>

          <div className="mt-8 space-y-8">
            {synthesisInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="py-6 border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] font-medium" style={{
                    color: insight.type === "identity" ? elementColor :
                           insight.type === "tension" ? "var(--layer-moment)" :
                           insight.type === "strength" ? "var(--score-excellent)" :
                           insight.type === "attention" ? "var(--score-neutral)" :
                           "var(--score-good)"
                  }}>
                    {insight.title}
                  </p>
                </div>
                <p className="text-base sm:text-lg text-foreground leading-relaxed">{insight.text}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {insight.sources.map((src) => (
                    <span key={src} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-1 rounded-full border border-border">
                      {src}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tus Patrones */}
      <section className="py-8 sm:py-12 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus patrones</h2>
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {patterns.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <p className="number-display text-5xl sm:text-6xl text-muted/10 leading-none mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-medium mb-2">{pattern.label}</p>
                <p className="font-serif text-xl sm:text-2xl font-semibold mb-2" style={{ color: elementColor }}>
                  {pattern.keyword}
                </p>
                <p className="text-sm text-muted leading-relaxed mb-3">{pattern.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pattern.sources.map((src) => (
                    <span key={src} className="text-[9px] uppercase tracking-[0.15em] text-muted font-medium px-2 py-0.5 rounded-full border border-border">
                      {src}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tus Dimensiones */}
      <section className="py-8 sm:py-12 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <motion.div {...smoothReveal}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-border" aria-hidden="true" />
                  <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus dimensiones</h2>
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
                  className="w-full text-left py-5 border-b border-border last:border-b-0 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{dim.dimension}</p>
                      <p className="text-xs text-muted mt-1">{dim.influences.join(" + ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-2xl font-semibold" style={{ color: elementColor }}>{dim.value}</p>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-muted">/ 100</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedDimension === dim.dimension && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-muted mt-3 leading-relaxed">{dim.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tus Sistemas */}
      <section className="py-8 sm:py-12 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus sistemas</h2>
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
                className="w-full flex items-center gap-5 py-6 border-b border-border last:border-b-0 text-left group hover:pl-4 transition-all"
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sys.color }} />
                <div className="flex-1">
                  <p className="font-serif text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors">{sys.title}</p>
                  <p className="text-sm text-muted mt-1">{sys.detail}</p>
                </div>
                <span className="text-xs text-muted group-hover:text-accent transition-colors shrink-0">{sys.system} &rarr;</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Explora tus Afinidades */}
      <section className="py-8 sm:py-12 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <DecisionMapSection profile={profile} />
        </div>
      </section>

      {/* Tu Próximo Movimiento */}
      <section className="py-8 sm:py-12 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu próximo movimiento</h2>
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => router.push("/decisions")}
              className="text-left p-6 rounded-2xl border border-border bg-card hover:border-accent transition-colors group"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Decisiones</p>
              <p className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">¿Qué estás decidiendo?</p>
              <p className="text-sm text-muted mt-1 leading-relaxed">Escribí una decisión y Molino la analiza desde tu perfil, tu energía y tu momento.</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.5 }}
              onClick={() => router.push("/explore")}
              className="text-left p-6 rounded-2xl border border-border bg-card hover:border-accent transition-colors group"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Conexiones</p>
              <p className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">¿Con qué resonás?</p>
              <p className="text-sm text-muted mt-1 leading-relaxed">Explorá compatibilidad con personas, países, marcas y conceptos.</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16, duration: 0.5 }}
              onClick={() => router.push("/academy")}
              className="text-left p-6 rounded-2xl border border-border bg-card hover:border-accent transition-colors group"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Conocimiento</p>
              <p className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">¿Querés entender el sistema?</p>
              <p className="text-sm text-muted mt-1 leading-relaxed">Explorá numerología, astrología, zodiaco chino y más.</p>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Compartir + Interpretación */}
      <section className="py-8 sm:py-12 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Compartir</h2>
              </div>
              <ShareableImageCard profile={profile} currentTab="intelligence" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tu interpretación</h2>
              </div>
              <MolinoInterpretation
                profile={profile}
                type="personal_profile"
                dailyEnergy={dailyEnergy}
                timing={timing}
                label="Interpretación de Molino"
                description="Análisis integrado de tu perfil personal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      {onNavigate && (
        <CrossLinks
          links={[
            { label: "Descubrí qué resuena con vos", description: "Marcas, destinos y entidades que conectan con tu perfil.", onClick: () => onNavigate("world") },
            { label: "¿Quién comparte tu energía?", description: "Aliados, opuestos y personas de tu mismo signo.", onClick: () => onNavigate("circle") },
            { label: "Volvé a tu identidad", description: "Revisá tu perfil base y arquetipo.", onClick: () => onNavigate("identity") },
          ]}
        />
      )}
    </div>
  );
}
