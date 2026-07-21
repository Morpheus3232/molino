"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadProfileFromStorage } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES, YEAR_TYPES } from "@/lib/data";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

function buildFeed(profile: UserProfile) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];
  const yearMeaning = YEAR_TYPES[(profile.lifePath % 9) || 9] || YEAR_TYPES[1];
  return [
    { id: 1, title: `Hoy: ${yearMeaning.name.toLowerCase()}`, body: `Tu energía del día combina tu Life Path ${profile.lifePath} con tu elemento ${profile.element}.`, tag: "Timing" },
    { id: 2, title: "Tu arquetipo en acción", body: `${archetype.name} funciona mejor cuando alineás acción con tu propósito.`, tag: "Patrones" },
    { id: 3, title: "Recordatorio de alineación", body: `Revisá tu semana: tu objetivo "${profile.goal}" puede guiar tus próximas decisiones.`, tag: "Alineación" },
  ];
}

export default function ForYouPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadProfileFromStorage();
    if (stored) {
      const calculated = calculateUserProfile(stored.name, stored.birthDate);
      setProfile({ ...calculated, ...stored } as UserProfile);
    } else {
      router.push("/");
    }
  }, [router]);

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando...</div>
      </div>
    );
  }

  const feed = buildFeed(profile);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-10">
            <span className="badge mb-3">✨ For You</span>
            <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Feed personal</h1>
            <p className="text-muted mt-2 max-w-2xl mx-auto">Contenido curado según tu perfil: insights, recordatorios y recomendaciones.</p>
          </div>
        </Section>

        <Section>
          <div className="space-y-4">
            {feed.map((item) => (
              <Card key={item.id} hover padding="lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted">{item.tag}</span>
                    <h3 className="font-semibold text-foreground mt-1">{item.title}</h3>
                    <p className="text-sm text-muted mt-1">{item.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
