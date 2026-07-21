"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, isSessionValid, clearSession } from "@/lib/storage/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { getSunSignSymbol } from "@/lib/engines/astrologyEngine";
import { ARCHETYPES, YEAR_TYPES, getChineseAnimal, getCompatibilityScore } from "@/lib/data";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

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
        <div className="text-[var(--muted)]">Cargando tu perfil...</div>
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
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      <UniversityHeader />

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleNewSession} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            ← Nueva sesión
          </button>
          <button onClick={() => router.push("/explore")} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            Explorar compatibilidades →
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium mb-2">TU NOMBRE</p>
            <h1 className="font-serif text-4xl font-bold text-[#1F2937] mb-1">{profile.name.toUpperCase()}</h1>
            <p className="text-sm text-[#6B7280]">{profile.birthDate}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {numerologyNumbers.map((item) => (
              <div key={item.label} className="bg-[#F8F9FA] rounded-2xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-medium">{item.label}</p>
                <p className="text-3xl font-serif font-bold mt-2" style={{ color: archetype.color || "#D4A843" }}>{item.value}</p>
                <p className="text-xs text-[#6B7280] mt-1">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
              <span className="text-base">🎯</span> Arquetipo: <strong>{archetype.name}</strong>
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
              <span className="text-base">{sunSignSymbol}</span> {profile.sunSign}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
              <span className="text-base">{profile.chineseZodiacInfo?.emoji || "🐴"}</span> {profile.chineseZodiac}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
              <span className="text-base">🗓️</span> {yearMeaning.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#F8F9FA] rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-medium">Elemento</p>
              <p className="text-lg font-serif font-bold mt-2 text-[#1F2937]">{profile.element}</p>
              <p className="text-xs text-[#6B7280] mt-1">{profile.modality}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-medium">Zodiaco chino</p>
              <p className="text-lg font-serif font-bold mt-2 text-[#1F2937]">{chineseAnimal}</p>
              <p className="text-xs text-[#6B7280] mt-1">Animal de tu año</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1F2937] mb-4">Tu esencia</h2>
          <p className="text-[#6B7280] leading-relaxed">{archetype.description}</p>
          <div className="mt-4 p-4 bg-[#F8F9FA] rounded-2xl">
            <p className="text-sm text-[#1F2937] italic">"{archetype.quote}"</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1F2937] mb-4">Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {(archetype.keywords || []).map((keyword: string) => (
              <span key={keyword} className="px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-full text-sm text-[#1F2937]">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      <UniversityFooter />
    </div>
  );
}
