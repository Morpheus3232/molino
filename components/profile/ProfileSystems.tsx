"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

interface ProfileSystemsProps {
  profile: UserProfile;
}

export default function ProfileSystems({ profile }: ProfileSystemsProps) {
  const systems = [
    {
      title: "Numerology",
      value: `Life Path ${profile.lifePath}`,
      description: "Tu número de misión y propósito.",
      href: "/numerologia",
      available: true,
    },
    {
      title: "Astrology",
      value: profile.sunSign || "—",
      description: "Tu signo solar y arquetipo zodiacal.",
      href: "/astrologia",
      available: !!profile.sunSign,
    },
    {
      title: "Chinese Zodiac",
      value: profile.chineseZodiac || "—",
      description: profile.chineseZodiacInfo?.element
        ? `${profile.chineseZodiacInfo.element} · ${profile.chineseZodiac}`
        : "Tu animal y elemento del calendario lunar.",
      href: "/zodiaco-chino",
      available: !!profile.chineseZodiac,
    },
  ];

  return (
    <Section>
      <div className="mb-8">
        <span className="badge mb-3">Your Systems</span>
        <h2 className="font-serif text-2xl font-semibold text-foreground mt-3">
          Cómo te ven las tradiciones
        </h2>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Cada sistema es una lente distinta sobre tu misma experiencia.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {systems.map((system) => (
          <Card key={system.title} hover={!system.available} padding="lg">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">
              {system.title}
            </p>
            <p className="text-2xl font-serif font-bold mt-2 text-foreground">{system.value}</p>
            <p className="text-sm text-muted mt-1">{system.description}</p>
            {system.available && (
              <Button variant="secondary" className="mt-4" asChild>
                <a href={system.href}>Explore Knowledge →</a>
              </Button>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
