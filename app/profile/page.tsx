"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/storage/ephemeral";
import { loadProfileFromStorage, downloadProfileJson, clearStoredProfile } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import CoreIdentity from "@/components/profile/CoreIdentity";
import PersonalityInsights from "@/components/profile/PersonalityInsights";
import StrengthsChallenges from "@/components/profile/StrengthsChallenges";
import Styles from "@/components/profile/Styles";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={handleNewSession}>
            ← Nueva sesión
          </Button>
          <Button variant="ghost" onClick={() => downloadProfileJson()}>
            Exportar JSON ↓
          </Button>
        </div>

        <CoreIdentity profile={profile} />
        <PersonalityInsights profile={profile} />
        <StrengthsChallenges profile={profile} />
        <Styles profile={profile} />

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
