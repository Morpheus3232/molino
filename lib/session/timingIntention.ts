/**
 * Timing Intention Preference — Tracks the user's last chosen TimingIntention.
 *
 * Persisted in localStorage. No backend needed.
 * Session preference, not identity: intentionally NOT part of UserProfile.
 */

import type { TimingIntention } from "@/lib/engines/timingEngine";

const STORAGE_KEY = "molino.timing-intention.v1";

const VALID_INTENTIONS: TimingIntention[] = [
  "start_project",
  "change_job",
  "launch_something",
  "sign_agreement",
  "make_decision",
  "start_relationship",
  "publish_something",
  "other",
];

interface StoredTimingIntention {
  version: 1;
  intention: TimingIntention;
  savedAt: string;
}

function isValidIntention(value: unknown): value is TimingIntention {
  return typeof value === "string" && (VALID_INTENTIONS as string[]).includes(value);
}

/** Save the user's chosen timing intention. */
export function saveTimingIntention(intention: TimingIntention): void {
  if (typeof window === "undefined") return;
  if (!isValidIntention(intention)) return;
  try {
    const payload: StoredTimingIntention = {
      version: 1,
      intention,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Error saving timing intention:", err);
  }
}

/** Load the user's last chosen timing intention. Returns null if none exists or the value is invalid. */
export function loadTimingIntention(): TimingIntention | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredTimingIntention;
    if (parsed.version !== 1) return null;
    if (!isValidIntention(parsed.intention)) return null;
    return parsed.intention;
  } catch {
    return null;
  }
}

/** Clear the stored timing intention. */
export function clearTimingIntention(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing timing intention:", err);
  }
}
