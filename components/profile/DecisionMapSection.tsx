"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { analyzeDecision, type DecisionCategory } from "@/lib/engines/decisionsEngine";
import { smoothReveal, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import { getScoreColor } from "@/lib/utils/score";
import { ELEMENT_COLORS } from "@/lib/data/constants";

interface DecisionMapSectionProps {
  profile: UserProfile;
}

const DECISION_CATEGORIES: {
  id: DecisionCategory;
  title: string;
  route: string;
  description: string;
}[] = [
  { id: "travel", title: "Viajes", route: "/affinity/recommendations/countries", description: "Destinos compatibles" },
  { id: "career", title: "Entorno profesional", route: "/affinity/recommendations/brands", description: "Marcas y empresas" },
  { id: "personal", title: "Lugares", route: "/affinity/recommendations/countries", description: "Ciudades afines" },
  { id: "creativity", title: "Creatividad", route: "/affinity", description: "Expresión creativa" },
  { id: "health", title: "Bienestar", route: "/affinity", description: "Prácticas alineadas" },
  { id: "education", title: "Formación", route: "/academy", description: "Rutas de conocimiento" },
];

/** Primera oración del template de recomendación — analyzeDecision sigue
 * calculando reasoning/considerations/nextSteps completos, esta sección solo
 * no los renderiza. */
function firstSentence(recommendation: string): string {
  const [sentence] = recommendation.split(". ");
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

/**
 * Encabezado de capítulo — mismo criterio que la lectura:
 * mono uppercase + regla fina, sin caja ni glow.
 */
function ChapterNumber({ number, color }: { number: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6" aria-hidden="true">
      <span className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color }}>
        {number}
      </span>
      <span className="h-px flex-1" style={{ backgroundColor: color, opacity: 0.15 }} />
    </div>
  );
}

export default function DecisionMapSection({ profile }: DecisionMapSectionProps) {
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";

  const decisionResults = useMemo(() => {
    return DECISION_CATEGORIES.map(cat => ({
      ...cat,
      result: analyzeDecision(profile, cat.title, cat.id),
    }));
  }, [profile]);

  return (
    <section className="py-12 sm:py-20 border-t border-ink/10">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...smoothReveal}>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-4">Ahora</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.88] tracking-tight text-foreground uppercase max-w-xl">
            Usá tu mapa para pensar mejor
          </h2>
          <p className="text-sm text-muted mt-4 max-w-lg leading-relaxed">
            Elegí una categoría para ver cómo se lee desde tu mapa.
          </p>
        </motion.div>

        {/* ═══ CATEGORÍAS ═══ */}
        <div className="mt-10 max-w-xl">
          <ChapterNumber number="04 · CATEGORÍAS" color={elementColor} />
          <div className="border-t border-ink/10">
            {decisionResults.map((cat, i) => (
              <motion.div
                key={cat.id}
                {...staggerItemSmooth}
                transition={{ delay: staggerDelay(i, 0.04), duration: 0.3 }}
                className="py-4 border-b border-ink/10 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-foreground">{cat.title}</p>
                  <span
                    className="font-mono text-sm font-semibold tabular-nums shrink-0"
                    style={{ color: getScoreColor(cat.result.overallScore) }}
                  >
                    {Math.round(cat.result.overallScore)}%
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{firstSentence(cat.result.recommendation)}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div {...smoothReveal} className="mt-8">
          <p className="text-xs text-muted leading-relaxed max-w-md italic">
            Herramienta de reflexión personal basada en tradiciones culturales. No constituye predicción científica.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
