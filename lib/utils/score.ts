// Score color and label utilities
// Single source of truth for score visualization

export function getScoreColor(score: number): string {
  if (score >= 75) return "var(--score-excellent)";
  if (score >= 55) return "var(--score-good)";
  if (score >= 40) return "var(--score-neutral)";
  return "var(--score-poor)";
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return "Excelente";
  if (score >= 55) return "Buena";
  if (score >= 40) return "Moderada";
  return "Baja";
}

export function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}
