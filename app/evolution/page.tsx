"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { getHistoryForProfile, type DailySnapshot, type Orientation } from "@/lib/session/dailyHistory";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

const ORIENTATION_ORDER: Orientation[] = ["ACTUAR", "ESPERAR", "OBSERVAR"];

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
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

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState message="Cargando tu recorrido..." />
        <UniversityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
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
            <span className="text-foreground font-medium">Evolución</span>
          </nav>

          <p className="eyebrow-brutalist mb-4">Evolución</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            Tu recorrido
          </h1>
          <p className="text-sm text-muted mt-4 max-w-2xl">
            Cada vez que abrís Hoy, Molino guarda tu orientación del día. Con el tiempo, esto se convierte en un recorrido.
          </p>
        </motion.div>

        {history.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <EmptyState
              title="Todavía no hay recorrido"
              description="Volvé a Hoy mañana. A partir del segundo día vas a poder ver cómo cambia tu orientación."
            />
            <div className="mt-6 text-center">
              <Button variant="primary" onClick={() => router.push("/hoy")}>
                Ver tu día de hoy →
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="border border-ink/10 p-8 lg:p-12"
            >
              <p className="eyebrow-brutalist mb-4">
                {history.length} {history.length === 1 ? "día registrado" : "días registrados"}
              </p>
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {ORIENTATION_ORDER.map((o) => (
                  <li key={o} className="text-sm text-foreground">
                    <span className="font-display text-2xl font-bold tracking-tight mr-2">{counts[o]}</span>
                    {o}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-6">
              <div className="space-y-px bg-ink/10">
                {history.map((item, i) => (
                  <motion.div
                    key={item.date}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="bg-background p-6 sm:p-8 border-b border-ink/10 last:border-b-0 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="label-micro mb-1">{formatDate(item.date)}</p>
                      <p className="text-sm text-muted">{item.theme} · {item.energyLevel}</p>
                    </div>
                    <p className="font-display text-xl text-foreground shrink-0">{item.orientation}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" fullWidth onClick={() => router.push("/hoy")}>
            Ver hoy →
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
            Ver mi perfil
          </Button>
        </motion.div>
      </main>

      <UniversityFooter />
    </div>
  );
}
