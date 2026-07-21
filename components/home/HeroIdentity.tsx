"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, isSessionValid } from "@/lib/storage/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import { getSunSignSymbol } from "@/lib/engines/astrologyEngine";

function getOrCreateProfile(): UserProfile | null {
  const existing = getSession();
  if (existing && isSessionValid()) {
    return calculateUserProfile(existing.name, existing.birthDate);
  }
  return null;
}

export default function HeroIdentity() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(getOrCreateProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = getOrCreateProfile();
    if (current) {
      setProfile(current);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Cargando...</div>
      </div>
    );
  }

  if (profile) {
    const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];
    const sunSignSymbol = getSunSignSymbol(profile.birthDate);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] text-[var(--muted)] uppercase mb-4">
            Tu identidad
          </p>
          <h1 className="font-serif text-6xl font-light tracking-tight mb-2">
            {profile.name.toUpperCase()}
          </h1>
          <p className="text-xl text-[var(--accent)] font-serif italic mb-6">
            {archetype.name}
          </p>
          <div className="text-8xl font-serif font-light text-[var(--foreground)] mb-4">
            {profile.lifePath}
          </div>
          <p className="text-[var(--muted)] tracking-wide mb-8">
            {sunSignSymbol} {profile.sunSign} · {profile.chineseZodiac}
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={() => router.push("/profile")}
              className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-full transition-all hover:bg-[var(--accent)]"
            >
              Ver mi perfil completo
            </button>
            <button
              onClick={() => router.push("/explore")}
              className="w-full py-4 bg-transparent border border-[var(--border)] text-[var(--foreground)] font-medium rounded-full transition-all hover:border-[var(--accent)]"
            >
              Explorar compatibilidades
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="font-serif text-5xl font-light tracking-tight mb-4">
          🌾 Molino
        </h1>
        <p className="text-[var(--muted)] mb-8">
          Universidad Pública de Libre Acceso
        </p>
        <a
          href="/onboarding"
          className="inline-block w-full py-4 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-full transition-all hover:bg-[var(--accent)]"
        >
          Comenzar mi análisis
        </a>
      </div>
    </div>
  );
}
