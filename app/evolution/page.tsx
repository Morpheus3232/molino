"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

const HISTORY = [
  { date: "2026-07-20", title: "Análisis inicial completado", detail: "Perfil calculado y guardado en sesión efímera." },
  { date: "2026-07-20", title: "Exploración de patrones", detail: "Viste Numerología y Astrología por primera vez." },
  { date: "2026-07-20", title: "Primer match", detail: "Comparaste tu perfil con Japón." },
];

export default function EvolutionPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">📈 Evolution</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Historial y evolución</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Registro de tus sesiones, insights y avances en tu proceso de Personal Intelligence.</p>
          </div>
        </Section>

        <Section>
          <div className="space-y-4">
            {HISTORY.map((item) => (
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
              <span className="badge mb-3">Próximamente</span>
              <h2 className="font-serif text-xl font-semibold text-foreground mt-3">Evolución continua</h2>
              <p className="text-sm text-muted mt-2">Próximamente podrás ver métricas, streaks y logros de tu proceso.</p>
              <Button className="mt-4" onClick={() => router.push("/profile")}>Volver a mi perfil</Button>
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
