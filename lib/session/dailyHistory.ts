/**
 * Daily History — Memoria mínima de lo que Molino ya interpretó.
 *
 * Un snapshot por fecha, por perfil. Permite comparar "hoy" con "ayer"
 * y, con el tiempo, reconstruir un recorrido (ver /evolution).
 *
 * Persistido en localStorage. No hay backend ni analytics: es la misma
 * orientación que HoyClient ya calculó, guardada para poder leerla mañana.
 */

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
