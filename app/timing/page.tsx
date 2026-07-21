"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function TimingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">📅 Tu timing</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Calendario personal</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Tu año personal, ciclos mensuales y recomendaciones de timing para decisiones importantes.</p>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Año personal", value: "2026", desc: "Energía anual basada en tu Life Path", icon: "📆" },
              { title: "Ciclo mensual", value: "Fase 3", desc: "Momento del ciclo de 9 meses", icon: "🌗" },
              { title: "Día personal", value: "7", desc: "Energía del día de hoy", icon: "📅" },
            ].map((item) => (
              <Card key={item.title} hover={false} padding="lg">
                <div className="text-center">
                  <span className="text-3xl mb-2">{item.icon}</span>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-3xl font-serif font-bold text-foreground mt-2">{item.value}</p>
                  <p className="text-xs text-muted mt-1">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="mt-8">
          <Card hover={false}>
            <div className="text-center">
              <span className="badge mb-3">Próximamente</span>
              <h2 className="font-serif text-xl font-semibold text-foreground mt-3">Calendario inteligente</h2>
              <p className="text-sm text-muted mt-2">Próximamente podrás ver recomendaciones de timing para decisiones, proyectos y vínculos.</p>
              <Button className="mt-4" onClick={() => router.push("/profile")}>Volver a mi perfil</Button>
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
