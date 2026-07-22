"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/storage/ephemeral";
import { loadProfileFromStorage, clearStoredProfile } from "@/lib/storage/localStorage";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
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
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const archetypeDescription = typeof profile.archetypeInfo?.description === "string" ? profile.archetypeInfo.description : "";
  const archetypeKeywords = Array.isArray(profile.archetypeInfo?.keywords) ? profile.archetypeInfo.keywords : [];
  const archetypeStrengths = Array.isArray(profile.archetypeInfo?.strengths) ? profile.archetypeInfo.strengths : [];
  const archetypeChallenges = Array.isArray(profile.archetypeInfo?.challenges) ? profile.archetypeInfo.challenges : [];
  const sunSignElement = typeof profile.sunSignInfo?.element === "string" ? profile.sunSignInfo.element : "";
  const sunSignModality = typeof profile.sunSignInfo?.modality === "string" ? profile.sunSignInfo.modality : "";
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const personalYear = safeNumber(profile.cycles?.personalYear, 0);
  const personalMonth = safeNumber(profile.cycles?.personalMonth, 0);
  const personalDay = safeNumber(profile.cycles?.personalDay, 0);
  const recommendationStrengths = Array.isArray(profile.recommendations?.strengths) ? profile.recommendations.strengths : [];
  const recommendationChallenges = Array.isArray(profile.recommendations?.challenges) ? profile.recommendations.challenges : [];
  const practices = Array.isArray(profile.recommendations?.practices) ? profile.recommendations.practices : [];

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <div className="mx-auto max-w-content px-4 sm:px-6 py-10 pb-24">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Mi mapa personal</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground">{name}</h1>
          <p className="text-base text-muted mt-2">{birthDate}{birthPlace ? ` · ${birthPlace}` : ""}</p>
          {archetypeDescription && (
            <p className="text-sm text-muted mt-4 leading-relaxed max-w-2xl">
              {archetypeDescription}
            </p>
          )}
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Identidad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nombre" value={name} />
              <InfoItem label="Fecha de nacimiento" value={birthDate} />
              {birthPlace && <InfoItem label="Lugar" value={birthPlace} />}
              {birthTime && <InfoItem label="Hora" value={birthTime} />}
              <InfoItem label="Arquetipo" value={archetypeName} />
            </div>
            {archetypeKeywords.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {archetypeKeywords.map((keyword: string) => (
                  <span key={keyword} className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Numerología</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Life Path" value={String(lifePath)} accent />
              <MetricCard label="Expresión" value={expressionNumber ? String(expressionNumber) : '—'} />
              <MetricCard label="Alma" value={soulNumber ? String(soulNumber) : '—'} />
              <MetricCard label="Personalidad" value={personalityNumber ? String(personalityNumber) : '—'} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Fortalezas</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {archetypeStrengths.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Desafíos</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {archetypeChallenges.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Astrología</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Signo solar" value={sunSign} />
              <InfoItem label="Elemento" value={sunSignElement} />
              <InfoItem label="Modalidad" value={sunSignModality} />
              <InfoItem label="Zodiaco chino" value={chineseZodiac} />
              {chineseElement && <InfoItem label="Elemento chino" value={chineseElement} />}
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Ciclos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard label="Año personal" value={personalYear ? String(personalYear) : '—'} />
              <MetricCard label="Mes personal" value={personalMonth ? String(personalMonth) : '—'} />
              <MetricCard label="Día personal" value={personalDay ? String(personalDay) : '—'} />
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-4">Recomendaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Fortalezas</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {recommendationStrengths.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Desafíos</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {recommendationChallenges.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            {practices.length > 0 && (
              <div className="mt-4 p-4 rounded-xl border border-border bg-background">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Prácticas sugeridas</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {practices.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-background">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">{label}</p>
      <p className="text-base text-foreground mt-1 font-medium">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-5 rounded-xl border text-center ${accent ? 'border-foreground/20 bg-background' : 'border-border bg-background'}`}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">{label}</p>
      <p className={`text-3xl font-semibold mt-2 ${accent ? 'text-foreground' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
