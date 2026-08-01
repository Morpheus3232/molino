"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { loadProfileFromStorage, saveProfileToStorage } from "@/lib/session/localStorage";
import { getSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { loadDiscoveryState, markSeen, recordVisit, hasSeenAll } from "@/lib/session/discovery";
import UniversityFooter from "@/components/layout/UniversityFooter";
import ProfileHub from "@/components/profile/ProfileHub";
import ProfileTabs, { type ProfileTab } from "@/components/profile/ProfileTabs";
import EphemeralWarning from "@/components/profile/EphemeralWarning";
import Button from "@/components/ui/Button";

const SkeletonSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
      <p className="text-xs text-muted" role="status" aria-label="Cargando...">
        Cargando...
      </p>
    </div>
  </div>
);

const IdentityScreen = dynamic(() => import("@/components/profile/screens/IdentityScreen"), {
  loading: SkeletonSpinner,
});
const WorldScreen = dynamic(() => import("@/components/profile/screens/WorldScreen"), {
  loading: SkeletonSpinner,
});
const CircleScreen = dynamic(() => import("@/components/profile/screens/CircleScreen"), {
  loading: SkeletonSpinner,
});
const IntelligenceScreen = dynamic(() => import("@/components/profile/screens/IntelligenceScreen"), {
  loading: SkeletonSpinner,
});

interface ProfileClientProps {
  serverProfile: UserProfile | null;
  initialTab: string | null;
  futureDateError?: boolean;
}

const VALID_TABS: ProfileTab[] = ["identity", "world", "circle", "intelligence"];

const NEXT_TAB: Record<ProfileTab, ProfileTab> = {
  identity: "world",
  world: "circle",
  circle: "intelligence",
  intelligence: "identity",
};

const GUIDED_CTA: Record<ProfileTab, { text: string; next: ProfileTab }> = {
  identity: { text: "Ya conocés tu código. Ahora descubrí tu mundo →", next: "world" },
  world: { text: "Ahora mirá con quién resonás →", next: "circle" },
  circle: { text: "Descubrí qué patrones aparecen en vos →", next: "intelligence" },
  intelligence: { text: "Ya conocés tu mapa. Volvé cuando quieras →", next: "identity" },
};

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
  const tabFromUrl = initialTab || searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<ProfileTab | null>(
    VALID_TABS.includes(tabFromUrl as ProfileTab) ? (tabFromUrl as ProfileTab) : null
  );
  const [showEphemeralWarning, setShowEphemeralWarning] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(serverProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    recordVisit();

    // El "?first=1" que agrega /onboarding ya no gatilla una pantalla propia
    // (ver Mi mapa personal / ProfileHub es el destino inmediato); solo se
    // limpia de la URL para no dejarlo colgado.
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
  }, [serverProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Se relee al cambiar de tab (markSeen actualiza localStorage en handleEnter),
  // en vez de parsear el JSON de discovery en cada render.
  const isNewUser = useMemo(() => !loadDiscoveryState().hasCompletedOnboarding, [activeTab]);
  const showGuidedCTA = activeTab && isNewUser && !hasSeenAll();

  const updateUrl = useCallback((tab: ProfileTab | null) => {
    const url = new URL(window.location.href);
    if (tab) {
      url.searchParams.set("tab", tab);
    } else {
      url.searchParams.delete("tab");
      url.searchParams.delete("dob");
    }
    router.replace(url.pathname + url.search, { scroll: false });
  }, [router]);

  const handleEnter = useCallback((tab: ProfileTab) => {
    setActiveTab(tab);
    markSeen(tab);
    updateUrl(tab);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [updateUrl]);

  const handleBackToHub = useCallback(() => {
    setActiveTab(null);
    updateUrl(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [updateUrl]);

  const handleGuidedNext = useCallback(() => {
    if (!activeTab) return;
    handleEnter(NEXT_TAB[activeTab]);
  }, [activeTab, handleEnter]);

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
          <UniversityFooter />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-px bg-ink/10 mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-medium mb-4">Mi mapa personal</p>
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
        <UniversityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        {activeTab && (
          <ProfileTabs active={activeTab} onChange={handleEnter} onBack={handleBackToHub} />
        )}

        {!activeTab && showEphemeralWarning && (
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-4">
            <EphemeralWarning onDismiss={dismissEphemeralWarning} />
          </div>
        )}

        <AnimatePresence mode="wait">
{!activeTab ? (
               <motion.div
                 key="hub"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.2 }}
               >
                 <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
                   <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
                   <span>›</span>
                   <span className="text-foreground font-medium">Mi mapa</span>
                 </nav>
                 <ProfileHub profile={profile} onEnter={handleEnter} />
               </motion.div>
             ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "identity" && <IdentityScreen profile={profile} onNavigate={handleEnter} />}
                {activeTab === "world" && <WorldScreen profile={profile} onNavigate={handleEnter} />}
                {activeTab === "circle" && <CircleScreen profile={profile} onNavigate={handleEnter} />}
                {activeTab === "intelligence" && <IntelligenceScreen profile={profile} onNavigate={handleEnter} />}
              </motion.div>
            )}
          </AnimatePresence>

        {showGuidedCTA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-xl border-t border-ink/10"
          >
            <div className="mx-auto max-w-[600px]">
              <button
                type="button"
                onClick={handleGuidedNext}
                className="w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 text-base bg-accent text-white hover:bg-accent/90 min-h-[52px]"
              >
                {GUIDED_CTA[activeTab].text}
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <UniversityFooter />
    </div>
  );
}
