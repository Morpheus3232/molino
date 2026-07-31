import CountUp from "@/components/ui/CountUp";

interface ReadingNumberProps {
  value: number;
  max?: number;
  label: string;
  color: string;
  context?: string;
  size?: "lg" | "xl";
}

/**
 * Shared "number as the graphic" treatment for scores across the product
 * (Timing, Affinity, Intelligence). Replaces gauges/badges/star ratings —
 * purely presentational, no scoring logic lives here.
 */
export default function ReadingNumber({
  value,
  max = 100,
  label,
  color,
  context,
  size = "xl",
}: ReadingNumberProps) {
  const numberSize = size === "xl" ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl";
  const suffixSize = size === "xl" ? "text-3xl" : "text-2xl";

  return (
    <div>
      <p className="label-micro mb-1">{label}</p>
      <p className={`number-display ${numberSize} font-bold tracking-tight`} style={{ color }}>
        <CountUp target={value} />
        <span className={`${suffixSize} text-muted font-sans font-medium`}>/{max}</span>
      </p>
      {context && <p className="text-sm text-muted mt-1">{context}</p>}
    </div>
  );
}
