"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { analyzeDecision, type DecisionCategory, type DecisionResult, CATEGORY_LABELS } from "@/lib/engines/decisionsEngine";
import { buildMolinoContext, generateIntelligenceInterpretation, type MolinoInterpretation } from "@/lib/engines/intelligenceEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import Link from "next/link";

const CATEGORIES: { id: DecisionCategory; label: string; icon: string }[] = [
  { id: "career", label: "Carrera y trabajo", icon: "💼" },
  { id: "relationships", label: "Relaciones", icon: "💕" },
  { id: "creativity", label: "Creatividad", icon: "🎨" },
  { id: "finances", label: "Finanzas", icon: "💰" },
  { id: "health", label: "Salud", icon: "🏥" },
  { id: "education", label: "Educación", icon: "📚" },
  { id: "travel", label: "Viajes", icon: "✈️" },
  { id: "personal", label: "Personal", icon: "🧠" },
];

export default function DecisionsPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const [question, setQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DecisionCategory | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [interpretation, setInterpretation] = useState<MolinoInterpretation | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!profile || !question.trim() || !selectedCategory) return;

    // Step 1: Deterministic calculation
    const analysis = analyzeDecision(profile, question.trim(), selectedCategory);
    setResult(analysis);

    // Step 2: Build context and get AI interpretation
    setIsInterpreting(true);
    try {
      const dailyEnergy = calculateDailyEnergy(profile, new Date());
      const context = buildMolinoContext(profile, { dailyEnergy, decision: analysis });
      const interp = await generateIntelligenceInterpretation({
        type: 'decision',
        context,
        question: question.trim(),
      });
      setInterpretation(interp);
    } catch (error) {
      console.error('Error getting interpretation:', error);
      // Fallback is handled by the engine
    } finally {
      setIsInterpreting(false);
    }
  }, [profile, question, selectedCategory]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <LoadingState message="Cargando..." />
        <UniversityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Decisiones</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Tomá mejores decisiones
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Para usar la herramienta de decisiones, primero necesitás crear tu perfil personal.
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            Crear mi perfil
          </Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 55) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24" id="main-content">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Decisiones</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-2">Decisiones</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Tomá mejores decisiones
          </h1>
          <p className="text-sm text-muted mt-2">
            Escribí tu pregunta y seleccioná el contexto. Molino analizará tu perfil para darte una perspectiva.
          </p>
        </div>

        {/* Question Input */}
        <div className="mb-6">
          <label htmlFor="decision-question" className="block text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
            ¿Qué querés decidir?
          </label>
          <textarea
            id="decision-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ej: ¿Debería cambiar de trabajo? ¿Estoy listo para empezar un proyecto nuevo?"
            className="input min-h-[100px] resize-none"
            rows={3}
          />
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Contexto</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedCategory === cat.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <span className="text-xl mb-1 block">{cat.icon}</span>
                <p className="text-xs font-medium text-foreground">{cat.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mb-8">
          <Button
            fullWidth
            size="lg"
            onClick={handleAnalyze}
            disabled={!question.trim() || !selectedCategory}
          >
            Analizar decisión
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Score general</p>
                  <p className={`text-4xl font-serif font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}/100
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">{CATEGORY_LABELS[result.category]}</p>
                  <p className="text-xs text-muted">Personal Day {result.personalDay}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground mb-2">{result.recommendation}</p>
              <p className="text-sm text-muted leading-relaxed">{result.reasoning}</p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Alineación</p>
                <p className={`text-xl font-semibold ${getScoreColor(result.alignmentScore)}`}>{result.alignmentScore}%</p>
                <p className="text-xs text-muted">Con tu perfil</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Timing</p>
                <p className={`text-xl font-semibold ${getScoreColor(result.timingScore)}`}>{result.timingScore}%</p>
                <p className="text-xs text-muted">Momento actual</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Energía</p>
                <p className={`text-xl font-semibold ${getScoreColor(result.energyScore)}`}>{result.energyScore}%</p>
                <p className="text-xs text-muted">Energía del día</p>
              </div>
            </div>

            {/* Considerations */}
            {result.considerations.length > 0 && (
              <div className="p-5 rounded-xl border border-border bg-card">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Consideraciones</p>
                <ul className="space-y-2">
                  {result.considerations.map((c: string, i: number) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {result.nextSteps.length > 0 && (
              <div className="p-5 rounded-xl border border-border bg-card">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Próximos pasos</p>
                <ul className="space-y-2">
                  {result.nextSteps.map((step: string, i: number) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-lg font-serif font-semibold shrink-0" style={{ color: "var(--element-fire)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Element Influence */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Influencia de tu elemento</p>
              <p className="text-sm text-foreground">{result.elementInfluence}</p>
            </div>

            {/* Caveats */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Aclaraciones</p>
              <p className="text-xs text-muted leading-relaxed">
                Este análisis se basa en sistemas simbólicos y herramientas de reflexión. No constituye asesoramiento profesional ni predicciones.
              </p>
            </div>

            {/* AI Interpretation */}
            {isInterpreting && (
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">Interpretación de Molino</p>
                </div>
                <p className="text-sm text-muted animate-pulse">Analizando tu perfil y contexto...</p>
              </div>
            )}

            {interpretation && !isInterpreting && (
              <div className="p-6 rounded-2xl border border-accent/20 bg-accent/5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-4">Interpretación de Molino</p>

                {/* Summary */}
                <div className="mb-4">
                  <p className="text-sm text-foreground leading-relaxed">{interpretation.summary}</p>
                </div>

                {/* Alignment */}
                {interpretation.alignment && (
                  <div className="mb-4 p-3 rounded-lg bg-background">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Alineación</p>
                    <p className="text-sm text-foreground">{interpretation.alignment}</p>
                  </div>
                )}

                {/* Timing */}
                {interpretation.timing && (
                  <div className="mb-4 p-3 rounded-lg bg-background">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Timing</p>
                    <p className="text-sm text-foreground">{interpretation.timing}</p>
                  </div>
                )}

                {/* Strengths */}
                {interpretation.strengths.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">Fortalezas</p>
                    <ul className="space-y-1">
                      {interpretation.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What to Consider */}
                {interpretation.whatToConsider.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Qué considerar</p>
                    <ul className="space-y-1">
                      {interpretation.whatToConsider.map((c, i) => (
                        <li key={i} className="text-sm text-muted flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" aria-hidden="true" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Next Step */}
                {interpretation.suggestedNextStep && (
                  <div className="p-3 rounded-lg bg-background">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">Próximo paso sugerido</p>
                    <p className="text-sm text-foreground font-medium">{interpretation.suggestedNextStep}</p>
                  </div>
                )}

                {/* Confidence & Limitations */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted">
                    Confianza: {interpretation.confidence} · {interpretation.limitations[0]}
                  </p>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" fullWidth onClick={() => { setResult(null); setQuestion(""); setSelectedCategory(null); }}>
                Nueva decisión
              </Button>
              <Button variant="secondary" fullWidth onClick={() => router.push("/daily-energy")}>
                Ver energía de hoy
              </Button>
              <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
                Ver mi perfil
              </Button>
            </div>
          </div>
        )}
      </main>

      <UniversityFooter />
    </div>
  );
}
