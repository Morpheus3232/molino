"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { analyzeDecision, CATEGORY_LABELS, type DecisionCategory, type DecisionResult } from "@/lib/engines/decisionsEngine";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import { getScoreColor, getScoreLabel } from "@/lib/utils/score";

interface DecisionMapSectionProps {
  profile: UserProfile;
}

const DECISION_CATEGORIES: {
  id: DecisionCategory;
  title: string;
  route: string;
  description: string;
}[] = [
  { id: "travel", title: "Viajes", route: "/affinity/recommendations/countries", description: "Explorá destinos compatibles con tu energía" },
  { id: "career", title: "Entorno profesional", route: "/affinity/recommendations/brands", description: "Marcas y empresas con presencia en tu mapa" },
  { id: "personal", title: "Lugares", route: "/affinity/recommendations/countries", description: "Ciudades y espacios con presencia en tu mapa" },
  { id: "creativity", title: "Creatividad", route: "/affinity", description: "Entidades que potencian tu expresión" },
  { id: "health", title: "Bienestar", route: "/affinity", description: "Símbolos de equilibrio y cuidado" },
  { id: "education", title: "Aprendizaje", route: "/academy", description: "Rutas de conocimiento para tu perfil" },
];

export default function DecisionMapSection({ profile }: DecisionMapSectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<DecisionCategory | null>(null);

  // Pregunta libre
  const [question, setQuestion] = useState("");
  const [freeResult, setFreeResult] = useState<DecisionResult | null>(null);

  const decisionResults = useMemo(() => {
    return DECISION_CATEGORIES.map(cat => ({
      ...cat,
      result: analyzeDecision(profile, cat.title, cat.id),
    }));
  }, [profile]);

  const selectedResult = useMemo(() => {
    if (freeResult) return freeResult;
    if (!selectedCategory) return null;
    return decisionResults.find(d => d.id === selectedCategory)?.result ?? null;
  }, [selectedCategory, decisionResults, freeResult]);

  const handleFreeQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    const result = analyzeDecision(profile, question.trim(), selectedCategory || "career");
    setFreeResult(result);
  };

  const resetFreeResult = () => {
    setFreeResult(null);
    setQuestion("");
  };

  return (
    <section className="py-12 sm:py-16 border-t border-ink/10">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">Tu pregunta</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Cualquier decisión puede leerse desde tu mapa. Escribí lo que estás por decidir o explorá una categoría.
          </p>
        </motion.div>

        {/* ═══ PREGUNTA LIBRE — punto de entrada principal ═══ */}
        <AnimatePresence mode="wait">
          {!freeResult ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleFreeQuestion}
              className="mt-8 max-w-lg space-y-4"
            >
              <div>
                <label htmlFor="decision-question" className="label-micro block mb-2">
                  ¿Qué estás tratando de decidir?
                </label>
                <textarea
                  id="decision-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ej: ¿Es buen momento para mudarme?"
                  rows={3}
                  className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-base placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={!question.trim()}
                className="w-full text-center text-sm font-medium px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Analizar desde mi mapa
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs text-muted italic">&ldquo;{freeResult.question}&rdquo;</p>
                <button type="button" onClick={resetFreeResult} className="text-xs text-accent hover:underline">
                  Nueva pregunta
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ RESULTADO (pregunta libre o categoría) ═══ */}
        <AnimatePresence>
          {selectedResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <DecisionDetail result={selectedResult} profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ EXPLORAR POR CATEGORÍA ═══ */}
        {!freeResult && (
          <div className="mt-10">
            <p className="label-micro mb-4">O explorá por categoría</p>
            <motion.div {...staggerApple}>
              {decisionResults.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  {...staggerItemSmooth}
                  transition={{ delay: staggerDelay(i, 0.06), duration: 0.3 }}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  aria-expanded={selectedCategory === cat.id}
                  className="w-full text-left py-5 border-b border-ink/10 last:border-b-0 group transition-all hover:pl-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{cat.title}</p>
                      <p className="text-sm text-muted leading-relaxed mt-0.5">{cat.description}</p>
                    </div>
                    <span
                      className="uppercase text-xs tracking-[0.15em] font-medium shrink-0"
                      style={{ color: getScoreColor(cat.result.overallScore) }}
                    >
                      {getScoreLabel(cat.result.overallScore)}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </div>
        )}

        {/* Disclaimer */}
        <motion.div {...smoothReveal} className="mt-6">
          <p className="text-xs text-muted text-center italic">
            Herramienta de reflexión personal basada en tradiciones culturales. No constituye predicción científica.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════
// DECISION DETAIL COMPONENT
// ════════════════════════════════════════════════════

function DecisionDetail({ result, profile }: { result: DecisionResult; profile: UserProfile }) {
  const router = useRouter();
  const scoreColor = getScoreColor(result.overallScore);

  return (
    <div className="mt-2 py-6 border-t border-ink/10">
      {/* Lectura general — una frase, no una grilla de tarjetas de score */}
      <p className="text-lg sm:text-xl font-display tracking-tight mb-1" style={{ color: scoreColor }}>
        {getScoreLabel(result.overallScore)}
      </p>
      <p className="uppercase text-xs tracking-[0.15em] text-muted mb-6">
        {result.category ? CATEGORY_LABELS[result.category as DecisionCategory] : ""}
        {result.category ? " · " : ""}
        Alineación {getScoreLabel(result.alignmentScore)} · Timing {getScoreLabel(result.timingScore)} · Energía {getScoreLabel(result.energyScore)}
      </p>

      {/* Explanation */}
      <div className="mb-6">
        <p className="uppercase text-xs tracking-[0.15em] text-muted mb-2">Contexto</p>
        <p className="text-sm text-foreground leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Considerations */}
      {result.considerations.length > 0 && (
        <div className="mb-6">
          <p className="uppercase text-xs tracking-[0.15em] text-muted mb-2">A considerar</p>
          <div className="space-y-2">
            {result.considerations.map((c, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-accent mt-0.5">•</span>
                <p className="text-sm text-foreground leading-relaxed">{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next steps */}
      {result.nextSteps.length > 0 && (
        <div className="mb-6">
          <p className="uppercase text-xs tracking-[0.15em] text-muted mb-2">Próximos pasos</p>
          <div className="space-y-2">
            {result.nextSteps.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-sm text-muted mt-0.5">{i + 1}.</span>
                <p className="text-sm text-foreground leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Element influence */}
      <div className="p-3 bg-ink/[0.02] mb-4">
        <p className="text-sm text-muted">
          Tu elemento {profile.element} {result.elementInfluence}.
        </p>
      </div>

      {/* CTA */}
        <button
          type="button"
          onClick={() => {
            const cat = DECISION_CATEGORIES.find(c => c.id === result.category);
            if (cat) router.push(cat.route);
          }}
          className="w-full text-center text-xs text-accent hover:underline font-medium inline-flex items-center justify-center gap-1"
        >
          Explorar {result.category}
          <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
        </button>
    </div>
  );
}
