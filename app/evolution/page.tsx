"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { getHistoryForProfile, type Orientation } from "@/lib/session/dailyHistory";
import { getPersonalYear } from "@/lib/calculations";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import { useJournal } from "@/lib/hooks/useJournal";
import { MOOD_CONFIG } from "@/types/journal";
import DailyTimeline from "@/components/profile/DailyTimeline";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const ORIENTATION_ORDER: Orientation[] = ["ACTUAR", "ESPERAR", "OBSERVAR"];

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function EvolutionPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const { entries: journalEntries } = useJournal();
  const recentJournalEntries = useMemo(() => journalEntries.slice(0, 3), [journalEntries]);

  const history = useMemo(() => {
    if (!profile) return [];
    return getHistoryForProfile(profile.birthDate);
  }, [profile]);

  const counts = ORIENTATION_ORDER.reduce<Record<Orientation, number>>(
    (acc, o) => {
      acc[o] = history.filter((h) => h.orientation === o).length;
      return acc;
    },
    { ACTUAR: 0, ESPERAR: 0, OBSERVAR: 0 }
  );

  /**
   * Ciclo personal a través del tiempo — mismo cálculo que profileBuilder
   * (getPersonalYear), aplicado a año pasado/actual/próximo. No hay memoria
   * inventada: es la misma matemática numerológica de siempre, evaluada en
   * tres puntos del calendario.
   */
  const cycleArc = useMemo(() => {
    if (!profile) return null;
    const [birthYear, birthMonth, birthDay] = profile.birthDate.split("-").map(Number);
    if (!birthDay || !birthMonth || !birthYear) return null;
    const thisYear = new Date().getFullYear();
    const build = (targetYear: number) => {
      const cycle = getPersonalYear(birthDay, birthMonth, birthYear, targetYear);
      return { year: targetYear, cycle, theme: getYearTheme(cycle) };
    };
    return {
      previous: build(thisYear - 1),
      current: build(thisYear),
      next: build(thisYear + 1),
    };
  }, [profile]);

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
            <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
              <p className="sr-only" role="status" aria-label="Cargando tu recorrido...">
                Cargando tu recorrido...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="h-32 bg-[var(--skeleton)] border border-ink/10 mb-6" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 bg-[var(--skeleton)] border-t border-ink/10" />
                ))}
              </div>
            </main>
          </motion.div>
        ) : !profile ? (
          <motion.div
            key="empty"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-24 text-center" id="main-content">
              <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
                Tu recorrido
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Para ver tu recorrido, primero necesitás crear tu perfil personal.
              </p>
              <Button variant="primary" size="lg" onClick={() => router.push("/onboarding")}>
                Crear mi perfil
              </Button>
            </main>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="border-t border-ink/10 py-10 sm:py-16">
                <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
                  <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
                  <span>›</span>
                  <span className="text-foreground font-medium">Evolución</span>
                </nav>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
                  Tu recorrido
                </h1>
                <p className="text-sm text-muted mt-4 max-w-2xl">
                  De dónde venís, dónde estás y qué ciclo se abre a continuación — según tu numerología. Además, cada vez que abrís Hoy, Molino guarda tu orientación del día para que con el tiempo puedas ver un historial real.
                </p>
              </motion.div>

              {/* TU CICLO — de dónde venís / dónde estás / qué viene, siempre disponible: no depende de historial acumulado */}
              {cycleArc && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
                    <div className="bg-background p-8 lg:p-10">
                      <p className="label-micro mb-3">Año anterior · {cycleArc.previous.year}</p>
                      <p className="font-display text-4xl text-muted mb-3">{cycleArc.previous.cycle}</p>
                      <p className="text-sm text-muted leading-relaxed">Fue {cycleArc.previous.theme}.</p>
                    </div>
                    <div className="bg-background p-8 lg:p-10">
                      <p className="label-micro mb-3 text-accent">Este año · {cycleArc.current.year}</p>
                      <p className="font-display text-4xl text-foreground mb-3">{cycleArc.current.cycle}</p>
                      <p className="text-sm text-foreground leading-relaxed">Es {cycleArc.current.theme}.</p>
                    </div>
                    <div className="bg-background p-8 lg:p-10">
                      <p className="label-micro mb-3">Próximo año · {cycleArc.next.year}</p>
                      <p className="font-display text-4xl text-muted mb-3">{cycleArc.next.cycle}</p>
                      <p className="text-sm text-muted leading-relaxed">Va a ser {cycleArc.next.theme}.</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-4">
                    {cycleArc.current.cycle === cycleArc.next.cycle
                      ? `Tu ciclo personal se mantiene en ${cycleArc.current.cycle} el próximo año.`
                      : `Tu ciclo personal pasa de ${cycleArc.current.cycle} a ${cycleArc.next.cycle} el próximo año.`}
                  </p>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {history.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <motion.div className="text-center py-16 border-t border-ink/10">
                      <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground mb-4">Todavía no registraste días</h2>
                      <p className="text-muted mb-6 max-w-md mx-auto">
                        Volvé a Hoy mañana. A partir del segundo día vas a poder ver cómo cambia tu orientación día a día.
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="history-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <DailyTimeline profile={profile} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Journal real — el timeline de arriba es orientación automática
                  (ACTUAR/ESPERAR/OBSERVAR); esto son las entradas que el usuario
                  realmente escribió, para que "tu recorrido" no sea solo lo que
                  Molino calculó, también lo que vos registraste. */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="mt-10 border-t border-ink/10 pt-10">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    Tu Journal
                  </h2>
                  <Link href="/journal" className="text-xs font-mono text-accent hover:underline whitespace-nowrap">
                    Ver todo →
                  </Link>
                </div>

                {recentJournalEntries.length === 0 ? (
                  <div className="rounded-2xl border border-ink/10 bg-card p-6 text-center">
                    <p className="text-sm text-muted mb-4">Todavía no registraste ninguna entrada en tu Journal.</p>
                    <Link href="/journal">
                      <Button variant="accent" size="sm">Escribir mi primera entrada</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentJournalEntries.map((entry) => {
                      const cfg = MOOD_CONFIG[entry.mood];
                      return (
                        <Link
                          key={entry.id}
                          href="/journal"
                          className="block rounded-2xl border border-ink/10 bg-card p-4 hover:border-accent/40 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span>{cfg.emoji}</span>
                            <span className="text-xs font-mono text-muted">{entry.date}</span>
                            {entry.cycleContext?.dayEnergy?.theme && (
                              <span className="text-xs font-mono text-accent">· {entry.cycleContext.dayEnergy.theme}</span>
                            )}
                          </div>
                          <p className="text-sm text-foreground/90 leading-relaxed line-clamp-2">{entry.content}</p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
                <Button variant="primary" fullWidth onClick={() => router.push("/calendario")}>
                  Ver calendario →
                </Button>
                <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
                  Ver mi perfil
                </Button>
              </motion.div>
            </main>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
