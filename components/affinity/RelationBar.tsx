/**
 * Visual bar for a zodiac relation — length comes directly from
 * RELATION_SCORES (animalRelations.ts), the same fixed score the rest of
 * the affinity system already uses. Not a compatibility percentage: no
 * number is shown, only 10 discrete segments + the relation label.
 */
export default function RelationBar({ score, label }: { score: number; label: string }) {
  const filled = Math.max(0, Math.min(10, Math.round(score / 10)));

  return (
    <div className="flex items-center gap-2" role="img" aria-label={`${label}, nivel de relación ${filled} de 10`}>
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-3 sm:w-2 sm:h-3.5 ${i < filled ? "bg-accent" : "bg-ink/10"}`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-foreground whitespace-nowrap">{label}</span>
    </div>
  );
}
