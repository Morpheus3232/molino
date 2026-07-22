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

type SectionId = 'identity' | 'numbers' | 'astrology' | 'cycles' | 'strengths' | 'recommendations';

const SECTION_LABELS: Record<SectionId, string> = {
  identity: 'Mi identidad',
  numbers: 'Mi numerología',
  astrology: 'Mi astrología',
  cycles: 'Mis ciclos',
  strengths: 'Mis fortalezas',
  recommendations: 'Mis recomendaciones',
};

function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    identity: true,
    numbers: true,
    astrology: true,
    cycles: true,
    strengths: true,
    recommendations: true,
  });

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

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
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
  const archetypeColor = typeof profile.archetypeInfo?.color === "string" ? profile.archetypeInfo.color : "#D4A843";
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
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" onClick={handleNewSession}>
            ← Nueva sesión
          </Button>
          <Button variant="ghost" onClick={() => downloadProfileJson()}>
            Exportar JSON ↓
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground">Mi mapa personal</h1>
          <p className="text-base text-muted mt-2">Tu perfil completo, generado a partir de tus datos.</p>
        </div>

        <div className="space-y-4">
          <ProfileSection
            id="identity"
            label="Mi identidad"
            defaultOpen
            isOpen={openSections.identity}
            onToggle={() => toggleSection('identity')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nombre" value={name} />
              <InfoItem label="Fecha de nacimiento" value={birthDate} />
              {birthPlace && <InfoItem label="Lugar" value={birthPlace} />}
              {birthTime && <InfoItem label="Hora" value={birthTime} />}
              <InfoItem label="Life Path" value={String(lifePath)} />
              <InfoItem label="Arquetipo" value={archetypeName} />
            </div>
            {archetypeDescription && (
              <div className="mt-4 p-4 rounded-xl bg-background border border-border">
                <p className="text-sm text-muted leading-relaxed">{archetypeDescription}</p>
              </div>
            )}
            {archetypeKeywords.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {archetypeKeywords.map((keyword: string) => (
                  <span key={keyword} className="inline-flex items-center rounded-full border border-card-border bg-background px-3 py-1 text-xs text-foreground">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </ProfileSection>

          <ProfileSection
            id="numbers"
            label="Mi numerología"
            isOpen={openSections.numbers}
            onToggle={() => toggleSection('numbers')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Life Path" value={String(lifePath)} accent />
              <MetricCard label="Expresión" value={expressionNumber ? String(expressionNumber) : '—'} />
              <MetricCard label="Alma" value={soulNumber ? String(soulNumber) : '—'} />
              <MetricCard label="Personalidad" value={personalityNumber ? String(personalityNumber) : '—'} />
            </div>
            {archetypeStrengths.length > 0 && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Fortalezas del arquetipo</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {archetypeStrengths.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {archetypeChallenges.length > 0 && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Desafíos del arquetipo</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {archetypeChallenges.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </ProfileSection>

          <ProfileSection
            id="astrology"
            label="Mi astrología"
            isOpen={openSections.astrology}
            onToggle={() => toggleSection('astrology')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Signo solar" value={sunSign} />
              <InfoItem label="Elemento" value={element} />
              <InfoItem label="Modalidad" value={modality} />
              <InfoItem label="Zodiaco chino" value={chineseZodiac} />
              <InfoItem label="Elemento chino" value={chineseElement} />
            </div>
          </ProfileSection>

          <ProfileSection
            id="cycles"
            label="Mis ciclos"
            isOpen={openSections.cycles}
            onToggle={() => toggleSection('cycles')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard label="Año personal" value={personalYear ? String(personalYear) : '—'} />
              <MetricCard label="Mes personal" value={personalMonth ? String(personalMonth) : '—'} />
              <MetricCard label="Día personal" value={personalDay ? String(personalDay) : '—'} />
            </div>
          </ProfileSection>

          <ProfileSection
            id="strengths"
            label="Mis fortalezas"
            isOpen={openSections.strengths}
            onToggle={() => toggleSection('strengths')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Fortalezas</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {recommendationStrengths.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Desafíos</p>
                <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {recommendationChallenges.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </ProfileSection>

          <ProfileSection
            id="recommendations"
            label="Mis recomendaciones"
            isOpen={openSections.recommendations}
            onToggle={() => toggleSection('recommendations')}
          >
            <div className="p-4 rounded-xl bg-background border border-border">
              <p className="text-xs uppercase tracking-[0.18em] text-muted font-medium mb-2">Prácticas sugeridas</p>
              <ul className="list-disc list-inside text-sm text-muted space-y-1">
                  {practices.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </ProfileSection>
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

function ProfileSection({
  id,
  label,
  children,
  defaultOpen = false,
  isOpen,
  onToggle,
}: {
  id: SectionId;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Card hover={false} padding="lg">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-foreground">{label}</span>
        <span className="text-sm text-muted">{isOpen ? 'Ocultar' : 'Mostrar'}</span>
      </button>
      <div className={`mt-4 transition-all duration-300 ease-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        {children}
      </div>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-background border border-border">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">{label}</p>
      <p className="text-base text-foreground mt-1 font-medium">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border text-center ${accent ? 'border-accent/40 bg-background' : 'border-border bg-background'}`}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">{label}</p>
      <p className={`text-3xl font-semibold mt-1 ${accent ? 'text-accent' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
