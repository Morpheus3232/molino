"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { getHistoryForProfile, type Orientation } from "@/lib/session/dailyHistory";
import { getPersonalYear } from "@/lib/calculations";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import DailyTimeline from "@/components/profile/DailyTimeline";
import Button from "@/components/ui/Button";

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function LineaPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const history = useMemo(() => {
    if (!profile) return [];
    return getHistoryForProfile(profile.birthDate, 14);
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading || !mounted ? (
          <motion.div key="loading" variants={transitionVariants} initial="enter" animate="show" exit="exit">
            <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
              <p className="sr-only" role="status" aria-live="polite">Cargando tu línea...</p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="h-64 bg-[var(--skeleton)] border border-ink/10 mb-6" />
              </div>
            </main>
          </motion.div>
        ) : !profile ? (
          <motion.div key="empty" variants={transitionVariants} initial="enter" animate="show" exit="exit">
            <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-24 text-center" id="main-content">
              <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">Tu línea de energía</h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Para ver tu línea, primero necesitás crear tu perfil personal.
              </p>
              <Button variant="primary" size="lg" onClick={() => router.push("/onboarding")}>
                Crear mi perfil
              </Button>
            </main>
          </motion.div>
        ) : (
          <motion.div key="content" variants={transitionVariants} initial="enter" animate="show" exit="exit">
            <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="border-t border-ink/10 py-10 sm:py-16">
                <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
                  <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
                  <span>›</span>
                  <Link href="/evolution" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Evolución</Link>
                  <span>›</span>
                  <span className="text-foreground font-medium">Tu línea</span>
                </nav>

                <h1 className="font-display text-5xl sm:text-7xl text-foreground leading-[0.9] tracking-tight">Tu línea</h1>
                <p className="text-sm text-muted mt-4 max-w-2xl">
                  Cada día que abrís Molino queda registrado en tu línea: tu orientación, tu energía y cómo se conecta con el ciclo de tu año personal.
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {history.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="text-center py-16 border-t border-ink/10">
                      <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight text-foreground">
                        Aún no registraste días
                      </h2>
                      <p className="text-muted mb-6 max-w-md mx-auto">
                        Volvé a Hoy mañana. A partir del segundo día vas a poder ver cómo cambia tu orientación día a día.
                      </p>
                    </div>
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

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
                <Button variant="primary" fullWidth onClick={() => router.push("/evolution")}>
                  Ver tu evolución →
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