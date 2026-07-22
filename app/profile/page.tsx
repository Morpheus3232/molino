"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/storage/ephemeral";
import { loadProfileFromStorage, downloadProfileJson, clearStoredProfile } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import RadarChart from "@/components/ui/RadarChart";

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

  const radarData = useMemo(() => [
    { subject: "Life Path", value: Math.min(profile.lifePath * 10, 100) },
    { subject: "Expresión", value: Math.min((profile.expressionNumber || profile.lifePath) * 10, 100) },
    { subject: "Alma", value: Math.min((profile.soulNumber || profile.lifePath) * 10, 100) },
    { subject: "Personalidad", value: Math.min((profile.personalityNumber || profile.lifePath) * 10, 100) },
    { subject: "Elemento", value: 50 + (profile.lifePath % 5) * 10 },
  ], [profile]);

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <div className="mx-auto max-w-content px-4 sm:px-6 py-10 pb-24">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={handleNewSession}>
            ← Nueva sesión
          </Button>
          <Button variant="ghost" onClick={() => downloadProfileJson()}>
            Exportar JSON ↓
          </Button>
        </div>

        <div className="space-y-10">
          <Card hover={false} padding="lg">
            <div className="text-center">
              <span className="badge mb-4">Tu perfil simbólico</span>
              <h1 className="font-serif text-5xl font-semibold tracking-tight md:text-7xl" style={{ color: archetype.color || "#D4A843" }}>
                {profile.lifePath}
              </h1>
              <p className="mt-2 text-lg text-muted md:text-xl">Life Path</p>
              <p className="mt-4 text-2xl font-serif font-semibold text-foreground md:text-3xl">
                {profile.name.toUpperCase()}
              </p>
              <p className="mt-2 text-sm text-muted">
                {profile.birthDate}
                {profile.birthPlace ? ` · ${profile.birthPlace}` : ""}
                {profile.birthTime ? ` · ${profile.birthTime}` : ""}
              </p>
              <p className="mt-4 text-base text-muted md:text-lg">{archetype.name}</p>
              <p className="mt-1 text-sm text-muted">{archetype.description}</p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-background px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-accent hover:shadow-sm">
                  📚 Numerología
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-background px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-accent hover:shadow-sm">
                  🌌 Astrología
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-background px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-accent hover:shadow-sm">
                  🐉 Zodiaco Chino
                </span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Life Path</p>
               <p className="text-4xl font-serif font-semibold mt-2" style={{ color: archetype.color || "#D4A843" }}>{profile.lifePath}</p>
              <p className="text-sm text-muted mt-1">{archetype.name}</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Expresión</p>
               <p className="text-4xl font-serif font-semibold mt-2" style={{ color: archetype.color || "#D4A843" }}>{profile.expressionNumber ?? "—"}</p>
              <p className="text-sm text-muted mt-1">Cómo te presentás</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Alma</p>
               <p className="text-4xl font-serif font-semibold mt-2" style={{ color: archetype.color || "#D4A843" }}>{profile.soulNumber ?? "—"}</p>
              <p className="text-sm text-muted mt-1">Tus deseos profundos</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Elemento</p>
               <p className="text-2xl font-serif font-semibold mt-2 text-foreground">{profile.element}</p>
              <p className="text-sm text-muted mt-1">{profile.modality}</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Zodiaco chino</p>
               <p className="text-2xl font-serif font-semibold mt-2 text-foreground">{profile.chineseZodiac}</p>
              <p className="text-sm text-muted mt-1">{profile.chineseZodiacInfo?.element || ""} · Animal de tu año</p>
            </Card>
          </div>

          <Card hover={false} padding="lg">
            <div className="text-center mb-4">
              <span className="badge mb-3">Tu radar simbólico</span>
            </div>
            <RadarChart
              title=""
              data={radarData}
            />
          </Card>

          <Card hover={false} padding="lg">
            <div className="text-center">
              <span className="badge mb-3">Contexto</span>
              <h3 className="font-serif text-xl font-semibold text-foreground">{profile.name}</h3>
              <p className="text-sm text-muted mt-1">{profile.birthDate}{profile.birthPlace ? ` · ${profile.birthPlace}` : ""}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {(OBJECTIVES.find((o) => o.id === profile.goal) ? [OBJECTIVES.find((o) => o.id === profile.goal)!] : []).map((obj) => (
                  <span key={obj.id} className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground transition-all duration-200 hover:border-accent hover:shadow-sm">
                    {obj.label}
                  </span>
                ))}
              </div>
            </div>
          </Card>
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
