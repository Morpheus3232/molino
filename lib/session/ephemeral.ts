export interface EphemeralSession {
  name?: string;
  birthDate: string;
  birthPlace: string;
  birthTime?: string;
  goal?: string;
  interests: string[];
  onboardingStep: number;
  completedSections: string[];
  theme: "light" | "dark";
  language: "es" | "en" | "pt-BR";
  notifications: boolean;
  timestamp: number;
}

let session: EphemeralSession | null = null;

export function saveSession(data: {
  name?: string;
  birthDate: string;
  birthPlace: string;
  birthTime?: string;
  goal?: string;
  interests?: string[];
  onboardingStep?: number;
  completedSections?: string[];
  theme?: "light" | "dark";
  language?: "es" | "en" | "pt-BR";
  notifications?: boolean;
}): void {
  session = {
    name: data.name,
    birthDate: data.birthDate,
    birthPlace: data.birthPlace,
    birthTime: data.birthTime,
    goal: data.goal,
    interests: data.interests ?? [],
    onboardingStep: data.onboardingStep ?? 1,
    completedSections: data.completedSections ?? [],
    theme: data.theme ?? "light",
    language: data.language ?? "es",
    notifications: data.notifications ?? true,
    timestamp: Date.now()
  };
}

export function getSession(): EphemeralSession | null {
  return session;
}

export function updateSession(partial: Partial<EphemeralSession>): void {
  if (!session) return;
  session = { ...session, ...partial };
}

export function clearSession(): void {
  session = null;
}

export function isSessionValid(): boolean {
  if (!session) return false;
  const age = Date.now() - session.timestamp;
  return age < 30 * 60 * 1000;
}

const ONBOARDING_KEY = "molino.onboarding.v1";

interface OnboardingData {
  day: string;
  month: string;
  year: string;
  dateValue: string;
  dateOfBirth?: string;
}

export function saveOnboardingData(data: OnboardingData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
  }
}

export function loadOnboardingData(): OnboardingData | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearOnboardingData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ONBOARDING_KEY);
  }
}
