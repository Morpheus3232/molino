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
