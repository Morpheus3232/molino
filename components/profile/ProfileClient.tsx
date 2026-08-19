"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { loadProfileFromStorage, saveProfileToStorage } from "@/lib/session/localStorage";
import { getSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { encodeProfileData, profileFromEncoded, decodePublicData, profileFromPublicData } from "@/lib/utils/profileShare";
import { recordVisit } from "@/lib/session/discovery";
import { fadeUp } from "@/lib/utils/motion";
import ProfileHub from "@/components/profile/ProfileHub";
import EphemeralWarning from "@/components/profile/EphemeralWarning";
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

export default function ProfileClient({ serverProfile, initialTab, initialRef, futureDateError }: ProfileClientProps) {
  const router = useRouter();
  const [showEphemeralWarning, setShowEphemeralWarning] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(serverProfile);
  const [mounted, setMounted] = useState(false);
  const isSharedView = Boolean(initialRef);

  useEffect(() => {
    setMounted(true);
    recordVisit();

    if (initialRef) {
      const publicData = decodePublicData(initialRef);
      if (publicData) {
        setProfile(profileFromPublicData(publicData));
      }
      return;
    }

    if (serverProfile) {
      saveProfileToStorage(serverProfile);
      return;
    }

    if (!profile) {
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
  }, [serverProfile, initialRef]);

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
    if (!mounted || !profile || isSharedView) return;
    const encoded = encodeProfileData(profile);
    if (window.location.hash.slice(1) === encoded && !window.location.search) return;
    window.history.replaceState(null, "", `/profile#${encoded}`);
  }, [mounted, profile, isSharedView]);

  // In shared view, scroll to the relevant section after mount
  useEffect(() => {
    if (!mounted || !isSharedView || !initialTab) return;
    const id = initialTab === "circle" ? "circle-heading" : initialTab === "world" ? "world-heading" : null;
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [mounted, isSharedView, initialTab]);

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
          <motion.div {...fadeUp} className="w-8 h-px bg-ink/10 mx-auto mb-8" />
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
              <motion.h1
                {...fadeUp}
                className="font-display text-4xl sm:text-5xl tracking-tight text-foreground mb-4"
              >
                Tu mapa se genera en la portada
              </motion.h1>
              <motion.p {...fadeUp} className="text-muted mb-8 max-w-md mx-auto">
                Elegís tu fecha de nacimiento en la portada y volvés directo acá, a tu numerología, astrología y
                zodíaco chino ya cruzados en un solo mapa.
              </motion.p>
              <motion.div {...fadeUp} className="flex justify-center mb-6">
                <Badge variant="muted">Gratis · Sin registro</Badge>
              </motion.div>
              <motion.div {...fadeUp}>
                <Button variant="accent" size="lg" onClick={() => router.push("/")}>
                  Ir a la portada
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        {isSharedView && (
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-4">
            <div className="flex items-center justify-between gap-4 p-4 border border-accent/20 bg-accent/[0.04] rounded-lg">
              <p className="text-sm text-foreground">
                Estás viendo un mapa compartido.{" "}
                {loadProfileFromStorage()
                  ? "Tenés tu propio mapa — entrá a tu perfil para comparar."
                  : "Creá tu mapa para comparar con este."}
              </p>
              <Button
                variant="accent"
                size="sm"
                onClick={() => router.push(loadProfileFromStorage() ? "/profile" : "/onboarding")}
                className="shrink-0"
              >
                {loadProfileFromStorage() ? "Mi mapa" : "Crear mi mapa"}
              </Button>
            </div>
          </div>
        )}

        {showEphemeralWarning && (
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-4">
            <EphemeralWarning onDismiss={dismissEphemeralWarning} />
          </div>
        )}

        <ProfileHub profile={profile} isSharedView={isSharedView} />
      </main>

    </div>
  );
}

interface ProfileClientProps {
  serverProfile: UserProfile | null;
  initialTab: string | null;
  initialRef?: string;
  futureDateError?: boolean;
}