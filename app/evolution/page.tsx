"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";

const EVOLUTION_HISTORY_KEY = "molino.evolution-history.v1";

type EvolutionItem = {
  date: string;
  title: string;
  detail: string;
};

function loadEvolutionHistory(): EvolutionItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(EVOLUTION_HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as EvolutionItem[];
  } catch {
    return [];
  }
}

function saveEvolutionHistory(items: EvolutionItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EVOLUTION_HISTORY_KEY, JSON.stringify(items));
}

export default function EvolutionPage() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const [history, setHistory] = useState<EvolutionItem[]>([]);

  useEffect(() => {
    setHistory(loadEvolutionHistory());
  }, []);

  const addMilestone = () => {
    const next = [
      { date: new Date().toISOString().slice(0, 10), title: "Nuevo milestone", detail: "Registrá tu avance o insight." },
      ...history,
    ];
    setHistory(next);
    saveEvolutionHistory(next);
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState message="Cargando historial..." />
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
            Historial y evolución
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Para registrar tu evolución, primero necesitás crear tu perfil personal.
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
            Historial y evolución
          </h1>
          <p className="text-sm text-muted mt-4 max-w-2xl">Registro de tus sesiones, insights y avances en tu proceso de Inteligencia Personal.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="space-y-px bg-ink/10">
            {history.length === 0 ? (
              <EmptyState
                title="Sin registros"
                description="Todavía no hay registros. Agregá tu primer milestone."
              />
            ) : (
              history.map((item, i) => (
                <motion.div
                  key={item.date + item.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="bg-background p-8 lg:p-12 border-b border-ink/10 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="label-micro mb-2">{item.date}</p>
                      <h3 className="font-display text-xl text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted mt-2">{item.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 border border-ink/10 p-8 lg:p-12 text-center">
          <p className="eyebrow-brutalist mb-4">Evolución continua</p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">Próximamente</h2>
          <p className="text-sm text-muted mt-3 max-w-md mx-auto">Podrás ver métricas, streaks y logros de tu proceso.</p>
          <Button variant="primary" onClick={addMilestone} className="mt-6">
            Agregar milestone
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" fullWidth onClick={() => router.push("/daily-energy")}>
            Energía de hoy →
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
