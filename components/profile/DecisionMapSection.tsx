"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { analyzeDecision, CATEGORY_LABELS, type DecisionCategory, type DecisionResult } from "@/lib/engines/decisionsEngine";
import { smoothReveal, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
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
  { id: "travel", title: "Viajes", route: "/affinity/recommendations/countries", description: "Destinos compatibles" },
  { id: "career", title: "Entorno profesional", route: "/affinity/recommendations/brands", description: "Marcas y empresas" },
  { id: "personal", title: "Lugares", route: "/affinity/recommendations/countries", description: "Ciudades afines" },
  { id: "creativity", title: "Creatividad", route: "/affinity", description: "Expresión creativa" },
  { id: "health", title: "Bienestar", route: "/affinity", description: "Prácticas alineadas" },
  { id: "education", title: "Formación", route: "/academy", description: "Rutas de conocimiento" },
];

export default function DecisionMapSection({ profile }: DecisionMapSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<DecisionCategory | null>(null);
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
    <section className="py-12 sm:py-20 border-t border-ink/10">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...smoothReveal}>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent mb-4">Ahora</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.88] tracking-tight text-foreground uppercase max-w-xl">
            Usá tu mapa para pensar mejor
          </h2>
          <p className="text-sm text-muted mt-4 max-w-lg leading-relaxed">
            Cualquier decisión puede leerse desde tu mapa. Escribí lo que estás considerando o explorá una categoría.
          </p>
        </motion.div>

        {/* ═══ PREGUNTA LIBRE ═══ */}
        <AnimatePresence mode="wait">
          {!freeResult ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleFreeQuestion}
              className="mt-8 max-w-lg"
            >
              <label htmlFor="decision-question" className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted block mb-3">
                ¿Qué estás tratando de decidir?
              </label>
              <textarea
                id="decision-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ej: ¿Es buen momento para mudarme?"
                rows={2}
                className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={!question.trim()}
                className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-accent border border-accent px-5 py-2.5 hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

        {/* ═══ RESULTADO ═══ */}
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
          <div className="mt-10 max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">Categorías</p>
            <div className="border-t border-ink/10">
              {decisionResults.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  {...staggerItemSmooth}
                  transition={{ delay: staggerDelay(i, 0.04), duration: 0.3 }}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  aria-expanded={selectedCategory === cat.id}
                  className="w-full text-left py-4 border-b border-ink/10 last:border-b-0 group transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{cat.title}</p>
                    </div>
                    <span
                      className="uppercase text-[10px] tracking-[0.2em] font-mono shrink-0"
                      style={{ color: getScoreColor(cat.result.overallScore) }}
                    >
                      {getScoreLabel(cat.result.overallScore)}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{cat.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <motion.div {...smoothReveal} className="mt-8">
          <p className="text-xs text-muted leading-relaxed max-w-md italic">
            Herramienta de reflexión personal basada en tradiciones culturales. No constituye predicción científica.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function DecisionDetail({ result, profile }: { result: DecisionResult; profile: UserProfile }) {
  const scoreColor = getScoreColor(result.overallScore);

  return (
    <div className="mt-2 py-6 border-t border-ink/10 max-w-xl">
      <p className="text-lg sm:text-xl font-heading tracking-tight mb-1" style={{ color: scoreColor }}>
        {getScoreLabel(result.overallScore)}
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
        {result.category ? CATEGORY_LABELS[result.category as DecisionCategory] : ""}
        {result.category ? " · " : ""}
        Alineación {getScoreLabel(result.alignmentScore)} · Timing {getScoreLabel(result.timingScore)} · Energía {getScoreLabel(result.energyScore)}
      </p>

      {result.detectedIntent && (
        <span className="inline-block mb-4 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent border border-accent/30 bg-accent/[0.06] leading-none">
          {result.detectedIntent.label}
        </span>
      )}

      <div className="mb-5 p-4 bg-ink/[0.02] border-l-2 border-accent">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">Recomendación</p>
        <p className="text-sm text-foreground leading-relaxed">{result.recommendation}</p>
      </div>

      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Contexto</p>
        <p className="text-sm text-foreground leading-relaxed">{result.reasoning}</p>
      </div>

      {result.considerations.length > 0 && (
        <div className="mb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">A considerar</p>
          <ul className="space-y-1.5">
            {result.considerations.map((c, i) => (
              <li key={i} className="text-sm text-foreground leading-relaxed flex items-start gap-2">
                <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.nextSteps.length > 0 && (
        <div className="mb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Próximos pasos</p>
          <ol className="space-y-1.5">
            {result.nextSteps.map((s, i) => (
              <li key={i} className="text-sm text-foreground leading-relaxed flex items-start gap-2">
                <span className="text-muted mt-0.5 shrink-0">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="p-3 bg-ink/[0.02] mb-4">
        <p className="text-xs text-muted leading-relaxed">
          Tu elemento {profile.element}: {result.elementInfluence}
        </p>
      </div>
    </div>
  );
}
