"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import type { UserProfile } from "@/types/user";
import { buildPatterns, buildTensions, buildRules, buildMomentState } from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { safeNumber } from "@/lib/utils/score";

interface FullReadingAccordionProps {
  profile: UserProfile;
}

export default function FullReadingAccordion({ profile }: FullReadingAccordionProps) {
  const reduceMotion = useSafeReducedMotion();
  const [expanded, setExpanded] = useState<string | null>(null);

  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const lifePath = safeNumber(profile.lifePath, 1);
  const dailyEnergy = calculateDailyEnergy(profile);

  const patterns = buildPatterns(profile);
  const tensions = buildTensions(profile);
  const rules = buildRules(profile);
  const momentState = buildMomentState(profile, dailyEnergy.overallScore, dailyEnergy.theme);
  const timing = analyzeTiming(profile, new Date(), "start_project");

  const rawSections = [
    {
      id: "patrones",
      title: "Tus patrones",
      description: "Lo que emerge cuando los sistemas convergen",
      hasContent: patterns.length > 0,
      content: patterns.map((p) => (
        <motion.div key={p.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="py-6 border-b border-ink/10 last:border-b-0">
          <h4 className="font-heading text-xl font-semibold mb-2" style={{ color: elementColor }}>
            {p.label.toUpperCase()}
          </h4>
          <p className="text-base text-foreground leading-relaxed max-w-3xl">
            <span className="font-semibold" style={{ color: elementColor }}>{p.keyword}.</span> {p.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.sources.map((src) => (
              <span key={src} className="uppercase text-xs tracking-[0.2em] text-muted px-2 py-1 border border-ink/10">{src}</span>
            ))}
          </div>
        </motion.div>
      )),
    },
    {
      id: "tensiones",
      title: "Tus tensiones",
      description: "Dónde dos sistemas apuntan en direcciones opuestas",
      hasContent: tensions.length > 0,
      content: tensions.map((t) => (
        <motion.div key={t.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="py-6 border-b border-ink/10 last:border-b-0">
          <h4 className="font-heading text-xl font-semibold mb-2" style={{ color: elementColor }}>
            {t.title}
          </h4>
          <p className="text-base text-foreground leading-relaxed">{t.evidence}</p>
          <div className="mt-3 border-l border-ink/10 pl-4">
            <p className="text-sm text-muted leading-relaxed">{t.implication}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {t.sources.map((src) => (
              <span key={src} className="uppercase text-xs tracking-[0.2em] text-muted px-2 py-1 border border-ink/10">{src}</span>
            ))}
          </div>
        </motion.div>
      )),
    },
    {
      id: "reglas",
      title: "Tus reglas",
      description: "Principios operativos derivados de tu mapa",
      hasContent: rules.length > 0,
      content: (
        <ol className="space-y-4">
          {rules.map((r, i) => (
            <motion.li key={r.rule} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }} className="py-4 border-t border-ink/10 first:border-t-0">
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0" style={{ color: elementColor }} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-heading text-lg leading-[1.4] text-foreground">{r.rule}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="w-6 h-px bg-accent/50 shrink-0" aria-hidden="true" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{r.source}</span>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      ),
    },
    {
      id: "momento",
      title: "Qué significa para ti ahora",
      description: "La síntesis de tu momento actual",
      hasContent: !!momentState?.narrative,
      content: (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="py-6">
          <p className="text-base text-foreground leading-relaxed max-w-3xl">
            {momentState?.narrative}
          </p>
        </motion.div>
      ),
    },
    {
      id: "timing",
      title: "Tu timing",
      description: "Momentos favorables según tu ciclo personal",
      hasContent: true,
      content: (
        <div className="py-6 space-y-4">
          <div>
            <p className="label-micro text-muted mb-1">Score actual</p>
            <p className="font-heading text-2xl font-semibold" style={{ color: elementColor }}>{timing.timingScore}/100</p>
          </div>
          <div>
            <p className="label-micro text-muted mb-1">Ventana recomendada</p>
            <p className="text-base text-foreground leading-relaxed">{timing.recommendedWindow}</p>
          </div>
          <div>
            <p className="label-micro text-muted mb-1">Explicación</p>
            <p className="text-sm text-foreground leading-relaxed">{timing.explanation}</p>
          </div>
          {timing.favorableDimensions.length > 0 && (
            <div>
              <p className="label-micro text-muted mb-2">Dimensiones favorables</p>
              <div className="flex flex-wrap gap-1.5">
                {timing.favorableDimensions.map((d) => (
                  <span key={d} className="text-xs font-mono uppercase tracking-[0.2em] px-2 py-1 border border-ink/10 text-foreground">{d}</span>
                ))}
              </div>
            </div>
          )}
          {timing.challengingDimensions.length > 0 && (
            <div>
              <p className="label-micro text-muted mb-2">Dimensiones desafiantes</p>
              <div className="flex flex-wrap gap-1.5">
                {timing.challengingDimensions.map((d) => (
                  <span key={d} className="text-xs font-mono uppercase tracking-[0.2em] px-2 py-1 border border-ink/10 text-muted">{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "evolucion",
      title: "Tu evolución",
      description: "Cómo se conectan tus ciclos con tu camino",
      hasContent: true,
      content: (
        <div className="py-6 space-y-6">
          <div>
            <p className="label-micro text-muted mb-1">Año personal</p>
            <p className="font-heading text-xl font-semibold" style={{ color: elementColor }}>{dailyEnergy.personalYear}</p>
            <p className="text-sm text-muted mt-1">Tema: {dailyEnergy.theme}</p>
          </div>
          <div>
            <p className="label-micro text-muted mb-1">Mes personal</p>
            <p className="font-heading text-xl font-semibold" style={{ color: elementColor }}>{dailyEnergy.personalMonth}</p>
          </div>
          <div className="border-t border-ink/10 pt-4">
            <p className="label-micro text-muted mb-2">Energía por áreas</p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(dailyEnergy.areas).map(([key, area]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted capitalize">{key === "relationships" ? "Relaciones" : key}</span>
                    <span className="font-mono text-xs text-foreground">{area.score}%</span>
                  </div>
                  <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${area.score}%`, backgroundColor: area.score >= 60 ? "var(--score-excellent)" : area.score >= 45 ? "var(--score-good)" : "var(--score-poor)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Solo se listan las secciones con contenido real — una tarjeta que abre
  // para decir "no hay nada acá" no ayuda a nadie.
  const sections = rawSections.filter((s) => s.hasContent);

  return (
    <section className="py-16 sm:py-24" aria-labelledby="reading-heading">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduceMotion ? 0.1 : 0.5 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
            04 · La lectura profunda
          </p>
          <h2 id="reading-heading" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[1.05] max-w-2xl mb-8">
            La conversación entre tus sistemas
          </h2>
          <p className="text-base text-muted leading-relaxed max-w-xl mb-10">
            Hasta ahora viste las piezas. Aquí aparece la conversación entre ellas —
            tu identidad, tus ciclos y tus patrones vistos como un solo sistema.
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="border border-ink/10 rounded-lg overflow-hidden bg-ink/[0.015]"
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === section.id ? null : section.id)}
                aria-expanded={expanded === section.id}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div>
                  <p className="font-heading text-lg font-semibold text-foreground">{section.title}</p>
                  <p className="text-sm text-muted mt-0.5">{section.description}</p>
                </div>
                <span className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-[0.2em] shrink-0">
                  {expanded === section.id ? "Cerrar" : "Leer"}
                  <ChevronDown
                    aria-hidden="true"
                    focusable="false"
                    className="w-3.5 h-3.5 transition-transform"
                    style={{ transform: expanded === section.id ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </span>
              </button>

              <AnimatePresence>
                {expanded === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-ink/10">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}