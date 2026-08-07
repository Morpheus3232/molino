"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import type { UserProfile } from "@/types/user";
import { buildPatterns, buildTensions, buildRules, buildMomentState } from "@/lib/engines/synthesisEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
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

  const sections = [
    {
      id: "patrones",
      title: "Tus patrones",
      description: "Lo que emerge cuando los sistemas convergen",
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
              <span key={src} className="uppercase text-xs tracking-[0.15em] text-muted px-2 py-1 border border-ink/10">{src}</span>
            ))}
          </div>
        </motion.div>
      )),
    },
    {
      id: "tensiones",
      title: "Tus tensiones",
      description: "Dónde dos sistemas apuntan en direcciones opuestas",
      content: tensions.length > 0 ? tensions.map((t) => (
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
              <span key={src} className="uppercase text-xs tracking-[0.15em] text-muted px-2 py-1 border border-ink/10">{src}</span>
            ))}
          </div>
        </motion.div>
      )) : (
        <p className="text-sm text-muted py-6">No se detectaron tensiones cruzadas significativas en tu perfil.</p>
      ),
    },
    {
      id: "reglas",
      title: "Tus reglas",
      description: "Principios operativos derivados de tu mapa",
      content: rules.length > 0 ? (
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
      ) : (
        <p className="text-sm text-muted py-6">No hay reglas derivadas para este perfil.</p>
      ),
    },
    {
      id: "momento",
      title: "Qué significa para ti ahora",
      description: "La síntesis de tu momento actual",
      content: momentState?.narrative ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="py-6">
          <p className="font-heading text-xl sm:text-2xl leading-[1.5] text-foreground max-w-3xl">
            {momentState.narrative}
          </p>
        </motion.div>
      ) : (
        <p className="text-sm text-muted py-6">Sin datos de momento actual.</p>
      ),
    },
  ];

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
                <span
                  className="text-accent font-mono text-xs uppercase tracking-[0.2em] transition-transform"
                  style={{
                    transform: expanded === section.id ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  {expanded === section.id ? "Cerrar" : "Leer"}
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