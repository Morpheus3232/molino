"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/storage/ephemeral";
import { loadProfileFromStorage, downloadProfileJson, clearStoredProfile } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import CoreIdentity from "@/components/profile/CoreIdentity";
import PersonalityInsights from "@/components/profile/PersonalityInsights";
import StrengthsChallenges from "@/components/profile/StrengthsChallenges";
import Styles from "@/components/profile/Styles";
import RadarChart from "@/components/ui/RadarChart";
import SynthesisCard from "@/components/profile/SynthesisCard";
import Card from "@/components/ui/Card";

const OBJECTIVES = [
  { id: "life", label: "Decisiones de vida" },
  { id: "love", label: "Amor y vínculos" },
  { id: "career", label: "Carrera y emprendimiento" },
  { id: "business", label: "Negocios y proyectos" },
  { id: "growth", label: "Crecimiento personal" },
];

const INTERESTS = [
  { id: "relationships", label: "Relaciones" },
  { id: "career", label: "Carrera" },
  { id: "finance", label: "Finanzas" },
  { id: "health", label: "Salud" },
  { id: "spirituality", label: "Espiritualidad" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadProfileFromStorage();
    if (stored) {
      setProfile(stored as UserProfile);
    } else {
      const existing = getSession();
      if (existing && existing.name && existing.birthDate) {
        const calculated = calculateUserProfile(existing.name, existing.birthDate);
        setProfile({
          ...calculated,
          birthPlace: existing.birthPlace,
          birthTime: existing.birthTime,
          goal: (existing.goal as UserProfile["goal"]) || "life",
          interests: existing.interests,
          onboardingStep: existing.onboardingStep,
          completedSections: existing.completedSections,
          theme: existing.theme,
          language: existing.language,
          notifications: existing.notifications,
        });
      } else {
        router.push("/");
      }
    }
  }, [router]);

  const handleNewSession = () => {
    clearSession();
    clearStoredProfile();
    router.push("/");
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Cargando tu perfil...</div>
      </div>
    );
  }

  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-10 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={handleNewSession}>
            ← Nueva sesión
          </Button>
          <Button variant="ghost" onClick={() => downloadProfileJson()}>
            Exportar JSON ↓
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <CoreIdentity profile={profile} />

            <Section className="mb-0">
              <Card hover={false} padding="lg">
                <div className="text-center mb-4">
                  <span className="badge mb-3">Tu perfil simbólico</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Life Path", value: profile.lifePath },
                    { label: "Expresión", value: profile.expressionNumber ?? "—" },
                    { label: "Alma", value: profile.soulNumber ?? "—" },
                    { label: "Personalidad", value: profile.personalityNumber ?? "—" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-card-border bg-card p-4 text-center">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">N{'>'}{item.label}</p>
                      <p className="text-3xl font-serif font-bold mt-2" style={{ color: archetype.color || "#D4A843" }}>{item.value}</p>
                      <p className="text-xs text-muted mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </Section>

            <PersonalityInsights profile={profile} />
            <StrengthsChallenges profile={profile} />
            <Styles profile={profile} />
            <SynthesisCard profile={profile} />
          </div>

          <div className="space-y-6">
            <Card hover={false} padding="lg">
              <div className="text-center mb-5">
                <span className="badge mb-3">Contexto</span>
                <h3 className="font-serif text-xl font-semibold text-foreground">{profile.name}</h3>
                <p className="text-sm text-muted mt-1">{profile.birthDate}{profile.birthPlace ? ` • ${profile.birthPlace}` : ""}</p>
                {profile.birthTime && (
                  <p className="text-sm text-muted">🕒 {profile.birthTime}</p>
                )}
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Objetivo</p>
                  <p className="text-sm text-foreground mt-1">{OBJECTIVES.find((o) => o.id === profile.goal)?.label || profile.goal}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Intereses</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.interests.map((id) => {
                      const item = INTERESTS.find((i) => i.id === id);
                      return (
                        <span key={id} className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-3 py-1.5 text-xs text-foreground">
                          {item?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            <RadarChart
              title="Tu radar simbólico"
              data={[
                { subject: "Life Path", value: Math.min(profile.lifePath * 10, 100) },
                { subject: "Expresión", value: Math.min((profile.expressionNumber || profile.lifePath) * 10, 100) },
                { subject: "Alma", value: Math.min((profile.soulNumber || profile.lifePath) * 10, 100) },
                { subject: "Personalidad", value: Math.min((profile.personalityNumber || profile.lifePath) * 10, 100) },
                { subject: "Elemento", value: 50 + (profile.lifePath % 5) * 10 },
              ]}
            />
          </div>
        </div>

        <Section className="mt-10">
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
