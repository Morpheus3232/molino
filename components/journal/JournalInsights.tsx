"use client";

import { Sparkles } from "lucide-react";
import { MOOD_CONFIG, type JournalEntry, type JournalMood } from "@/types/journal";
import { computeMoodInsights, type MoodInsightGroup } from "@/lib/utils/journalInsights";

function moodEmojiFor(avgMood: number): string {
  const rounded = Math.round(avgMood) as JournalMood;
  return MOOD_CONFIG[Math.min(5, Math.max(1, rounded)) as JournalMood]?.emoji ?? "";
}

function InsightGroup({ title, groups }: { title: string; groups: MoodInsightGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">{title}</p>
      <div className="space-y-1.5">
        {groups.slice(0, 4).map((g) => (
          <div key={g.label} className="flex items-center justify-between gap-3 text-xs">
            <span className="text-foreground truncate">{g.label}</span>
            <span className="flex items-center gap-1.5 text-muted font-mono shrink-0">
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
  const insights = computeMoodInsights(entries);
  const hasAnyInsight = insights.byTheme.length > 0 || insights.byMoonPhase.length > 0 || insights.byPersonalYear.length > 0;

  if (!hasAnyInsight) return null;

  return (
    <div className="rounded-2xl border border-ink/10 bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">Tus patrones de energía</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <InsightGroup title="Por tema del día" groups={insights.byTheme} />
        <InsightGroup title="Por fase lunar" groups={insights.byMoonPhase} />
        <InsightGroup title="Por Año Personal" groups={insights.byPersonalYear} />
      </div>
      <p className="text-[11px] text-muted/70 mt-4 pt-4 border-t border-ink/10">
        Promedios simples sobre tus propias entradas — cuantas más registres, más se afina.
      </p>
    </div>
  );
}
