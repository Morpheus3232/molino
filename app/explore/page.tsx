"use client";

import { useState, useEffect, useMemo } from "react";
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
  { id: "all", label: "Todos", icon: "🔍" },
  { id: "country", label: "Países", icon: "🌍" },
  { id: "city", label: "Ciudades", icon: "🏙️" },
  { id: "brand", label: "Marcas", icon: "🏷️" },
  { id: "band", label: "Bandas", icon: "🎸" },
  { id: "movie", label: "Películas", icon: "🎬" },
  { id: "book", label: "Libros", icon: "📚" },
  { id: "philosophy", label: "Filosofía", icon: "📖" },
  { id: "historicalEvent", label: "Eventos", icon: "📜" },
  { id: "food", label: "Comidas", icon: "🍽️" },
  { id: "color", label: "Colores", icon: "🎨" },
  { id: "crystal", label: "Cristales", icon: "💎" },
  { id: "deity", label: "Deidades", icon: "✨" },
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
  const allEntities = useMemo(() => [...ENTITIES, ...EXTENDED_ENTITIES], []);

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
