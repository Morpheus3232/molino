"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, isSessionValid } from "@/lib/storage/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ENTITIES, EntityProfile, EXTENDED_ENTITIES } from "@/lib/data/entities";
import { ARCHETYPES } from "@/lib/data";
import CompatibilityExplorer from "@/components/explore/CompatibilityExplorer";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "country", label: "Países" },
  { id: "city", label: "Ciudades" },
  { id: "brand", label: "Marcas" },
  { id: "band", label: "Bandas" },
  { id: "movie", label: "Películas" },
  { id: "book", label: "Libros" },
  { id: "philosophy", label: "Filosofía" },
  { id: "historicalEvent", label: "Eventos" },
  { id: "food", label: "Comidas" },
  { id: "color", label: "Colores" },
  { id: "crystal", label: "Cristales" },
  { id: "deity", label: "Deidades" },
];

function getOrCreateProfile(): UserProfile | null {
  const existing = getSession();
  if (existing && isSessionValid()) {
    return calculateUserProfile(existing.name, existing.birthDate, {
      birthPlace: existing.birthPlace,
      birthTime: existing.birthTime,
      goal: existing.goal as UserProfile["goal"],
      interests: existing.interests,
      onboardingStep: existing.onboardingStep,
      completedSections: existing.completedSections,
      theme: existing.theme,
      language: existing.language,
      notifications: existing.notifications,
    });
  }
  return null;
}

export default function ExplorePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(getOrCreateProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = getOrCreateProfile();
    if (!current) {
      router.push("/");
      return;
    }
    setProfile(current);
  }, [router]);

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando tu perfil...</div>
      </div>
    );
  }

  const archetypeName = ARCHETYPES[profile.lifePath]?.name || profile.archetype;
  const allEntities = [...ENTITIES, ...EXTENDED_ENTITIES];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/profile")}>
            ← Volver a mi perfil
          </Button>
          <div className="mt-4">
            <h1 className="font-serif text-3xl font-light tracking-tight text-foreground">
              Explorar compatibilidad
            </h1>
            <p className="text-muted mt-2">
              {archetypeName} · {profile.lifePath} · {profile.sunSign}
            </p>
          </div>
        </div>

        <CompatibilityExplorer
          user={profile}
          entities={allEntities}
          categories={CATEGORIES}
        />
      </div>
      <UniversityFooter />
    </div>
  );
}
