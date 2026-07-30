"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
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
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Evolución</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Historial y evolución
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Para registrar tu evolución, primero necesitás crear tu perfil personal.
          </p>
          <Button size="lg" onClick={() => router.push("/")}>
            Crear mi perfil
          </Button>
        </div>
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
          <span className="text-foreground font-medium">Evolución</span>
        </nav>

        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-medium mb-2">Evolución</p>
          <h1 className="font-serif text-3xl font-bold text-foreground">Historial y evolución</h1>
          <p className="text-muted mt-2 max-w-2xl mx-auto">Registro de tus sesiones, insights y avances en tu proceso de Inteligencia Personal.</p>
        </div>

        <Section>
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted">Todavía no hay registros. Agregá tu primer milestone.</p>
              </div>
            ) : (
              history.map((item) => (
                <Card key={item.date + item.title} hover={false} padding="md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted">{item.date}</p>
                      <h3 className="font-semibold text-foreground mt-1">{item.title}</h3>
                      <p className="text-sm text-muted mt-1">{item.detail}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Section>

        <Section className="mt-8">
          <Card hover={false}>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-3">Evolución continua</p>
              <h2 className="font-serif text-xl font-semibold text-foreground">Próximamente</h2>
              <p className="text-sm text-muted mt-2">Podrás ver métricas, streaks y logros de tu proceso.</p>
              <Button className="mt-4" onClick={addMilestone}>Agregar milestone</Button>
            </div>
          </Card>
        </Section>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button variant="primary" fullWidth onClick={() => router.push("/daily-energy")}>
            Energía de hoy →
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/profile")}>
            Ver mi perfil
          </Button>
        </div>
      </main>

      <UniversityFooter />
    </div>
  );
}
