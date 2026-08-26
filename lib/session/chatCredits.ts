/**
 * Gestor de créditos y recargas para las preguntas a Molino.
 *
 * El usuario Premium incluye 50 preguntas iniciales.
 * Al agotarse o quedar pocas (< 5), puede recargar un pack de 28 preguntas adicionales ($1.70 USD).
 * La persistencia vive en localStorage indexada por la fecha de nacimiento y nombre del perfil.
 */

export const INITIAL_PREMIUM_QUESTIONS = 50;
export const RELOAD_PACK_QUESTIONS = 28;
export const RELOAD_PACK_PRICE_USD = 1.70;
export const LOW_CREDITS_THRESHOLD = 5;

export interface ChatCreditsRecord {
  total: number;
  used: number;
  lastReloadedAt?: string;
  reloadsCount?: number;
}

export interface ChatCreditsStatus {
  total: number;
  used: number;
  remaining: number;
  isLow: boolean;
  isExhausted: boolean;
  lastReloadedAt?: string;
}

export function getProfileCreditsKey(birthDate: string, name: string = ""): string {
  const cleanDate = birthDate.trim();
  const cleanName = name.trim().toLowerCase();
  return `molino_chat_credits_v1::${cleanDate}::${cleanName}`;
}

export function getChatCredits(birthDate: string, name: string = ""): ChatCreditsStatus {
  if (typeof window === "undefined" || !birthDate) {
    return {
      total: INITIAL_PREMIUM_QUESTIONS,
      used: 0,
      remaining: INITIAL_PREMIUM_QUESTIONS,
      isLow: false,
      isExhausted: false,
    };
  }

  try {
    const key = getProfileCreditsKey(birthDate, name);
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {
        total: INITIAL_PREMIUM_QUESTIONS,
        used: 0,
        remaining: INITIAL_PREMIUM_QUESTIONS,
        isLow: false,
        isExhausted: false,
      };
    }

    const data = JSON.parse(raw) as Partial<ChatCreditsRecord>;
    const total = typeof data.total === "number" && data.total >= 0 ? data.total : INITIAL_PREMIUM_QUESTIONS;
    const used = typeof data.used === "number" && data.used >= 0 ? data.used : 0;
    const remaining = Math.max(0, total - used);

    return {
      total,
      used,
      remaining,
      isLow: remaining < LOW_CREDITS_THRESHOLD && remaining > 0,
      isExhausted: remaining === 0,
      lastReloadedAt: data.lastReloadedAt,
    };
  } catch {
    return {
      total: INITIAL_PREMIUM_QUESTIONS,
      used: 0,
      remaining: INITIAL_PREMIUM_QUESTIONS,
      isLow: false,
      isExhausted: false,
    };
  }
}

export function spendChatCredit(birthDate: string, name: string = ""): {
  success: boolean;
  status: ChatCreditsStatus;
} {
  if (typeof window === "undefined" || !birthDate) {
    return {
      success: true,
      status: {
        total: INITIAL_PREMIUM_QUESTIONS,
        used: 1,
        remaining: INITIAL_PREMIUM_QUESTIONS - 1,
        isLow: false,
        isExhausted: false,
      },
    };
  }

  const current = getChatCredits(birthDate, name);
  if (current.remaining <= 0) {
    return {
      success: false,
      status: current,
    };
  }

  const newUsed = current.used + 1;
  const newRemaining = Math.max(0, current.total - newUsed);
  const updatedRecord: ChatCreditsRecord = {
    total: current.total,
    used: newUsed,
    lastReloadedAt: current.lastReloadedAt,
  };

  try {
    const key = getProfileCreditsKey(birthDate, name);
    localStorage.setItem(key, JSON.stringify(updatedRecord));
    window.dispatchEvent(new CustomEvent("molino-chat-credits-updated", { detail: { birthDate, name } }));
  } catch {}

  return {
    success: true,
    status: {
      total: current.total,
      used: newUsed,
      remaining: newRemaining,
      isLow: newRemaining < LOW_CREDITS_THRESHOLD && newRemaining > 0,
      isExhausted: newRemaining === 0,
      lastReloadedAt: current.lastReloadedAt,
    },
  };
}

export function addChatCredits(
  birthDate: string,
  name: string = "",
  questionsToAdd: number = RELOAD_PACK_QUESTIONS
): ChatCreditsStatus {
  if (typeof window === "undefined" || !birthDate) {
    return {
      total: INITIAL_PREMIUM_QUESTIONS + questionsToAdd,
      used: 0,
      remaining: INITIAL_PREMIUM_QUESTIONS + questionsToAdd,
      isLow: false,
      isExhausted: false,
    };
  }

  const current = getChatCredits(birthDate, name);
  const newTotal = current.total + questionsToAdd;
  const newRemaining = Math.max(0, newTotal - current.used);
  const timestamp = new Date().toISOString();

  const updatedRecord: ChatCreditsRecord = {
    total: newTotal,
    used: current.used,
    lastReloadedAt: timestamp,
  };

  try {
    const key = getProfileCreditsKey(birthDate, name);
    localStorage.setItem(key, JSON.stringify(updatedRecord));
    window.dispatchEvent(new CustomEvent("molino-chat-credits-updated", { detail: { birthDate, name, reloaded: true } }));
  } catch {}

  return {
    total: newTotal,
    used: current.used,
    remaining: newRemaining,
    isLow: newRemaining < LOW_CREDITS_THRESHOLD && newRemaining > 0,
    isExhausted: newRemaining === 0,
    lastReloadedAt: timestamp,
  };
}

export function resetChatCredits(birthDate: string, name: string = ""): void {
  if (typeof window === "undefined" || !birthDate) return;
  try {
    const key = getProfileCreditsKey(birthDate, name);
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent("molino-chat-credits-updated", { detail: { birthDate, name } }));
  } catch {}
}
