"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, isSessionValid, clearSession } from "@/lib/storage/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { getSunSignSymbol } from "@/lib/engines/astrologyEngine";
import { ARCHETYPES, YEAR_TYPES, getChineseAnimal } from "@/lib/data";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

function getOrCreateProfile(): UserProfile | null {
  const existing = getSession();
  if (existing && isSessionValid()) {
    return calculateUserProfile(existing.name, existing.birthDate);
  }
  return null;
}

export default function ProfilePage() {
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

  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];
  const sunSignSymbol = getSunSignSymbol(profile.birthDate);
  const chineseAnimal = getChineseAnimal(new Date(profile.birthDate).getFullYear());
  const yearMeaning = YEAR_TYPES[(profile.lifePath % 9) || 9] || YEAR_TYPES[1];

  const numerologyNumbers = [
    { label: "Life Path", value: profile.lifePath, description: "Tu propósito fundamental" },
    { label: "Expresión", value: profile.expressionNumber ?? "—", description: "Cómo te presentás al mundo" },
    { label: "Alma", value: profile.soulNumber ?? "—", description: "Tus deseos más profundos" },
    { label: "Personalidad", value: profile.personalityNumber ?? "—", description: "Cómo te perciben los demás" },
  ];

  const handleNewSession = () => {
    clearSession();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />

      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={handleNewSession}>
            ← Nueva sesión
          </Button>
          <Button variant="ghost" onClick={() => router.push("/patterns")}>
            Ver mis patrones →
          </Button>
        </div>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <div className="text-center mb-8">
              <span className="badge mb-3">Tu identidad</span>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-1">{profile.name.toUpperCase()}</h1>
              <p className="text-sm text-muted">{profile.birthDate}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {numerologyNumbers.map((item) => (
                <div key={item.label} className="bg-background rounded-2xl p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">{item.label}</p>
                  <p className="text-3xl font-serif font-bold mt-2" style={{ color: archetype.color || "#D4A843" }}>{item.value}</p>
                  <p className="text-xs text-muted mt-1">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-2 text-sm text-foreground">
                <span className="text-base">🎯</span> Arquetipo: <strong>{archetype.name}</strong>
              </span>
              <span className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-2 text-sm text-foreground">
                <span className="text-base">{sunSignSymbol}</span> {profile.sunSign}
              </span>
              <span className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-2 text-sm text-foreground">
                <span className="text-base">{profile.chineseZodiacInfo?.emoji || "🐴"}</span> {profile.chineseZodiac}
              </span>
              <span className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-2 text-sm text-foreground">
                <span className="text-base">🗓️</span> {yearMeaning.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Elemento</p>
                <p className="text-lg font-serif font-bold mt-2 text-foreground">{profile.element}</p>
                <p className="text-xs text-muted mt-1">{profile.modality}</p>
              </div>
              <div className="bg-background rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Zodiaco chino</p>
                <p className="text-lg font-serif font-bold mt-2 text-foreground">{chineseAnimal}</p>
                <p className="text-xs text-muted mt-1">Animal de tu año</p>
              </div>
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Tu esencia</span>
            </div>
            <p className="text-muted leading-relaxed">{archetype.description}</p>
            <div className="mt-4 p-4 bg-background rounded-2xl">
              <p className="text-sm text-foreground italic">"{archetype.quote}"</p>
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Fortalezas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(archetype.strengths || []).map((strength: string) => (
                <span key={strength} className="px-4 py-2 bg-background border border-border rounded-full text-sm text-foreground">
                  {strength}
                </span>
              ))}
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Desafíos</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(archetype.challenges || []).map((challenge: string) => (
                <span key={challenge} className="px-4 py-2 bg-background border border-border rounded-full text-sm text-muted">
                  {challenge}
                </span>
              ))}
            </div>
          </Card>
        </Section>

        <Section>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button fullWidth onClick={() => router.push("/patterns")}>
              Explorar mis patrones →
            </Button>
            <Button variant="secondary" fullWidth onClick={() => router.push("/timing")}>
              Mi timing personal
            </Button>
          </div>
        </Section>
      </div>

      <UniversityFooter />
    </div>
  );
}
