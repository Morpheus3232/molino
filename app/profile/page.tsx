"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { useProfile } from "@/lib/hooks/useProfile";
import { loadDiscoveryState, markSeen, recordVisit, isFirstVisit, hasSeenAll } from "@/lib/storage/discovery";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import LoadingState from "@/components/ui/LoadingState";
import ProfileHub from "@/components/profile/ProfileHub";
import IdentityScreen from "@/components/profile/screens/IdentityScreen";
import WorldScreen from "@/components/profile/screens/WorldScreen";
import CircleScreen from "@/components/profile/screens/CircleScreen";
import IntelligenceScreen from "@/components/profile/screens/IntelligenceScreen";
import type { ProfileTab } from "@/components/profile/ProfileTabs";

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

function ProfileContent({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<ProfileTab | null>(
    VALID_TABS.includes(initialTab as ProfileTab) ? (initialTab as ProfileTab) : null
  );

  const discovery = loadDiscoveryState();
  const isNewUser = !discovery.hasCompletedOnboarding;
  const showGuidedCTA = activeTab && isNewUser && !hasSeenAll();

  const updateUrl = useCallback((tab: ProfileTab | null) => {
    const url = new URL(window.location.href);
    if (tab) {
      url.searchParams.set("tab", tab);
    } else {
      url.searchParams.delete("tab");
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
    const next = NEXT_TAB[activeTab];
    handleEnter(next);
  }, [activeTab, handleEnter]);

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main id="main-content">
        {/* Hub back navigation — visible when inside a screen */}
        {activeTab && (
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="mx-auto max-w-[1100px] px-4 sm:px-6 flex items-center gap-4 h-12">
              <button
                type="button"
                onClick={handleBackToHub}
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 rounded-lg"
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

        {/* Hub or Screen */}
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
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "identity" && <IdentityScreen profile={profile} onNavigate={handleEnter} />}
              {activeTab === "world" && <WorldScreen profile={profile} onNavigate={handleEnter} />}
              {activeTab === "circle" && <CircleScreen profile={profile} onNavigate={handleEnter} />}
              {activeTab === "intelligence" && <IntelligenceScreen profile={profile} onNavigate={handleEnter} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guided tour CTA — only for new users */}
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
                 className="w-full inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-4 text-base bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[52px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
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

function ProfilePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const { profile, mounted } = useProfile({ redirectIfNotFound: false, sharedData: dataParam });

  // Record visit on mount
  if (typeof window !== "undefined") {
    recordVisit();
  }

  if (!mounted) {
    return <LoadingState message="Cargando tu perfil..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <div className="w-8 h-2 bg-accent mx-auto mb-8" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-medium mb-4">Mi mapa personal</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Todavía no creaste tu mapa
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Ingresá tu nombre y fecha de nacimiento para generar tu perfil de Inteligencia Personal.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-8 py-4 text-base bg-primary text-primary-foreground shadow-md hover:bg-accent hover:text-accent-foreground min-h-[52px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2"
          >
            Crear mi perfil
          </button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  return <ProfileContent profile={profile} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando tu perfil..." />}>
      <ProfilePageInner />
    </Suspense>
  );
}
