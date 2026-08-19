import { getScoreLabel } from "@/lib/utils/score";

interface ReadingNumberProps {
  value: number;
  label: string;
  color: string;
  context?: string;
  size?: "lg" | "xl";
}

/**
 * Shared "reading as the graphic" treatment across the product (Timing,
 * Affinity, Intelligence, Decisions). No raw score is ever shown to the
 * user — value only drives color/qualitative label; the label IS the
 * graphic, replacing gauges/badges/star ratings/X-of-100 numbers.
 */
export default function ReadingNumber({
  value,
  label,
  color,
  context,
  size = "xl",
}: ReadingNumberProps) {
  const textSize = size === "xl" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl";

  return (
    <div>
      <p className="label-micro mb-1">{label}</p>
      <p className={`number-display ${textSize} font-bold tracking-tight`} style={{ color }}>
        {context ?? getScoreLabel(value)}
      </p>
    </div>
  );
}
