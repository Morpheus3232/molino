// Score color and label utilities
// Single source of truth for score visualization. Copy lives in lib/i18n —
// this file only maps a number to a bucket id/CSS token, never to text.

import { t } from "@/lib/i18n";

export function getScoreColor(score: number): string {
  if (score >= 75) return "var(--score-excellent)";
  if (score >= 55) return "var(--score-good)";
  if (score >= 40) return "var(--score-neutral)";
  return "var(--score-poor)";
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return t.scoreLabels.excellent;
  if (score >= 55) return t.scoreLabels.good;
  if (score >= 40) return t.scoreLabels.neutral;
  return t.scoreLabels.poor;
}

export function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}
