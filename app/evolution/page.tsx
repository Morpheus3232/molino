"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfileFromStorage } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/types/user";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<EvolutionItem[]>([]);

  useEffect(() => {
    setMounted(true);
    const stored = loadProfileFromStorage();
    if (stored) {
      const calculated = calculateUserProfile(stored.name, stored.birthDate);
      setProfile({ ...calculated, ...stored } as UserProfile);
    } else {
      router.push("/");
    }
    setHistory(loadEvolutionHistory());
  }, [router]);

  const addMilestone = () => {
    const next = [
      { date: new Date().toISOString().slice(0, 10), title: "Nuevo milestone", detail: "Registrá tu avance o insight." },
      ...history,
    ];
    setHistory(next);
    saveEvolutionHistory(next);
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">📈 Evolution</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Historial y evolución</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Registro de tus sesiones, insights y avances en tu proceso de Inteligencia Personal.</p>
          </div>
        </Section>

        <Section>
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.date + item.title} hover={false} padding="md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted">{item.date}</p>
                    <h3 className="font-semibold text-foreground mt-1">{item.title}</h3>
                    <p className="text-sm text-muted mt-1">{item.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="mt-8">
          <Card hover={false}>
            <div className="text-center">
              <span className="badge mb-3">Evolución continua</span>
              <h2 className="font-serif text-xl font-semibold text-foreground mt-3">Próximamente</h2>
              <p className="text-sm text-muted mt-2">Podrás ver métricas, streaks y logros de tu proceso.</p>
              <Button className="mt-4" onClick={addMilestone}>Agregar milestone</Button>
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
