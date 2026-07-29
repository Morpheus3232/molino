/**
 * Discovery Progress — Tracks user's exploration state.
 *
 * Persisted in localStorage. No backend needed.
 * Backward-compatible: existing users get inferred state.
 */

const STORAGE_KEY = "molino.discovery.v1";

export interface DiscoveryState {
  version: 1;
  hasCompletedOnboarding: boolean;
  hasSeenIdentity: boolean;
  hasSeenWorld: boolean;
  hasSeenCircle: boolean;
  hasSeenIntelligence: boolean;
  lastVisitDate: string | null;
  visitCount: number;
}

const DEFAULT_STATE: DiscoveryState = {
  version: 1,
  hasCompletedOnboarding: false,
  hasSeenIdentity: false,
  hasSeenWorld: false,
  hasSeenCircle: false,
  hasSeenIntelligence: false,
  lastVisitDate: null,
  visitCount: 0,
};

/** Load discovery state from localStorage */
export function loadDiscoveryState(): DiscoveryState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return inferFromProfile();
    const parsed = JSON.parse(raw) as DiscoveryState;
    if (parsed.version !== 1) return inferFromProfile();
    return parsed;
  } catch {
    return inferFromProfile();
  }
}

/** Save discovery state to localStorage */
export function saveDiscoveryState(state: DiscoveryState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Error saving discovery state:", err);
  }
}

/** Mark a section as seen */
export function markSeen(section: "identity" | "world" | "circle" | "intelligence"): void {
  const state = loadDiscoveryState();
  const key = `hasSeen${section.charAt(0).toUpperCase() + section.slice(1)}` as keyof DiscoveryState;
  (state as any)[key] = true;
  saveDiscoveryState(state);
}

/** Mark onboarding as completed */
export function markOnboardingCompleted(): void {
  const state = loadDiscoveryState();
  state.hasCompletedOnboarding = true;
  saveDiscoveryState(state);
}

/** Record a visit */
export function recordVisit(): void {
  const state = loadDiscoveryState();
  const today = new Date().toISOString().split("T")[0];
  if (state.lastVisitDate !== today) {
    state.visitCount += 1;
    state.lastVisitDate = today;
    saveDiscoveryState(state);
  }
}

/** Check if this is the first visit */
export function isFirstVisit(): boolean {
  const state = loadDiscoveryState();
  return state.visitCount <= 1 && !state.hasCompletedOnboarding;
}

/** Check if a section has been seen */
export function hasSeen(section: "identity" | "world" | "circle" | "intelligence"): boolean {
  const state = loadDiscoveryState();
  const key = `hasSeen${section.charAt(0).toUpperCase() + section.slice(1)}` as keyof DiscoveryState;
  return (state as any)[key] === true;
}

/** Check if all sections have been seen */
export function hasSeenAll(): boolean {
  const state = loadDiscoveryState();
  return state.hasSeenIdentity && state.hasSeenWorld && state.hasSeenCircle && state.hasSeenIntelligence;
}

/** Infer state from existing profile (backward compatibility) */
function inferFromProfile(): DiscoveryState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem("molino.user-profile.v1");
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (parsed?.profile?.name) {
      // Existing user — assume they've seen everything
      return {
        ...DEFAULT_STATE,
        hasCompletedOnboarding: true,
        hasSeenIdentity: true,
        hasSeenWorld: true,
        hasSeenCircle: true,
        hasSeenIntelligence: true,
        visitCount: 2,
        lastVisitDate: new Date().toISOString().split("T")[0],
      };
    }
  } catch {}
  return DEFAULT_STATE;
}

/** Reset discovery state (for testing) */
export function resetDiscoveryState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
