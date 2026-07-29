export interface StoredUserProfile {
  version: 1;
  profile: {
    name: string;
    birthDate: string;
    birthPlace: string;
    birthTime?: string;
    goal: "life" | "love" | "career" | "business" | "growth";
    interests: string[];
    onboardingStep: number;
    completedSections: string[];
    theme: "light" | "dark";
    language: "es" | "en";
    notifications: boolean;
    lifePath: number;
    expressionNumber?: number;
    soulNumber?: number;
    personalityNumber?: number;
    sunSign: string;
    sunSignInfo: {
      sign: string;
      element: string;
      modality: string;
    };
    chineseZodiac: string;
    chineseZodiacInfo: {
      animal: string;
      element: string;
      emoji?: string;
    };
    element: string;
    modality: string;
    archetype: string;
    archetypeInfo: {
      name: string;
      color: string;
      description: string;
      quote: string;
      keywords: string[];
      strengths: string[];
      challenges: string[];
    };
  };
  savedAt: string;
}

const STORAGE_KEY = "molino.user-profile.v1";

export function saveProfileToStorage(data: StoredUserProfile["profile"]): void {
  if (typeof window === "undefined") return;
  const payload: StoredUserProfile = {
    version: 1,
    profile: data,
    savedAt: new Date().toISOString()
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Error saving profile to localStorage:", err);
  }
}

export function loadProfileFromStorage(): StoredUserProfile["profile"] | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredUserProfile;
    if (parsed.version !== 1) return null;
    // Migration: Conejo → Gato (2026-07)
    if (parsed.profile.chineseZodiac === "Conejo") {
      parsed.profile.chineseZodiac = "Gato";
    }
    if (parsed.profile.chineseZodiacInfo?.animal === "Conejo") {
      parsed.profile.chineseZodiacInfo.animal = "Gato";
    }
    return parsed.profile;
  } catch {
    return null;
  }
}

export function clearStoredProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasStoredProfile(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}

export function exportProfileAsJson(): string | null {
  const profile = loadProfileFromStorage();
  if (!profile) return null;
  const payload: StoredUserProfile = {
    version: 1,
    profile,
    savedAt: new Date().toISOString()
  };
  return JSON.stringify(payload, null, 2);
}

export function downloadProfileJson(filename = "molino-perfil.json"): void {
  const json = exportProfileAsJson();
  if (!json) return;
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ════════════════════════════════════════════════════
// AFFINITY SAVES — P4-A: save individual affinity results
// ════════════════════════════════════════════════════

export interface SavedAffinityResult {
  entityId: string;
  entityType: string;
  entityName: string;
  entityEmoji: string;
  birthDate: string;
  userAnimal: string;
  entityAnimal: string;
  score: number;
  tier: string;
  relationship: string;
  savedAt: string;
}

interface StoredAffinitySaves {
  version: 1;
  saves: SavedAffinityResult[];
}

const AFFINITY_SAVES_KEY = "molino.affinity-saves.v1";

export function saveAffinityResult(data: Omit<SavedAffinityResult, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(AFFINITY_SAVES_KEY);
    let existing: SavedAffinityResult[] = [];
    if (raw) {
      const parsed = JSON.parse(raw) as StoredAffinitySaves;
      if (parsed.version === 1) existing = parsed.saves;
    }
    // Dedupe by entityId — update if already exists
    const filtered = existing.filter(s => s.entityId !== data.entityId);
    const entry: SavedAffinityResult = { ...data, savedAt: new Date().toISOString() };
    const payload: StoredAffinitySaves = {
      version: 1,
      saves: [entry, ...filtered].slice(0, 50), // max 50 saves
    };
    window.localStorage.setItem(AFFINITY_SAVES_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Error saving affinity result:", err);
  }
}

export function loadAffinitySaves(): SavedAffinityResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(AFFINITY_SAVES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredAffinitySaves;
    if (parsed.version !== 1) return [];
    return parsed.saves;
  } catch {
    return [];
  }
}

export function hasSavedAffinity(entityId: string): boolean {
  if (typeof window === "undefined") return false;
  return loadAffinitySaves().some(s => s.entityId === entityId);
}
