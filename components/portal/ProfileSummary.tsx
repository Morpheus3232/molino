"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";

interface ProfileSummaryProps {
  profile: UserProfile;
  archetype: { name: string; color: string; colorLight: string; keywords?: string[] };
  yearMeaning: { name: string; description: string };
}

export default function ProfileSummary({ profile, archetype, yearMeaning }: ProfileSummaryProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2937] mb-1">
        📊 Tu perfil completo
      </h1>
      <p className="text-sm text-[#6B7280] mb-6">{profile.name} · {profile.birthDate}</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Life Path", value: profile.lifePath },
          { label: "Expresión", value: profile.expressionNumber ?? "—" },
          { label: "Alma", value: profile.soulNumber ?? "—" },
          { label: "Personalidad", value: profile.personalityNumber ?? "—" },
          {
            label: "Año Personal",
            value: profile.lifePath
              ? Math.round(((new Date().getFullYear() - Number(profile.birthDate.split("-")[0])) + profile.lifePath))
              : "—",
          },
          {
            label: "Número Angel",
            value: (profile.lifePath * 7) % 100 || "—",
          },
        ].map((item) => (
          <div key={item.label} className="bg-[#F8F9FA] rounded-2xl p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-medium">{item.label}</p>
            <p className="text-2xl font-serif font-bold mt-2" style={{ color: archetype.color || "#D4A843" }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
          <span className="text-base">🎯</span> Arquetipo: <strong>{archetype.name}</strong>
        </span>
        <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
          <span className="text-base">{profile.sunSignInfo?.symbol || "♈"}</span> {profile.sunSign}
        </span>
        <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
          <span className="text-base">{profile.chineseZodiacInfo?.emoji || "🐴"}</span> {profile.chineseZodiac}
        </span>
        <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
          <span className="text-base">🗓️</span> {yearMeaning.name}
        </span>
      </div>
    </div>
  );
}
