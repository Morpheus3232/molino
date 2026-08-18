import type { JournalEntry } from "@/types/journal";

export interface MoodInsightGroup {
  label: string;
  avgMood: number;
  count: number;
}

export interface MoodInsights {
  byTheme: MoodInsightGroup[];
  byMoonPhase: MoodInsightGroup[];
  byPersonalYear: MoodInsightGroup[];
}

/**
 * Agregaciones simples de mood sobre las entradas reales de Journal —
 * ningún dato nuevo, ninguna predicción: promedio de `entry.mood` agrupado
 * por el `cycleContext` que ya se autocompleta en cada entrada (Fase 6).
 * Un grupo con una sola entrada no es un patrón, es ruido — se descarta
 * (mismo criterio que computeStreak en dailyHistory.ts: "menos de 2 no
 * cuenta"). Grupos ordenados de mayor a menor mood promedio.
 */
export function computeMoodInsights(entries: JournalEntry[]): MoodInsights {
  return {
    byTheme: groupAndAverage(entries, (e) => e.cycleContext?.dayEnergy?.theme),
    byMoonPhase: groupAndAverage(entries, (e) => e.cycleContext?.dayEnergy?.moonPhase),
    byPersonalYear: groupAndAverage(entries, (e) => {
      const year = e.cycleContext?.yearCycle?.personalYear;
      return year !== undefined ? `Año ${year}` : undefined;
    }),
  };
}

function groupAndAverage(
  entries: JournalEntry[],
  keyOf: (entry: JournalEntry) => string | undefined
): MoodInsightGroup[] {
  const sums = new Map<string, { total: number; count: number }>();

  for (const entry of entries) {
    const key = keyOf(entry);
    if (!key) continue;
    const bucket = sums.get(key) ?? { total: 0, count: 0 };
    bucket.total += entry.mood;
    bucket.count += 1;
    sums.set(key, bucket);
  }

  return Array.from(sums.entries())
    .map(([label, { total, count }]) => ({ label, avgMood: total / count, count }))
    .filter((g) => g.count >= 2)
    .sort((a, b) => b.avgMood - a.avgMood);
}
