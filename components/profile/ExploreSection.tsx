"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

interface ExploreSectionProps {
  profile: UserProfile;
}

export default function ExploreSection({ profile }: ExploreSectionProps) {
  const recommendations = [
    { title: "Explore your Life Path", href: "/numerologia", description: `Why your Life Path is ${profile.lifePath}` },
    { title: "Understand your current cycle", href: "/timing", description: "Your personal year, month and day" },
    { title: "Learn about your Chinese Zodiac element", href: "/zodiaco-chino", description: profile.chineseZodiac || "Your animal and element" },
    { title: "Explore your relationship patterns", href: "/patterns", description: "How your numbers shape connection" },
    { title: "Discover your career archetype", href: "/patterns", description: "Professions aligned with your profile" },
  ];

  return (
    <Section>
      <div className="mb-8">
        <span className="badge mb-3">Explore Your Profile</span>
        <h2 className="font-serif text-2xl font-semibold text-foreground mt-3">
          Qué podés explorar ahora
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((item) => (
          <Card key={item.title} hover padding="lg">
            <h3 className="font-medium text-foreground">{item.title}</h3>
            <p className="text-sm text-muted mt-1">{item.description}</p>
            <Button variant="secondary" className="mt-4" asChild>
              <a href={item.href}>Explore →</a>
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}
