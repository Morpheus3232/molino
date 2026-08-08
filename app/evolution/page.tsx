"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { getHistoryForProfile, type DailySnapshot, type Orientation } from "@/lib/session/dailyHistory";
import { getPersonalYear } from "@/lib/calculations";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { formatDate as formatI18nDate } from "@/lib/i18n/format";

const ORIENTATION_ORDER: Orientation[] = ["ACTUAR", "ESPERAR", "OBSERVAR"];

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return formatI18nDate(date, { weekday: "long", day: "numeric", month: "long" });
}

export default function EvolutionPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const [history, setHistory] = useState<DailySnapshot[]>([]);

  useEffect(() => {
    if (!profile) return;
    setHistory(getHistoryForProfile(profile.birthDate));
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
            <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
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
              <p className="eyebrow-brutalist mb-4">Evolución</p>
              <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
                Tu recorrido
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Para ver tu recorrido, primero necesitás crear tu perfil personal.
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="border-t border-ink/10 py-10 sm:py-16">
                <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
                  <span>›</span>
                  <span className="text-foreground font-medium">Evolución</span>
                </nav>

                <p className="eyebrow-brutalist mb-4">Evolución</p>
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
                      <p className="eyebrow-brutalist mb-4">Todavía no registraste días</p>
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
                    <div className="space-y-px bg-ink/10 border-t border-ink/10 pt-6">
                      <motion.div className="bg-background p-8 lg:p-12">
                        <p className="eyebrow-brutalist mb-4">
                          Hitos que registraste · {history.length} {history.length === 1 ? "día" : "días"}
                        </p>
                        <ul className="flex flex-wrap gap-x-8 gap-y-2">
                          {ORIENTATION_ORDER.map((o) => (
                            <li key={o} className="text-sm text-foreground">
                              <span className="font-heading text-2xl font-bold tracking-tight mr-2">{counts[o]}</span>
                              {o}
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      <div className="bg-background">
                        {history.map((item) => (
                          <div
                            key={item.date}
                            className="p-6 sm:p-8 border-b border-ink/10 last:border-b-0 flex items-center justify-between gap-4"
                          >
                            <div>
                              <p className="label-micro mb-1">{formatDate(item.date)}</p>
                              <p className="text-sm text-muted">{item.theme} · {item.energyLevel}</p>
                            </div>
                            <p className="font-heading text-xl text-foreground shrink-0">{item.orientation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
                <Button variant="primary" fullWidth onClick={() => router.push("/hoy")}>
                  Ver hoy →
                </Button>
                <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
                  Ver mi perfil
                </Button>
              </motion.div>
            </main>

            <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
