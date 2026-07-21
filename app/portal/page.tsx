"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, isSessionValid, clearSession } from "@/lib/storage/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES, YEAR_TYPES, COUNTRY_DATA, BRAND_DATA, BAND_DATA, POLITICIAN_DATA, ACTOR_DATA } from "@/lib/data";
import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import ProfileSummary from "@/components/portal/ProfileSummary";
import KnowledgePortal from "@/components/portal/KnowledgePortal";
import RecommendationsSection from "@/components/portal/RecommendationsSection";
import LibrarySection from "@/components/portal/LibrarySection";
import DailyDataSection from "@/components/portal/DailyDataSection";
import FrameworksExplorer from "@/components/portal/FrameworksExplorer";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

function getOrCreateProfile(): UserProfile | null {
  const existing = getSession();
  if (existing && isSessionValid()) {
    return calculateUserProfile(existing.name, existing.birthDate);
  }
  return null;
}

export default function PortalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(getOrCreateProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = getOrCreateProfile();
    if (!current) {
      router.push("/");
    } else {
      setProfile(current);
    }
  }, [router]);

  const handleNewSession = () => {
    clearSession();
    router.push("/");
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Cargando tu mar de datos...</div>
      </div>
    );
  }

  const archetype = ARCHETYPES[profile.lifePath] || { name: "El Buscador", color: "#4A5568", colorLight: "#D8DEE4", keywords: ["Curioso", "Analítico"] };
  const yearMeaning = YEAR_TYPES[(profile.lifePath % 9) || 9] || YEAR_TYPES[1];
  const dayNumber = new Date().getDate();
  const monthNumber = new Date().getMonth() + 1;
  const dayExpression = (dayNumber + monthNumber + new Date().getFullYear()).toString().split("").reduce((a, b) => a + parseInt(b), 0);
  const dayReduced = dayExpression > 9 && ![11, 22, 33].includes(dayExpression) ? dayExpression.toString().split("").reduce((a, b) => a + parseInt(b), 0) : dayExpression;
  const dayInfo = YEAR_TYPES[(dayReduced % 9) || 9] || YEAR_TYPES[1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      <UniversityHeader />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={handleNewSession} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            ← Nueva sesión
          </button>
          <button onClick={() => router.push("/profile")} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            Mi perfil →
          </button>
        </div>

        <ProfileSummary profile={profile} archetype={archetype} yearMeaning={yearMeaning} />

        <RecommendationsSection profile={profile} />

        <KnowledgePortal profile={profile} knowledge={KNOWLEDGE_BASE} />

        <DailyDataSection profile={profile} dayNumber={dayReduced} dayInfo={dayInfo} />

        <LibrarySection profile={profile} knowledge={KNOWLEDGE_BASE} />

        <FrameworksExplorer frameworks={KNOWLEDGE_BASE.frameworks} />

        <div className="text-center text-xs text-[#9CA3AF]">
          Sesión efímera. No se guarda información en este dispositivo.
        </div>
      </div>

      <UniversityFooter />
    </div>
  );
}
