"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { analyzeDecision, CATEGORY_LABELS, type DecisionCategory, type DecisionResult } from "@/lib/engines/decisionsEngine";
import ReadingNumber from "@/components/ui/ReadingNumber";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import { getScoreColor } from "@/lib/utils/score";
import Link from "next/link";

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [DecisionCategory, string][];

const pageTransitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

const innerTransitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

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

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading || !mounted ? (
          <motion.div
            key="loading"
            variants={pageTransitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
              <p className="sr-only" role="status" aria-label="Preparando tu brújula de decisiones...">
                Preparando tu brújula de decisiones...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="space-y-6 max-w-lg">
                  <div className="h-40 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                  <div className="h-48 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                  <div className="h-12 bg-[var(--skeleton)] rounded-md border border-ink/10" />
                </div>
              </div>
              <UniversityFooter />
            </div>
          </motion.div>
        ) : !profile ? (
          <motion.div
            key="no-profile"
            variants={pageTransitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={pageTransitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.main
                  key="result"
                  variants={innerTransitionVariants}
                  initial="enter"
                  animate="show"
                  exit="exit"
                  className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24"
                  id="main-content"
                >
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="border-t border-ink/10 py-10 sm:py-16">
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

                  {/* SEÑAL — el veredicto del momento, con la evidencia que lo sostiene */}
                  <div>
                    <div className="border border-ink/10 p-8 lg:p-12">
                      <p className="eyebrow-brutalist mb-4">Señal</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <ReadingNumber
                          value={result.overallScore}
                          label="Alineación general"
                          color={result.overallScore >= 75 ? "var(--score-excellent)" : result.overallScore >= 55 ? "var(--score-good)" : result.overallScore >= 40 ? "var(--score-neutral)" : "var(--score-poor)"}
                          size="xl"
                        />
                        <div className="sm:text-right">
                          <p className="text-xl font-heading font-semibold text-foreground">{result.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-px bg-ink/10">
                    {[
                      { label: "Alineación", score: result.alignmentScore },
                      { label: "Timing", score: result.timingScore },
                      { label: "Energía", score: result.energyScore },
                    ].map(sub => (
                      <div key={sub.label} className="bg-background p-6 text-center">
                        <p className="label-micro mb-2">{sub.label}</p>
                        <p className="text-3xl font-display font-bold" style={{ color: getScoreColor(sub.score) }}>{sub.score}%</p>
                      </div>
                    ))}
                  </div>

                  {/* CONTEXTO — qué dicen tus ciclos hoy */}
                  <div className="mt-6 border border-ink/10 p-8 lg:p-12">
                    <p className="eyebrow-brutalist mb-4">Contexto</p>
                    <p className="text-sm text-foreground leading-relaxed max-w-2xl mb-6">{result.reasoning}</p>
                    {result.considerations.length > 0 && (
                      <ul className="space-y-3 pt-2 border-t border-ink/10">
                        {result.considerations.map((c, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* SIGUIENTE PASO — la acción concreta */}
                  <div className="mt-6 border border-ink/10 p-8 lg:p-12">
                    <p className="eyebrow-brutalist mb-4">Siguiente paso</p>
                    <ul className="space-y-3">
                      {result.nextSteps.map((s, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-3">
                          <span className="text-sm text-muted mt-0.5">{i + 1}.</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-px bg-ink/10">
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
                  </div>

                  <div className="mt-6 border border-ink/10 p-6">
                    <p className="label-micro mb-2">Influencia de tu elemento</p>
                    <p className="text-sm text-foreground">{result.elementInfluence}</p>
                  </div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
                    <Button variant="primary" fullWidth onClick={() => { setSubmitted(false); setQuestion(""); }}>Consultar otra decisión</Button>
                    <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>Ver mi perfil</Button>
                  </motion.div>
                </motion.main>
              ) : (
                <motion.main
                  key="form"
                  variants={innerTransitionVariants}
                  initial="enter"
                  animate="show"
                  exit="exit"
                  className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24"
                  id="main-content"
                >
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="border-t border-ink/10 py-10 sm:py-16">
                    <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
                      <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
                      <span>›</span>
                      <span className="text-foreground font-medium">Decisiones</span>
                    </nav>

                    <p className="eyebrow-brutalist mb-4">Motor de Decisiones</p>
                    <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
                      ¿Qué estás tratando de decidir?
                    </h1>
                    <p className="text-sm text-muted mt-4 max-w-xl">
                      {profile.name} · Camino de Vida {profile.lifePath} · {profile.sunSign}
                    </p>
                  </motion.div>

                  <div>
                    <form
                      onSubmit={(e) => { e.preventDefault(); if (question.trim()) setSubmitted(true); }}
                      className="max-w-lg space-y-6"
                    >
                      <div>
                        <label htmlFor="question" className="label-micro block mb-2">
                          Contame en una frase qué estás por decidir
                        </label>
                        <textarea
                          id="question"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Ej: ¿Es buen momento para cambiar de trabajo?"
                          rows={3}
                          className="w-full px-4 py-3 border border-ink/10 bg-background text-foreground text-base placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
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
                          className="input"
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

                  <div className="border-t border-ink/10 pt-8 sm:pt-10 lg:pt-14 mt-8">
                    <div className="border border-ink/10 p-8 lg:p-12">
                      <p className="eyebrow-brutalist mb-4">¿Cómo funciona?</p>
                      <p className="text-sm text-muted leading-relaxed">
                        El Motor de Decisiones combina tu numerología (Life Path, día y año personal), tu signo solar, tu elemento, la fase lunar y la energía del día para ofrecerte una perspectiva única sobre cualquier decisión. Todo es determinístico y se calcula localmente — no guardamos ninguna pregunta ni resultado.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-ink/10 pt-6">
                    <Button variant="ghost" fullWidth onClick={() => router.push("/profile")}>
                      Ver mi perfil
                    </Button>
                  </div>
                </motion.main>
              )}
            </AnimatePresence>
            <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
