// Score color and label utilities
// Single source of truth for score visualization

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-blue-600 bg-blue-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excelente";
  if (score >= 60) return "Buena";
  if (score >= 40) return "Moderada";
  return "Baja";
}

export function getScoreHex(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#3B82F6";
  if (score >= 40) return "#EAB308";
  return "#EF4444";
}


export function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}
