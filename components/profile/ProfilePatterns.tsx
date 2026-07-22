"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

interface ProfilePatternsProps {
  profile: UserProfile;
}

export default function ProfilePatterns({ profile }: ProfilePatternsProps) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];

  const strengths = archetype.keywords || [];
  const challenges = ["Sobreanalizar", "Retrasar la acción", "Aislamiento excesivo"];

  const growthDirection =
    profile.lifePath === 7
      ? "Pasar de la reflexión profunda a la acción deliberada."
      : profile.lifePath === 1
        ? "Canalizar tu independencia en proyectos concretos."
        : "Usar tu autoconocimiento para tomar decisiones más alineadas.";

  return (
    <Section>
      <div className="mb-8">
        <span className="badge mb-3">Your Patterns</span>
        <h2 className="font-serif text-2xl font-semibold text-foreground mt-3">
          Cómo funcionas
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card hover={false} padding="lg" className="lg:col-span-2">
          <p className="text-sm text-muted leading-relaxed">
            Tu perfil combina una tendencia analítica con un enfoque independiente frente a la vida.
            Puede ser que naturalmente busques profundidad antes de tomar decisiones importantes,
            mientras que tu mayor crecimiento puede venir de convertir la introspección en acción deliberada.
          </p>
        </Card>

        <div className="space-y-4">
          <Card hover={false} padding="lg">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">
              Strengths
            </p>
            <ul className="space-y-2">
              {strengths.map((item: string) => (
                <li key={item} className="text-sm text-foreground list-disc list-inside">
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card hover={false} padding="lg">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">
              Challenges
            </p>
            <ul className="space-y-2">
              {challenges.map((item) => (
                <li key={item} className="text-sm text-muted list-disc list-inside">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card hover={false} padding="lg" className="mt-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">
          Growth
        </p>
        <p className="text-sm text-foreground">{growthDirection}</p>
      </Card>
    </Section>
  );
}
