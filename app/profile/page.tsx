"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/storage/ephemeral";
import { loadProfileFromStorage, downloadProfileJson, clearStoredProfile } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const OBJECTIVES = [
  { id: "life", label: "Decisiones de vida" },
  { id: "love", label: "Amor y vínculos" },
  { id: "career", label: "Carrera y emprendimiento" },
  { id: "business", label: "Negocios y proyectos" },
  { id: "growth", label: "Crecimiento personal" },
];

const ARCHETYPES: Record<number, { name: string; description: string; color: string }> = {
  1: { name: "El Líder", description: "Naciste para liderar.", color: "#D4A843" },
  2: { name: "El Mediador", description: "Tu energía es la del puente.", color: "#E8B4B8" },
  3: { name: "El Comunicador", description: "Tu energía es la de la expresión.", color: "#FF8C42" },
  4: { name: "El Constructor", description: "Tu energía es la de los cimientos.", color: "#2D5A3D" },
  5: { name: "El Aventurero", description: "Tu energía es la del viento.", color: "#C44536" },
  6: { name: "El Nutridor", description: "Tu energía es la del hogar.", color: "#8FBC8F" },
  7: { name: "El Investigador", description: "Tu energía es la de la verdad.", color: "#4A5568" },
  8: { name: "El Poderoso", description: "Tu energía es la del imperio.", color: "#6B4C7A" },
  9: { name: "El Adaptador", description: "Tu energía es la del todo.", color: "#2E5C8A" },
  11: { name: "El Visionario", description: "Tu energía es la del puente entre mundos.", color: "#8B5CF6" },
  22: { name: "El Constructor Maestro", description: "Tu energía es la del arquitecto divino.", color: "#4682B4" },
  33: { name: "El Maestro", description: "Tu energía es la del amor universal en acción.", color: "#B8860B" },
};

function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function getArchetype(lifePath: number) {
  return ARCHETYPES[lifePath] || ARCHETYPES[1];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = loadProfileFromStorage();
      if (stored) {
        setProfile(stored as UserProfile);
      } else {
        const existing = getSession();
        if (existing?.name && existing?.birthDate) {
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
    } catch (err) {
      console.error(err);
      setError("No pudimos cargar tu perfil. Intentá de nuevo.");
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
        <div className="text-muted">{error || "Cargando tu perfil..."}</div>
      </div>
    );
  }

  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = getArchetype(lifePath);
  const expressionNumber = safeNumber(profile.expressionNumber, 0);
  const soulNumber = safeNumber(profile.soulNumber, 0);
  const personalityNumber = safeNumber(profile.personalityNumber, 0);
  const name = typeof profile.name === "string" ? profile.name : "";
  const birthDate = typeof profile.birthDate === "string" ? profile.birthDate : "";
  const birthPlace = typeof profile.birthPlace === "string" ? profile.birthPlace : "";
  const birthTime = typeof profile.birthTime === "string" ? profile.birthTime : undefined;
  const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const element = typeof profile.element === "string" ? profile.element : "";
  const modality = typeof profile.modality === "string" ? profile.modality : "";
  const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";

  const radarData = useMemo(() => {
    const base = Math.min(lifePath * 10, 100);
    return [
      { subject: "Life Path", value: base },
      { subject: "Expresión", value: Math.min((expressionNumber || lifePath) * 10, 100) },
      { subject: "Alma", value: Math.min((soulNumber || lifePath) * 10, 100) },
      { subject: "Personalidad", value: Math.min((personalityNumber || lifePath) * 10, 100) },
      { subject: "Elemento", value: 50 + (lifePath % 5) * 10 },
    ];
  }, [lifePath, expressionNumber, soulNumber, personalityNumber]);

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

        <div className="space-y-6">
          <Card hover={false} padding="lg">
            <div className="text-center">
              <span className="badge mb-4">Tu perfil simbólico</span>
              <h1 className="font-serif text-5xl font-semibold tracking-tight md:text-7xl" style={{ color: archetype.color || "#D4A843" }}>
                {lifePath}
              </h1>
              <p className="mt-2 text-lg text-muted md:text-xl">Life Path</p>
              <p className="mt-4 text-2xl font-serif font-semibold text-foreground md:text-3xl">
                {name.toUpperCase()}
              </p>
              <p className="mt-2 text-sm text-muted">
                {birthDate}
                {birthPlace ? ` · ${birthPlace}` : ""}
                {birthTime ? ` · ${birthTime}` : ""}
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
              <p className="text-4xl font-serif font-semibold mt-2" style={{ color: archetype.color || "#D4A843" }}>{lifePath}</p>
              <p className="text-sm text-muted mt-1">{archetype.name}</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Expresión</p>
              <p className="text-4xl font-serif font-semibold mt-2" style={{ color: archetype.color || "#D4A843" }}>{expressionNumber || "—"}</p>
              <p className="text-sm text-muted mt-1">Cómo te presentás</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Alma</p>
              <p className="text-4xl font-serif font-semibold mt-2" style={{ color: archetype.color || "#D4A843" }}>{soulNumber || "—"}</p>
              <p className="text-sm text-muted mt-1">Tus deseos profundos</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Elemento</p>
              <p className="text-2xl font-serif font-semibold mt-2 text-foreground">{element}</p>
              <p className="text-sm text-muted mt-1">{modality}</p>
            </Card>
            <Card hover={false} padding="lg">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">Zodiaco chino</p>
              <p className="text-2xl font-serif font-semibold mt-2 text-foreground">{chineseZodiac}</p>
              <p className="text-sm text-muted mt-1">{profile.chineseZodiacInfo?.element || ""} · Animal de tu año</p>
            </Card>
          </div>

          <Card hover={false} padding="lg">
            <div className="text-center mb-4">
              <span className="badge mb-3">Tu radar simbólico</span>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-5 gap-3 text-center">
                {radarData.map((item) => (
                  <div key={item.subject} className="p-3 rounded-xl bg-background border border-border">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">{item.subject}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card hover={false} padding="lg">
            <div className="text-center">
              <span className="badge mb-3">Contexto</span>
              <h3 className="font-serif text-xl font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted mt-1">{birthDate}{birthPlace ? ` · ${birthPlace}` : ""}</p>
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

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Button fullWidth onClick={() => router.push("/patterns")}>
            Explorar mis patrones →
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/timing")}>
            Mi timing personal
          </Button>
        </div>
      </div>

      <UniversityFooter />
    </div>
  );
}
