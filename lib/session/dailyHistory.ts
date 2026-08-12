/**
 * Daily History — Memoria mínima de lo que Molino ya interpretó.
 *
 * Un snapshot por fecha, por perfil. Permite comparar "hoy" con "ayer"
 * y, con el tiempo, reconstruir un recorrido (ver /evolution).
 *
 * Persistido en localStorage. No hay backend ni analytics: es la misma
 * orientación que calculateDailyEnergy/buildOrientation ya calculan,
 * guardada para poder leerla mañana.
 */

import type { UserProfile } from "@/types/user";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";

const STORAGE_KEY = "molino.daily-history.v1";
const MAX_ENTRIES = 90;

export type Orientation = "ACTUAR" | "ESPERAR" | "OBSERVAR";
export type EnergyLevel = "ALTA" | "MEDIA" | "BAJA";

export interface DailySnapshot {
  /** YYYY-MM-DD */
  date: string;
  /** Identifica el perfil dueño del snapshot — birthDate, estable por perfil. */
  profileKey: string;
  orientation: Orientation;
  energyLevel: EnergyLevel;
  theme: string;
  /** Energía numérica 1-100 del día (dailyEnergyEngine). Permite comparar
   *  "hoy" con "ayer" con un delta real en vez de solo el bucket de 3 niveles. */
  overallScore?: number;
  /** Día personal numerológico (1-9/11/22) del día registrado. */
  personalDay?: number;
}

/**
 * Construye un DailySnapshot a partir del perfil y una fecha dada.
 * Mapea el resultado de calculateDailyEnergy a orientation/energyLevel
 * de forma determinista (mismos inputs → mismo output).
 */
export function buildDailySnapshot(profile: UserProfile, date: Date = new Date()): DailySnapshot {
  const daily = calculateDailyEnergy(profile, date);
  return {
    date: toLocalDateKey(date),
    profileKey: profile.birthDate,
    orientation: dayToOrientation(daily.personalDay),
    energyLevel: scoreToLevel(daily.overallScore),
    theme: daily.theme,
    overallScore: daily.overallScore,
    personalDay: daily.personalDay,
  };
}

/** Determinista: mismo día personal → misma orientación. */
function dayToOrientation(personalDay: number): Orientation {
  if ([1, 3, 5, 8, 22].includes(personalDay)) return "ACTUAR";
  if ([2, 4, 6, 33].includes(personalDay)) return "ESPERAR";
  return "OBSERVAR"; // 7, 9, 11, y master numbers no mapeados
}

/** Umbral simple: ≥70 ALTA, 40-69 MEDIA, <40 BAJA. */
function scoreToLevel(score: number): EnergyLevel {
  if (score >= 70) return "ALTA";
  if (score >= 40) return "MEDIA";
  return "BAJA";
}

/**
 * Fecha calendario local en formato YYYY-MM-DD — NO usar toISOString()
 * acá, que convierte a UTC y puede correr la fecha un día en husos
 * horarios negativos (ej. Argentina) cerca de la medianoche.
 */
export function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function loadHistory(): DailySnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DailySnapshot[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: DailySnapshot[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Error saving daily history:", err);
  }
}

/**
 * Registra el snapshot de hoy. Mismo perfil + misma fecha → mismo
 * registro (se sobrescribe, no se duplica).
 */
export function recordDailySnapshot(snapshot: DailySnapshot): void {
  const history = loadHistory();
  const filtered = history.filter(
    (h) => !(h.date === snapshot.date && h.profileKey === snapshot.profileKey)
  );
  const next = [snapshot, ...filtered].slice(0, MAX_ENTRIES);
  saveHistory(next);
}

/** Historial del perfil actual, más reciente primero. */
export function getHistoryForProfile(profileKey: string, limit = 30): DailySnapshot[] {
  return loadHistory()
    .filter((h) => h.profileKey === profileKey)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

/** Snapshot del día anterior a `date` (YYYY-MM-DD), si existe. */
export function getPreviousSnapshot(profileKey: string, date: string): DailySnapshot | null {
  const history = getHistoryForProfile(profileKey, MAX_ENTRIES);
  const before = history.filter((h) => h.date < date);
  return before[0] ?? null;
}

/**
 * Racha de días consecutivos (por fecha calendario, sin huecos) con la misma
 * orientación, contando desde el snapshot más reciente hacia atrás. Devuelve
 * null si hay menos de 2 días consecutivos — una racha de 1 no es un patrón,
 * solo el día de hoy.
 */
export function computeStreak(profileKey: string): { orientation: Orientation; days: number } | null {
  const history = getHistoryForProfile(profileKey, MAX_ENTRIES);
  if (history.length === 0) return null;

  const orientation = history[0].orientation;
  let days = 1;
  let cursor = new Date(`${history[0].date}T00:00:00`);

  for (let i = 1; i < history.length; i++) {
    const expectedPrev = new Date(cursor);
    expectedPrev.setDate(expectedPrev.getDate() - 1);
    const expectedKey = toLocalDateKey(expectedPrev);

    if (history[i].date !== expectedKey || history[i].orientation !== orientation) break;
    days += 1;
    cursor = expectedPrev;
  }

  return days >= 2 ? { orientation, days } : null;
}
