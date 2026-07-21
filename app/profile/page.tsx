"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, type UserProfile } from "@/lib/storage/userProfile";
import { getSunSignSymbol } from "@/lib/engines/astrologyEngine";
import { ARCHETYPES } from "@/lib/data";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (!savedProfile) {
      router.push("/");
      return;
    }
    setProfile(savedProfile);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Cargando...</div>
      </div>
    );
  }

  if (!profile) return null;

  const archetypeData = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];
  const sunSignSymbol =
    typeof window !== "undefined"
      ? getSunSignSymbol(profile.birthDate)
      : "";

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl font-light tracking-tight mb-4">
          {profile.name.toUpperCase()}
        </h1>
        <p className="text-2xl text-[var(--accent)] font-serif italic mb-6">
          {archetypeData.name}
        </p>
        <div className="text-7xl font-serif font-light text-[var(--foreground)] mb-4">
          {profile.lifePath}
        </div>
        <p className="text-[var(--muted)] tracking-wide">
          {archetypeData.keywords.join(' · ')}
        </p>
      </div>

      <div className="w-full h-px bg-[var(--border)] mb-12" />

      <section className="mb-12">
        <h2 className="text-xs tracking-[0.2em] text-[var(--muted)] mb-6 uppercase">
          Tu Identidad
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted)]">Numerología</span>
            <span className="font-serif text-xl">{profile.lifePath}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted)]">Astrología</span>
            <span className="font-serif text-xl">
              {sunSignSymbol} {profile.sunSign}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted)]">Zodiaco Chino</span>
            <span className="font-serif text-xl">{profile.chineseZodiac}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted)]">Arquetipo</span>
            <span className="font-serif text-xl">{archetypeData.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted)]">Elemento</span>
            <span className="font-serif text-xl">{profile.element}</span>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xs tracking-[0.2em] text-[var(--muted)] mb-6 uppercase">
          Tu Esencia
        </h2>
        <p className="text-lg leading-relaxed text-[var(--foreground)]">
          {archetypeData.description}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xs tracking-[0.2em] text-[var(--muted)] mb-6 uppercase">
          Tu Fortaleza
        </h2>
        <div className="flex flex-wrap gap-3">
          {archetypeData.strengths.map((strength: string) => (
            <span
              key={strength}
              className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-sm"
            >
              {strength}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xs tracking-[0.2em] text-[var(--muted)] mb-6 uppercase">
          Tu Desafío
        </h2>
        <div className="flex flex-wrap gap-3">
          {archetypeData.challenges.map((challenge: string) => (
            <span
              key={challenge}
              className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-sm text-[var(--muted)]"
            >
              {challenge}
            </span>
          ))}
        </div>
      </section>

      <div className="text-center">
        <button
          onClick={() => router.push("/explore")}
          className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] font-medium tracking-wide rounded-full transition-all hover:bg-[var(--accent)]"
        >
          Explorar mi compatibilidad →
        </button>
      </div>
    </div>
  );
}
