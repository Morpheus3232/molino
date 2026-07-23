"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadProfileFromStorage, clearStoredProfile } from "@/lib/storage/localStorage";
import { getSession, clearSession } from "@/lib/storage/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";

interface UseProfileOptions {
  redirectTo?: string;
  redirectIfNotFound?: boolean;
}

interface UseProfileReturn {
  profile: UserProfile | null;
  mounted: boolean;
  loading: boolean;
  newSession: () => void;
}

function buildProfileFromSession(existing: any): UserProfile {
  const calculated = calculateUserProfile(existing.name, existing.birthDate);
  return {
    ...calculated,
    birthPlace: existing.birthPlace || "",
    birthTime: existing.birthTime,
    goal: (existing.goal as UserProfile["goal"]) || "life",
    interests: existing.interests || [],
    onboardingStep: existing.onboardingStep || 1,
    completedSections: existing.completedSections || ["identity"],
    theme: (existing.theme as UserProfile["theme"]) || "light",
    language: (existing.language as UserProfile["language"]) || "es",
    notifications: existing.notifications ?? true,
    cycles: calculated.cycles || { personalYear: 0, personalMonth: 0, personalDay: 0 },
    recommendations: calculated.recommendations || { strengths: [], challenges: [], practices: [] },
  };
}

export function useProfile(options: UseProfileOptions = {}): UseProfileReturn {
  const { redirectIfNotFound = false } = options;
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = loadProfileFromStorage();
      if (stored) {
        setProfile(stored as UserProfile);
        setLoading(false);
      } else {
        const existing = getSession();
        if (existing?.name && existing?.birthDate) {
          setProfile(buildProfileFromSession(existing));
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [redirectIfNotFound]);

  const newSession = useCallback(() => {
    clearSession();
    clearStoredProfile();
    router.push("/");
  }, [router]);

  return { profile, mounted, loading, newSession };
}

export function getOrCreateProfile(): UserProfile | null {
  const stored = loadProfileFromStorage();
  if (stored) return stored as UserProfile;

  const existing = getSession();
  if (existing?.name && existing?.birthDate) {
    return buildProfileFromSession(existing);
  }

  return null;
}
