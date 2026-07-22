"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

interface TimingSectionProps {
  profile: UserProfile;
}

export default function TimingSection({ profile }: TimingSectionProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const personalYear = currentYear + profile.lifePath;
  const personalMonth = currentMonth + 1 + (profile.lifePath % 12);
  const personalDay = currentDay + (profile.lifePath % 9);

  return (
    <Section>
      <div className="mb-8">
        <span className="badge mb-3">Your Timing</span>
        <h2 className="font-serif text-2xl font-semibold text-foreground mt-3">
          En qué momento estás
        </h2>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Más allá de quién eres, el perfil incluye ritmos y ciclos personales.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card hover={false} padding="lg">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">
            Personal Year
          </p>
          <p className="text-3xl font-serif font-bold mt-2 text-foreground">{personalYear}</p>
          <p className="text-sm text-muted mt-1">Energía anual basada en tu Life Path</p>
        </Card>

        <Card hover={false} padding="lg">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">
            Personal Month
          </p>
          <p className="text-3xl font-serif font-bold mt-2 text-foreground">{personalMonth}</p>
          <p className="text-sm text-muted mt-1">Fase del ciclo mensual</p>
        </Card>

        <Card hover={false} padding="lg">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">
            Personal Day
          </p>
          <p className="text-3xl font-serif font-bold mt-2 text-foreground">{personalDay}</p>
          <p className="text-sm text-muted mt-1">Energía del día de hoy</p>
        </Card>
      </div>
    </Section>
  );
}
