import { toLocalDateKey } from "@/lib/session/dailyHistory";
import type { JournalEntry } from "@/types/journal";

/**
 * Racha de días consecutivos con al menos una entrada de Journal escrita
 * por el usuario — distinta de la racha de visitas (useStreak.ts) y de la
 * racha de orientación automática (dailyHistory.ts computeStreak). Solo
 * esta mide hábito real de reflexión. 0 si la racha está cortada (la
 * entrada más reciente no es de hoy ni de ayer).
 */
export function computeJournalStreak(entries: JournalEntry[], today: Date = new Date()): number {
  const dates = Array.from(new Set(entries.map((e) => e.date))).sort((a, b) => (a < b ? 1 : -1));
  if (dates.length === 0) return 0;

  const todayKey = toLocalDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toLocalDateKey(yesterday);

  if (dates[0] !== todayKey && dates[0] !== yesterdayKey) return 0;

  let days = 1;
  let cursor = new Date(`${dates[0]}T00:00:00`);
  for (let i = 1; i < dates.length; i++) {
    const expectedPrev = new Date(cursor);
    expectedPrev.setDate(expectedPrev.getDate() - 1);
    const expectedKey = toLocalDateKey(expectedPrev);
    if (dates[i] !== expectedKey) break;
    days += 1;
    cursor = expectedPrev;
  }
  return days;
}

/** Primera entrada (si hay varias) para una fecha YYYY-MM-DD dada. */
export function findEntryForDate(entries: JournalEntry[], dateKey: string): JournalEntry | undefined {
  return entries.find((e) => e.date === dateKey);
}
