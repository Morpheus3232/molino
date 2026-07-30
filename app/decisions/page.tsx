"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { analyzeDecision, CATEGORY_LABELS, type DecisionCategory, type DecisionResult } from "@/lib/engines/decisionsEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import { getScoreColor } from "@/lib/utils/score";
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
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-24 text-center">
          <p className="eyebrow-brutalist mb-4">Motor de Decisiones</p>
          <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
            Tu brújula personal
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Analizá cualquier decisión con la sabiduría de tu numerología, signo solar y energía del día.
            Primero necesitás crear tu perfil personal.
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push("/onboarding")}>
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
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
          <motion.div {...fadeUp} className="border-t border-ink/10 py-10 sm:py-16">
            <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
              <span>›</span>
              <Link href="/decisions" className="hover:text-foreground transition-colors">Decisiones</Link>
              <span>›</span>
              <span className="text-foreground font-medium">Resultado</span>
            </nav>

            <p className="eyebrow-brutalist mb-4">Motor de Decisiones</p>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-tight">
              {result.question}
            </h1>
            <p className="text-sm text-muted mt-4">
              {profile.name} · {CATEGORY_LABELS[result.category]} · Camino de Vida {profile.lifePath}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="border border-ink/10 p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="label-micro mb-1">Alineación general</p>
                  <p className="text-5xl sm:text-6xl font-display font-bold tracking-tight" style={{ color: result.overallScore >= 75 ? "var(--score-excellent)" : result.overallScore >= 55 ? "var(--score-good)" : result.overallScore >= 40 ? "var(--score-neutral)" : "var(--score-poor)" }}>
                    {result.overallScore}<span className="text-3xl sm:text-4xl text-muted font-sans font-medium">/100</span>
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xl font-heading font-semibold text-foreground">{result.recommendation}</p>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">{result.reasoning}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-6 grid grid-cols-3 gap-px bg-ink/10">
            {[
              { label: "Alineación", score: result.alignmentScore },
              { label: "Timing", score: result.timingScore },
              { label: "Energía", score: result.energyScore },
            ].map(sub => (
              <div key={sub.label} className="bg-background p-6 text-center">
                <p className="label-micro mb-2">{sub.label}</p>
                <p className={`text-3xl font-display font-bold ${getScoreColor(sub.score)}`}>{sub.score}%</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 border border-ink/10 p-8 lg:p-12">
            <p className="eyebrow-brutalist mb-4">Consideraciones</p>
            <ul className="space-y-3">
              {result.considerations.map((c, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }} className="mt-6 border border-ink/10 p-8 lg:p-12">
            <p className="eyebrow-brutalist mb-4">Próximos pasos</p>
            <ul className="space-y-3">
              {result.nextSteps.map((s, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink/20 mt-1.5 shrink-0" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-px bg-ink/10">
            <div className="bg-background p-6">
              <p className="label-micro mb-2">Día personal</p>
              <p className="text-xl font-display font-bold text-foreground">{result.personalDay}</p>
            </div>
            <div className="bg-background p-6">
              <p className="label-micro mb-2">Año personal</p>
              <p className="text-xl font-display font-bold text-foreground">{result.personalYear}</p>
            </div>
            <div className="bg-background p-6">
              <p className="label-micro mb-2">Fase lunar</p>
              <p className="text-xl font-display font-bold text-foreground">{result.moonPhase}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }} className="mt-6 border border-ink/10 p-6">
            <p className="label-micro mb-2">Influencia de tu elemento</p>
            <p className="text-sm text-foreground">{result.elementInfluence}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6">
            <MolinoInterpretation
              profile={profile}
              type="decision"
              decision={result}
              label="Interpretación de Molino"
              description="Análisis personalizado de tu decisión"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.45 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="primary" fullWidth onClick={() => { setSubmitted(false); setQuestion(""); }}>Consultar otra decisión</Button>
            <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>Ver mi perfil</Button>
          </motion.div>
        </main>
        <UniversityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
        <motion.div {...fadeUp} className="border-t border-ink/10 py-10 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Decisiones</span>
          </nav>

          <p className="eyebrow-brutalist mb-4">Motor de Decisiones</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            Consultá tu brújula
          </h1>
          <p className="text-sm text-muted mt-4 max-w-xl">
            {profile.name} · Camino de Vida {profile.lifePath} · {profile.sunSign}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <form
            onSubmit={(e) => { e.preventDefault(); if (question.trim()) setSubmitted(true); }}
            className="max-w-lg space-y-6"
          >
            <div>
              <label htmlFor="question" className="label-micro block mb-2">
                ¿Qué decisión querés analizar?
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ej: ¿Es buen momento para cambiar de trabajo?"
                rows={3}
                className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            <div>
              <label htmlFor="category" className="label-micro block mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as DecisionCategory)}
                className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
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
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="border-t border-ink/10 pt-8 sm:pt-10 lg:pt-14 mt-8">
          <div className="border border-ink/10 p-8 lg:p-12">
            <p className="eyebrow-brutalist mb-4">¿Cómo funciona?</p>
            <p className="text-sm text-muted leading-relaxed">
              El Motor de Decisiones combina tu numerología (Life Path, día y año personal), tu signo solar, tu elemento, la fase lunar y la energía del día para ofrecerte una perspectiva única sobre cualquier decisión. Todo es determinístico y se calcula localmente — no guardamos ninguna pregunta ni resultado.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6 border-t border-ink/10 pt-6">
          <Button variant="ghost" fullWidth onClick={() => router.push("/profile")}>
            Ver mi perfil
          </Button>
        </motion.div>
      </main>
      <UniversityFooter />
    </div>
  );
}
