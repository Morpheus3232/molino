"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { loadProfileFromStorage, saveProfileToStorage } from "@/lib/session/localStorage";
import { getSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import { loadDiscoveryState, markSeen, recordVisit, hasSeenAll } from "@/lib/session/discovery";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import LoadingState from "@/components/ui/LoadingState";
import ProfileHub from "@/components/profile/ProfileHub";
import IdentityScreen from "@/components/profile/screens/IdentityScreen";
import WorldScreen from "@/components/profile/screens/WorldScreen";
import CircleScreen from "@/components/profile/screens/CircleScreen";
import IntelligenceScreen from "@/components/profile/screens/IntelligenceScreen";
import type { ProfileTab } from "@/components/profile/ProfileTabs";
import EphemeralWarning from "@/components/profile/EphemeralWarning";
import DownloadProfileButton from "@/components/profile/DownloadProfileButton";

interface ProfileClientProps {
  serverProfile: UserProfile | null;
  initialTab: string | null;
}

const VALID_TABS: ProfileTab[] = ["identity", "world", "circle", "intelligence"];

const TAB_LABELS: Record<ProfileTab, string> = {
  identity: "Tu Identidad",
  world: "Tu Mundo",
  circle: "Tu Círculo",
  intelligence: "Tu Inteligencia",
};

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

export default function ProfileClient({ serverProfile, initialTab }: ProfileClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = initialTab || searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<ProfileTab | null>(
    VALID_TABS.includes(tabFromUrl as ProfileTab) ? (tabFromUrl as ProfileTab) : null
  );
  const [showEphemeralWarning, setShowEphemeralWarning] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(serverProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    recordVisit();

    if (serverProfile) {
      saveProfileToStorage(serverProfile);
      return;
    }

    if (!profile) {
      const local = buildFromLocal();
      if (local) setProfile(local);
    }
  }, [serverProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const discovery = loadDiscoveryState();
  const isNewUser = !discovery.hasCompletedOnboarding;
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

  if (!mounted && !profile) {
    return <LoadingState message="Cargando tu mapa..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-0.5 bg-accent mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">Mi mapa personal</p>
          <h1 className="font-heading uppercase text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Todavía no creaste tu mapa
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Ingresá tu fecha de nacimiento para generar tu mapa personal de autoconocimiento.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[52px]"
          >
            Crear mi mapa
          </button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main id="main-content">
        {activeTab && (
          <div className="sticky top-0 z-30 bg-background border-b border-accent/10">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 flex items-center gap-4 h-12">
              <button
                type="button"
                onClick={handleBackToHub}
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className="hidden sm:inline">Mi mapa</span>
              </button>
              <span className="text-sm font-medium text-foreground">{TAB_LABELS[activeTab]}</span>
            </div>
          </div>
        )}

        {!activeTab && showEphemeralWarning && (
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-4">
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
              <ProfileHub profile={profile} onEnter={handleEnter} />
              <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-8 pb-24">
                <DownloadProfileButton elementId="profile-hub" filename="mi-mapa-molino" />
              </div>
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
            className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-xl border-t border-border"
          >
            <div className="mx-auto max-w-[600px]">
              <button
                type="button"
                onClick={handleGuidedNext}
                className="w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 text-base bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[52px]"
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
