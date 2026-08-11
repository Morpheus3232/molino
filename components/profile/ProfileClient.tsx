"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { UserProfile } from "@/types/user";
import { loadProfileFromStorage, saveProfileToStorage } from "@/lib/session/localStorage";
import { getSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { recordVisit } from "@/lib/session/discovery";
import ProfileHub from "@/components/profile/ProfileHub";
import EphemeralWarning from "@/components/profile/EphemeralWarning";
import Button from "@/components/ui/Button";

function buildFromLocal(): UserProfile | null {
  const stored = loadProfileFromStorage();
  if (stored) return stored as UserProfile;
  const session = getSession();
  if (session?.name && session?.birthDate) {
    const calculated = calculateUserProfile(session.name, session.birthDate);
    return {
      ...calculated,
      birthPlace: session.birthPlace || "",
      birthTime: session.birthTime,
      goal: (session.goal as UserProfile["goal"]) || "life",
      interests: session.interests || [],
      onboardingStep: session.onboardingStep || 1,
      completedSections: session.completedSections || ["identity"],
      theme: (session.theme as UserProfile["theme"]) || "light",
      language: (session.language as UserProfile["language"]) || "es",
      notifications: session.notifications ?? true,
      cycles: calculated.cycles || { personalYear: 0, personalMonth: 0, personalDay: 0 },
      recommendations: calculated.recommendations || { strengths: [], challenges: [], practices: [] },
    } as UserProfile;
  }
  return null;
}

export default function ProfileClient({ serverProfile, initialTab, futureDateError }: ProfileClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showEphemeralWarning, setShowEphemeralWarning] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(serverProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    recordVisit();

    if (searchParams.get("first") === "1") {
      const url = new URL(window.location.href);
      url.searchParams.delete("first");
      router.replace(url.pathname + url.search, { scroll: false });
    }

    if (serverProfile) {
      saveProfileToStorage(serverProfile);
      return;
    }

    if (!profile) {
      const local = buildFromLocal();
      if (local) setProfile(local);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverProfile]);

  const dismissEphemeralWarning = () => setShowEphemeralWarning(false);

  if (!mounted && !profile && !futureDateError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
          <p className="sr-only" role="status" aria-label="Cargando tu mapa...">
            Cargando tu mapa...
          </p>
          <div className="animate-pulse">
            <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
            <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
            <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
            <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-md mb-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-px bg-ink/10 mx-auto mb-8" />
          {futureDateError ? (
            <div role="alert">
              <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground mb-4">
                Fecha inválida
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                La fecha de nacimiento no puede ser futura. Ingresá una fecha válida para generar tu mapa.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground mb-4">
                Todavía no creaste tu mapa
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Ingresá tu fecha de nacimiento para generar tu mapa personal de autoconocimiento.
              </p>
            </>
          )}
          <Button variant="primary" size="lg" onClick={() => router.push("/")}>
            Crear mi mapa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        {showEphemeralWarning && (
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-4">
            <EphemeralWarning onDismiss={dismissEphemeralWarning} />
          </div>
        )}

        <ProfileHub profile={profile} />
      </main>

    </div>
  );
}

interface ProfileClientProps {
  serverProfile: UserProfile | null;
  initialTab: string | null;
  futureDateError?: boolean;
}