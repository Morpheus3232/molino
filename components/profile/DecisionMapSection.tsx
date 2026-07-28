"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { analyzeDecision, type DecisionCategory, type DecisionResult } from "@/lib/engines/decisionsEngine";
import { smoothReveal, cardReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface DecisionMapSectionProps {
  profile: UserProfile;
}

const DECISION_CATEGORIES: {
  id: DecisionCategory;
  emoji: string;
  title: string;
  route: string;
  description: string;
}[] = [
  { id: "travel", emoji: "✈", title: "Viajes", route: "/affinity/recommendations/countries", description: "Explorá destinos compatibles con tu energía" },
  { id: "career", emoji: "🏢", title: "Entorno profesional", route: "/affinity/recommendations/brands", description: "Marcas y empresas que resuenan con tu perfil" },
  { id: "personal", emoji: "🏠", title: "Lugares", route: "/affinity/recommendations/countries", description: "Ciudades y espacios con resonancia" },
  { id: "creativity", emoji: "🎨", title: "Creatividad", route: "/affinity", description: "Entidades que potencian tu expresión" },
  { id: "health", emoji: "💪", title: "Bienestar", route: "/affinity", description: "Símbolos de equilibrio y cuidado" },
  { id: "education", emoji: "📚", title: "Aprendizaje", route: "/academy", description: "Rutas de conocimiento para tu perfil" },
];

export default function DecisionMapSection({ profile }: DecisionMapSectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<DecisionCategory | null>(null);

  const decisionResults = useMemo(() => {
    return DECISION_CATEGORIES.map(cat => ({
      ...cat,
      result: analyzeDecision(profile, cat.title, cat.id),
    }));
  }, [profile]);

  const selectedResult = useMemo(() => {
    if (!selectedCategory) return null;
    return decisionResults.find(d => d.id === selectedCategory)?.result ?? null;
  }, [selectedCategory, decisionResults]);

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Explora tus afinidades</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Cada categoría muestra entidades rankeadas por resonancia simbólica con tu perfil.
          </p>
        </motion.div>

        {/* Category cards */}
        <motion.div {...staggerApple} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {decisionResults.map((cat, i) => (
            <motion.button
              key={cat.id}
              {...staggerItemSmooth}
              transition={{ delay: staggerDelay(i, 0.06), duration: 0.3 }}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`text-left p-5 rounded-xl border transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 ${
                selectedCategory === cat.id
                  ? "border-accent bg-accent/5"
                  : "border-border bg-card hover:border-accent/50 hover:-translate-y-[2px] hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{cat.title}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: cat.result.overallScore >= 70 ? "#2D5A3D" : cat.result.overallScore >= 50 ? "#D4A843" : "#B45309",
                        backgroundColor: cat.result.overallScore >= 70 ? "rgba(45,90,61,0.1)" : cat.result.overallScore >= 50 ? "rgba(212,168,67,0.1)" : "rgba(180,83,9,0.1)",
                      }}
                    >
                      {cat.result.overallScore}/100
                    </span>
                  </div>
                  <p className="text-[10px] text-muted/70 leading-relaxed">{cat.result.recommendation}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Detailed analysis panel */}
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

        {/* Disclaimer */}
        <motion.div {...smoothReveal} className="mt-6">
          <p className="text-[10px] text-muted/50 text-center italic">
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
  const scoreColor = result.overallScore >= 70 ? "#2D5A3D" : result.overallScore >= 50 ? "#D4A843" : "#B45309";

  return (
    <div className="mt-4 p-6 rounded-2xl border border-border bg-card">
      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <ScoreMiniCard label="Alineación" score={result.alignmentScore} icon="🎯" />
        <ScoreMiniCard label="Timing" score={result.timingScore} icon="⏰" />
        <ScoreMiniCard label="Energía" score={result.energyScore} icon="⚡" />
      </div>

      {/* Overall */}
      <div className="text-center mb-6">
        <p className="font-serif text-3xl font-bold" style={{ color: scoreColor }}>
          {result.overallScore}/100
        </p>
        <p className="text-xs text-muted mt-1">Score general</p>
      </div>

      {/* Explanation */}
      <div className="mb-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-2">Análisis</p>
        <p className="text-sm text-foreground leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Considerations */}
      {result.considerations.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-2">A considerar</p>
          <div className="space-y-2">
            {result.considerations.map((c, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] text-accent mt-0.5">•</span>
                <p className="text-xs text-foreground leading-relaxed">{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next steps */}
      {result.nextSteps.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-2">Próximos pasos</p>
          <div className="space-y-2">
            {result.nextSteps.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] text-muted mt-0.5">{i + 1}.</span>
                <p className="text-xs text-foreground leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Element influence */}
      <div className="p-3 rounded-lg bg-background/50 mb-4">
        <p className="text-[10px] text-muted/70">
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
          className="w-full text-center text-xs text-accent hover:underline font-medium inline-flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 rounded-lg"
        >
          Explorar {result.category}
          <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
        </button>
    </div>
  );
}

function ScoreMiniCard({ label, score, icon }: { label: string; score: number; icon: string }) {
  const color = score >= 70 ? "#2D5A3D" : score >= 50 ? "#D4A843" : "#B45309";
  return (
    <div className="p-3 rounded-xl bg-background/50 text-center">
      <span className="text-lg block mb-1">{icon}</span>
      <p className="font-serif text-lg font-bold" style={{ color }}>{score}</p>
      <p className="text-[9px] text-muted">{label}</p>
    </div>
  );
}
