"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

interface AlignmentSectionProps {
  profile: UserProfile;
}

export default function AlignmentSection({ profile }: AlignmentSectionProps) {
  const items = [
    { title: "Career", description: "Professions aligned with your Life Path and archetype.", href: "/patterns" },
    { title: "Relationships", description: "How you connect, bond and set boundaries.", href: "/patterns" },
    { title: "Business", description: "Projects that match your timing and elemental style.", href: "/patterns" },
    { title: "Lifestyle", description: "Rhythms, spaces and routines that fit your pattern.", href: "/patterns" },
    { title: "Creativity", description: "Ways to express your inner world.", href: "/patterns" },
    { title: "Learning", description: "Topics and formats that resonate with your mind.", href: "/patterns" },
  ];

  return (
    <Section>
      <div className="mb-8">
        <span className="badge mb-3">Your Alignment</span>
        <h2 className="font-serif text-2xl font-semibold text-foreground mt-3">
          Áreas de resonancia
        </h2>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Explorá cómo tu perfil se relaciona con distintas áreas de la vida.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} hover padding="md">
            <h3 className="font-medium text-foreground">{item.title}</h3>
            <p className="text-sm text-muted mt-1">{item.description}</p>
            <Button variant="secondary" className="mt-4" asChild>
              <a href={item.href}>Explore further →</a>
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}
