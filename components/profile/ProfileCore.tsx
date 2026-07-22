"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

interface ProfileCoreProps {
  profile: UserProfile;
}

export default function ProfileCore({ profile }: ProfileCoreProps) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];

  const coreItems = [
    {
      label: "Life Path",
      value: profile.lifePath,
      description: archetype.description || "Tu propósito fundamental",
      exploreHref: "/numerologia",
    },
    {
      label: "Expression",
      value: profile.expressionNumber ?? "—",
      description: "Cómo te presentás al mundo",
      exploreHref: "/numerologia",
    },
    {
      label: "Soul Urge",
      value: profile.soulNumber ?? "—",
      description: "Tus deseos más profundos",
      exploreHref: "/numerologia",
    },
    {
      label: "Personality",
      value: profile.personalityNumber ?? "—",
      description: "Cómo te perciben los demás",
      exploreHref: "/numerologia",
    },
    {
      label: "Chinese Zodiac",
      value: profile.chineseZodiac,
      description: profile.chineseZodiacInfo?.element
        ? `${profile.chineseZodiacInfo.element} · Animal de tu año`
        : "Animal y elemento del calendario lunar",
      exploreHref: "/zodiaco-chino",
    },
    {
      label: "Element",
      value: profile.element,
      description: profile.modality || "Tu elemento occidental",
      exploreHref: "/astrologia",
    },
  ];

  return (
    <Section>
      <div className="mb-8">
        <span className="badge mb-3">Your Core</span>
        <h2 className="font-serif text-2xl font-semibold text-foreground mt-3">
          Números y sistemas base
        </h2>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Estos datos forman el núcleo de tu mapa simbólico. Cada número es una capa de lectura.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coreItems.map((item) => (
          <Card key={item.label} hover padding="lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">
                  {item.label}
                </p>
                <p className="text-3xl font-serif font-bold mt-2" style={{ color: archetype.color || "#D4A843" }}>
                  {item.value}
                </p>
                <p className="text-sm text-muted mt-1">{item.description}</p>
              </div>
            </div>
            <Button variant="secondary" className="mt-4" asChild>
              <a href={item.exploreHref}>Explore in Knowledge</a>
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}
