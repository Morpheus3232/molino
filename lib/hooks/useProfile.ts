"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadProfileFromStorage, clearStoredProfile } from "@/lib/session/localStorage";
import { getSession, clearSession } from "@/lib/session/ephemeral";
import { calculateUserProfile } from "@/lib/engines/compatibilityEngine";
import { decodeProfileData, profileFromShareData } from "@/lib/utils/profileShare";
import type { UserProfile } from "@/types/user";

interface UseProfileOptions {
  redirectTo?: string;
  redirectIfNotFound?: boolean;
  /** Shared profile data from URL ?data= param */
  sharedData?: string | null;
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

function buildProfileFromSharedData(data: ReturnType<typeof decodeProfileData>): UserProfile | null {
  if (!data) return null;
  const shared = profileFromShareData(data);
  if (!shared.name || !shared.birthDate) return null;
  const calculated = calculateUserProfile(shared.name, shared.birthDate);
  return {
    ...calculated,
    ...shared,
    birthPlace: "",
    birthTime: undefined,
    goal: "life",
    interests: [],
    onboardingStep: 4,
    completedSections: ["identity"],
    theme: "light",
    language: "es",
    notifications: true,
    cycles: calculated.cycles || { personalYear: 0, personalMonth: 0, personalDay: 0 },
    recommendations: calculated.recommendations || { strengths: [], challenges: [], practices: [] },
  };
}

export function useProfile(options: UseProfileOptions = {}): UseProfileReturn {
  const { redirectIfNotFound = false, sharedData } = options;
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      // Priority 1: sharedData param (shared profile from URL)
      if (sharedData) {
        const decoded = decodeProfileData(sharedData);
        const sharedProfile = buildProfileFromSharedData(decoded);
        if (sharedProfile) {
          setProfile(sharedProfile);
          setLoading(false);
          return;
        }
      }

      // Priority 2: localStorage
      const stored = loadProfileFromStorage();
      if (stored) {
        setProfile(stored as UserProfile);
        setLoading(false);
        return;
      }

      // Priority 3: ephemeral session
      const existing = getSession();
      if (existing?.name && existing?.birthDate) {
        setProfile(buildProfileFromSession(existing));
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [redirectIfNotFound, sharedData]);

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
