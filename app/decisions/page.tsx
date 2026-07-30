"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { analyzeDecision, CATEGORY_LABELS, type DecisionCategory, type DecisionResult } from "@/lib/engines/decisionsEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import Link from "next/link";

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [DecisionCategory, string][];

export default function DecisionsPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<DecisionCategory>("career");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo<DecisionResult | null>(() => {
    if (!submitted || !profile || !question.trim()) return null;
    return analyzeDecision(profile, question.trim(), category);
  }, [submitted, profile, question, category]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 55) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-50";
    if (score >= 55) return "bg-blue-50";
    if (score >= 40) return "bg-yellow-50";
    return "bg-red-50";
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState message="Preparando tu brújula de decisiones..." />
        <UniversityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Motor de Decisiones</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Tu brújula personal
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Analizá cualquier decisión con la sabiduría de tu numerología, signo solar y energía del día.
            Primero necesitás crear tu perfil personal.
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            Crear mi perfil
          </Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24" id="main-content">
          <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>›</span>
            <Link href="/decisions" className="hover:text-foreground transition-colors">Decisiones</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Resultado</span>
          </nav>

          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-2">Motor de Decisiones</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {result.question}
            </h1>
            <p className="text-sm text-muted">
              {profile.name} · {CATEGORY_LABELS[result.category]} · Camino de Vida {profile.lifePath}
            </p>
          </div>

          {/* Overall Score */}
          <div className="card-hero mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Alineación general</p>
                <p className="text-5xl sm:text-6xl font-serif font-bold tracking-tight" style={{ color: result.overallScore >= 75 ? "var(--score-excellent)" : result.overallScore >= 55 ? "var(--score-good)" : result.overallScore >= 40 ? "var(--score-neutral)" : "var(--score-poor)" }}>
                  {result.overallScore}<span className="text-3xl sm:text-4xl text-muted font-sans font-medium">/100</span>
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-lg font-serif font-semibold text-foreground">{result.recommendation}</p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-2xl">{result.reasoning}</p>
          </div>

          {/* Sub-scores */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Alineación", score: result.alignmentScore },
              { label: "Timing", score: result.timingScore },
              { label: "Energía", score: result.energyScore },
            ].map(sub => (
              <div key={sub.label} className={`p-4 rounded-xl border border-border ${getScoreBg(sub.score)} transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-sm`}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">{sub.label}</p>
                <p className={`text-xl font-semibold ${getScoreColor(sub.score)}`}>{sub.score}%</p>
              </div>
            ))}
          </div>

          {/* Considerations */}
          <div className="mb-8 p-5 rounded-xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Consideraciones</p>
            <ul className="space-y-2">
              {result.considerations.map((c, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="mb-8 p-5 rounded-xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Próximos pasos</p>
            <ul className="space-y-2">
              {result.nextSteps.map((s, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-card-foreground/20 mt-1.5 shrink-0" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Context */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Día personal</p>
              <p className="text-lg font-semibold text-foreground">{result.personalDay}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Año personal</p>
              <p className="text-lg font-semibold text-foreground">{result.personalYear}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">Fase lunar</p>
              <p className="text-lg font-semibold text-foreground">{result.moonPhase}</p>
            </div>
          </div>

          {/* Element Influence */}
          <div className="mb-8 p-4 rounded-xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Influencia de tu elemento</p>
            <p className="text-sm text-foreground">{result.elementInfluence}</p>
          </div>

          {/* AI Interpretation */}
          <div className="mb-8">
            <MolinoInterpretation
              profile={profile}
              type="decision"
              decision={result}
              label="Interpretación de Molino"
              description="Análisis personalizado de tu decisión"
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" fullWidth onClick={() => { setSubmitted(false); setQuestion(""); }} className="transition-all duration-200 ease-out hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2">Consultar otra decisión</Button>
            <Button variant="secondary" fullWidth onClick={() => router.push("/profile")} className="transition-all duration-200 ease-out hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2">Ver mi perfil</Button>
          </div>
        </main>
        <UniversityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24" id="main-content">
        <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span>›</span>
          <span className="text-foreground font-medium">Decisiones</span>
        </nav>

        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-2">Motor de Decisiones</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Consultá tu brújula
          </h1>
          <p className="text-sm text-muted max-w-xl">
            {profile.name} · Camino de Vida {profile.lifePath} · {profile.sunSign}
          </p>
        </div>

        <div className="max-w-lg mb-12">
          <form
            onSubmit={(e) => { e.preventDefault(); if (question.trim()) setSubmitted(true); }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-foreground mb-2">
                ¿Qué decisión querés analizar?
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ej: ¿Es buen momento para cambiar de trabajo?"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as DecisionCategory)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition-colors"
              >
                {CATEGORIES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={!question.trim()}>
              Analizar decisión
            </Button>
          </form>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card">
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">¿Cómo funciona?</p>
          <p className="text-sm text-muted leading-relaxed">
            El Motor de Decisiones combina tu numerología (Life Path, día y año personal), tu signo solar, tu elemento, la fase lunar y la energía del día para ofrecerte una perspectiva única sobre cualquier decisión. Todo es determinístico y se calcula localmente — no guardamos ninguna pregunta ni resultado.
          </p>
        </div>

        <div className="mt-6">
          <Button variant="ghost" fullWidth onClick={() => router.push("/profile")}>
            Ver mi perfil
          </Button>
        </div>
      </main>
      <UniversityFooter />
    </div>
  );
}