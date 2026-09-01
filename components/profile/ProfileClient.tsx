"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { loadProfileFromStorage, saveProfileToStorage } from "@/lib/session/localStorage";
import { getSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { encodeProfileData, profileFromEncoded } from "@/lib/utils/profileShare";
import { recordVisit } from "@/lib/session/discovery";
import ProfileHub from "@/components/profile/ProfileHub";
import CalculationMatrix from "@/components/profile/CalculationMatrix";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

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

/**
 * Resolución síncrona del perfil para pintar la cuenta real durante la
 * carga. El hash nunca llega al servidor, así que en el primer render
 * (serverProfile = null) el perfil solo puede salir de acá o de
 * localStorage — las dos son lecturas síncronas, perfectas para la
 * animación matrix que muestra la suma genuina que estamos haciendo.
 */
function resolveProfileSync(serverProfile: UserProfile | null): UserProfile | null {
  if (serverProfile) return serverProfile;
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1);
  if (hash) {
    const fromHash = profileFromEncoded(hash);
    if (fromHash) return fromHash;
  }
  return buildFromLocal();
}

const MATRIX_SEEN_KEY = "molino.matrix-seen";

export default function ProfileClient({ serverProfile, futureDateError, catalog }: ProfileClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(serverProfile);
  const [mounted, setMounted] = useState(false);
  // La animación matrix de la cuenta real se muestra una sola vez por sesión:
  // la primera vez que el perfil se carga en esta pestaña. Después, directo al
  // mapa. La bandera vive en sessionStorage para que un usuario recurrente que
  // ya vio su mapa no vuelva a pasar por la animación en cada clic de "Mi Mapa".
  const [matrixDone, setMatrixDone] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(MATRIX_SEEN_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setMounted(true);
    recordVisit();

    if (serverProfile) {
      saveProfileToStorage(serverProfile);
      return;
    }

    // Ya vimos la animación matrix en esta sesión (matrixDone comenzó true), así
    // que resolvemos el perfil de la forma clásica (hash → localStorage).
    if (!profile && matrixDone) {
      // The hash never reaches the server (see the URL-sync effect below), so
      // reconstructing a bookmarked /profile#<hash> only happens here.
      const hash = window.location.hash.slice(1);
      const fromHash = hash ? profileFromEncoded(hash) : null;
      if (fromHash) {
        setProfile(fromHash);
        saveProfileToStorage(fromHash);
        return;
      }
      const local = buildFromLocal();
      if (local) setProfile(local);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverProfile]);

  // The mount effect above only sees the hash on a genuine fresh page load.
  // Editing just the fragment of an already-open /profile tab (address bar
  // + Enter, or history back/forward between two shared links) is a
  // same-document navigation — no remount, so nothing re-reads the hash
  // without this listener.
  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const fromHash = profileFromEncoded(hash);
      if (fromHash) {
        setProfile(fromHash);
        saveProfileToStorage(fromHash);
      }
    }
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  // Once a profile is on screen — however it got there (?dob= redirect from
  // onboarding, localStorage, or an existing hash) — normalize the address
  // bar to a self-contained /profile#<hash>. That URL needs no server lookup
  // to redraw the map, so it's both a bookmark of "your own map" and a link
  // you could hand to someone else without this session's ?dob= ever having
  // touched a server log a second time.
  useEffect(() => {
    if (!mounted || !profile) return;
    const encoded = encodeProfileData(profile);
    if (window.location.hash.slice(1) === encoded && !window.location.search) return;
    window.history.replaceState(null, "", `/profile#${encoded}`);
  }, [mounted, profile]);

  // La animación matrix con la cuenta real corre una sola vez por sesión, la
  // primera vez que el perfil se carga (venga de ?dob= del onboarding, del hash
  // compartido o del localStorage). Al terminar, onComplete abre Mi Mapa. Un
  // usuario que ya vio su mapa esta sesión va directo, sin volver a animar.
  const pendingProfile = !futureDateError && !matrixDone ? resolveProfileSync(serverProfile) : null;

  if (pendingProfile) {
    return (
      <CalculationMatrix
        profile={pendingProfile}
        onComplete={() => {
          setProfile(pendingProfile);
          setMatrixDone(true);
          try {
            window.sessionStorage.setItem(MATRIX_SEEN_KEY, "1");
          } catch {
            /* noop */
          }
          saveProfileToStorage(pendingProfile);
        }}
      />
    );
  }

  if (!mounted && !profile && !futureDateError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
          <p className="sr-only" role="status" aria-label="Cargando tu mapa...">
            Cargando tu mapa...
          </p>
          <div className="animate-pulse">
            <div className="h-3 bg-[var(--skeleton)] rounded w-[25rem] mb-6" />
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
              <Button variant="accent" size="lg" onClick={() => router.push("/")}>
                Ir a la portada
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground mb-4">
                Tu mapa se genera en la portada
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Elegís tu fecha de nacimiento en la portada y volvés directo acá, a tu numerología, astrología y
                zodíaco chino ya cruzados en un solo mapa.
              </p>
              <div className="flex justify-center mb-6">
                <Badge variant="muted">Gratis · Sin registro</Badge>
              </div>
              <div>
                <Button variant="accent" size="lg" onClick={() => router.push("/")}>
                  Ir a la portada
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <ProfileHub profile={profile} catalog={catalog} />
      </main>

    </div>
  );
}

interface ProfileClientProps {
  serverProfile: UserProfile | null;
  futureDateError?: boolean;
  catalog?: LightweightEntity[];
}