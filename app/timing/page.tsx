"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { Rocket, Briefcase, Target, FileText, Zap, Heart, Send, Sparkles } from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";
import { analyzeTiming, findBestDates, type TimingIntention, INTENTION_LABELS } from "@/lib/engines/timingEngine";
import { saveTimingIntention } from "@/lib/session/timingIntention";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import ReadingNumber from "@/components/ui/ReadingNumber";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getScoreLabel } from "@/lib/utils/score";
import { ELEMENT_COLORS } from "@/lib/data/constants";

const INTENTIONS: { id: TimingIntention; label: string; icon: any }[] = [
  { id: "start_project", label: "Iniciar un proyecto", icon: Rocket },
  { id: "change_job", label: "Cambiar de trabajo", icon: Briefcase },
  { id: "launch_something", label: "Lanzar algo", icon: Target },
  { id: "sign_agreement", label: "Firmar un acuerdo", icon: FileText },
  { id: "make_decision", label: "Tomar una decisión", icon: Zap },
  { id: "start_relationship", label: "Empezar una relación", icon: Heart },
  { id: "publish_something", label: "Publicar algo", icon: Send },
  { id: "other", label: "Otro", icon: Sparkles },
];

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function TimingPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const [selectedIntention, setSelectedIntention] = useState<TimingIntention | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [showResults, setShowResults] = useState(false);

  const result = useMemo(() => {
    if (!profile || !selectedIntention) return null;
    const date = new Date(selectedDate + 'T12:00:00');
    return analyzeTiming(profile, date, selectedIntention);
  }, [profile, selectedIntention, selectedDate]);

  const elementColor = profile ? ELEMENT_COLORS[profile.element] || "var(--color-accent)" : "var(--color-accent)";

  const bestDates = useMemo(() => {
    if (!profile || !selectedIntention) return [];
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 14);
    return findBestDates(profile, start, end, selectedIntention, 3);
  }, [profile, selectedIntention]);

  const SelectedIcon = INTENTIONS.find((i) => i.id === selectedIntention)?.icon;

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading || !mounted ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
              <p className="sr-only" role="status" aria-label="Preparando tu timing...">
                Preparando tu timing...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink/10">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-32 bg-[var(--skeleton)] border border-ink/10" />
                  ))}
                </div>
              </div>
              <UniversityFooter />
            </div>
          </motion.div>
        ) : !profile ? (
          <motion.div
            key="empty"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-24 text-center">
              <p className="eyebrow-brutalist mb-4">Tu momento</p>
              <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
                Tu momento personal
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Para explorar el timing personalizado, primero necesitás crear tu perfil.
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
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
              <motion.div {...fadeUp} className="border-t border-ink/10 py-10 sm:py-16">
                <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
                  <span>›</span>
                  <span className="text-foreground font-medium">Tu momento</span>
                </nav>

                <p className="eyebrow-brutalist mb-4">Tu timing personal</p>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
                  ¿Qué querés hacer?
                </h1>
                <p className="text-sm text-muted mt-4">Seleccioná una intención y analizá el mejor momento para actuar.</p>
              </motion.div>

              {!selectedIntention && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink/10">
                  {INTENTIONS.map((intention, i) => (
                    <motion.button
                      key={intention.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                      onClick={() => { setSelectedIntention(intention.id); saveTimingIntention(intention.id); setShowResults(true); }}
                      className="bg-background p-8 lg:p-12 text-left hover:bg-accent/5 transition-colors group"
                    >
                      <span className="text-3xl block mb-4 text-muted"><intention.icon className="w-8 h-8" /></span>
                      <p className="font-display text-xl text-foreground group-hover:text-accent transition-colors">{intention.label}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {selectedIntention && (
                <>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="border border-ink/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden="true">
                          {SelectedIcon && <SelectedIcon className="w-6 h-6" />}
                        </span>
                        <p className="font-display text-2xl text-foreground">{INTENTION_LABELS[selectedIntention]}</p>
                      </div>
                      <button
                        onClick={() => { setSelectedIntention(null); setShowResults(false); }}
                        className="text-xs text-muted hover:text-foreground transition-colors shrink-0"
                      >
                        Cambiar intención
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <label htmlFor="target-date" className="label-micro">Fecha:</label>
                      <input
                        id="target-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => { setSelectedDate(e.target.value); setShowResults(true); }}
                        className="w-full max-w-xs px-3 py-2 border border-ink/10 bg-background text-foreground text-base focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </motion.div>

                  {result && showResults && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedIntention}-${selectedDate}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="space-y-px bg-ink/10 mt-6"
                      >
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="bg-background p-8 lg:p-12">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <ReadingNumber
                              value={result.timingScore}
                              label="Puntuación de timing"
                              color={elementColor}
                              context={getScoreLabel(result.timingScore)}
                              size="xl"
                            />
                            <div className="sm:text-right">
                              <p className="text-sm text-muted">Día personal: {result.personalDay}</p>
                              <p className="text-sm text-muted">Luna {result.moonPhase}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted leading-relaxed max-w-2xl">{result.explanation}</p>
                        </motion.div>

                        {result.favorableDimensions.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-background p-8 lg:p-12">
                            <p className="eyebrow-brutalist mb-4">Dimensiones favorables</p>
                            <ul className="space-y-3">
                              {result.favorableDimensions.map((dim, i) => (
                                <li key={i} className="text-sm text-foreground flex items-start gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                                  {dim}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}

                        {result.challengingDimensions.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="bg-background p-8 lg:p-12">
                            <p className="eyebrow-brutalist mb-4">Dimensiones desafiantes</p>
                            <ul className="space-y-3">
                              {result.challengingDimensions.map((dim, i) => (
                                <li key={i} className="text-sm text-muted flex items-start gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-ink/20 mt-1.5 shrink-0" aria-hidden="true" />
                                  {dim}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-background p-8 lg:p-12">
                          <p className="eyebrow-brutalist mb-4">Recomendación</p>
                          <p className="text-sm text-foreground leading-relaxed">{result.recommendedWindow}</p>
                        </motion.div>

                        {result.caveats.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="bg-background p-6">
                            <p className="label-micro mb-2">Aclaraciones</p>
                            <ul className="space-y-1">
                              {result.caveats.map((caveat, i) => (
                                <li key={i} className="text-xs text-muted">• {caveat}</li>
                              ))}
                            </ul>
                          </motion.div>
                        )}

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-background p-8 lg:p-12">
                          <MolinoInterpretation
                            profile={profile}
                            type="timing"
                            timing={result}
                            label="Interpretación de Molino"
                            description="Análisis personalizado de tu timing"
                          />
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {bestDates.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="mt-8">
                      <p className="eyebrow-brutalist mb-6">Mejores fechas (próximos 14 días)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/10">
                        {bestDates.map((date, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                            className="bg-background p-6"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-display text-base text-foreground">
                                {new Date(date.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                              </p>
                              <span className="text-lg font-semibold" style={{ color: elementColor }}>
                                {date.timingScore}%
                              </span>
                            </div>
                            <p className="text-sm text-muted">{date.theme}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
                    <Button variant="secondary" fullWidth onClick={() => router.push("/hoy")}>
                      Ver energía de hoy
                    </Button>
                    <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
                      Ver mi perfil
                    </Button>
                  </motion.div>
                </>
              )}
            </main>

            <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
