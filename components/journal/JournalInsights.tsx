"use client";
import { useL } from "@/lib/i18n/useL";

import { MOOD_CONFIG, type JournalEntry, type JournalMood } from "@/types/journal";
import { computeMoodInsights, type MoodInsightGroup } from "@/lib/utils/journalInsights";

function moodEmojiFor(avgMood: number): string {
  const rounded = Math.round(avgMood) as JournalMood;
  return MOOD_CONFIG[Math.min(5, Math.max(1, rounded)) as JournalMood]?.emoji ?? "";
}

function InsightGroup({ title, groups }: { title: string; groups: MoodInsightGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div className="bg-background p-6">
      <p className="font-display text-xl text-foreground mb-3">{title}</p>
      <div className="divide-y divide-ink/10">
        {groups.slice(0, 4).map((g) => (
          <div key={g.label} className="flex items-center justify-between gap-3 py-2 text-base">
            <span className="text-foreground truncate">{g.label}</span>
            <span className="flex items-center gap-1.5 text-muted tabular-nums shrink-0">
              {moodEmojiFor(g.avgMood)} {g.avgMood.toFixed(1)}
              <span className="text-muted/60">({g.count})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Agregaciones simples sobre entradas reales — sin machine learning, sin
 * predicciones: promedio de mood por tema del día, fase lunar y Año
 * Personal (computeMoodInsights, lib/utils/journalInsights.ts). No
 * requiere ningún campo nuevo en JournalEntry — usa el cycleContext que
 * ya se autocompleta desde Fase 6.
 */
export default function JournalInsights({ entries }: { entries: JournalEntry[] }) {
  const L = useL();
  const insights = computeMoodInsights(entries);
  const hasAnyInsight = insights.byTheme.length > 0 || insights.byMoonPhase.length > 0 || insights.byPersonalYear.length > 0;

  if (!hasAnyInsight) return null;
  const cols = [insights.byTheme, insights.byMoonPhase, insights.byPersonalYear].filter((g) => g.length > 0).length;

  return (
    <div className="border-t-2 border-ink pt-6 pb-10">
      <h3 className="font-display font-normal text-3xl text-foreground mb-6">{L("Lo que se repite", "What repeats")}</h3>
      <div className={`grid grid-cols-1 ${cols === 3 ? "md:grid-cols-3" : cols === 2 ? "md:grid-cols-2" : ""} gap-px bg-ink/15 border border-ink/15`}>
        <InsightGroup title={L("Por tema del día", "By theme of the day")} groups={insights.byTheme} />
        <InsightGroup title={L("Por fase lunar", "By moon phase")} groups={insights.byMoonPhase} />
        <InsightGroup title={L("Por Año Personal", "By Personal Year")} groups={insights.byPersonalYear} />
      </div>
      <p className="text-base text-muted mt-4">{L("Promedios simples sobre tus propias páginas: cuantas más escribas, más se afina.", "Simple averages over your own pages: the more you write, the sharper it gets.")}</p>
    </div>
  );
}
