"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import type { DayForecast } from "@/lib/hooks/useDailyEnergy";
import { getScoreLabel } from "@/lib/utils/score";

interface WeekPreviewProps {
  forecast: DayForecast[];
  className?: string;
}

/** Los próximos tres días en una grilla con filetes: fecha grande, número y tema. */
export default function WeekPreview({ forecast, className = "" }: WeekPreviewProps) {
  const L = useL();
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="sr-only">{L("Vista de los Próximos 3 Días", "The Next 3 Days")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
        {forecast.map((f, idx) => (
          <div key={f.date} className="bg-background p-6 sm:p-8 flex flex-col">
            <div className="flex items-baseline justify-between text-base text-muted">
              <span className="capitalize text-foreground">{L.t(idx === 0 ? L("Mañana", "Tomorrow") : f.dayName)}</span>
              <span aria-hidden="true">{L.t(f.moonEmoji)}</span>
            </div>
            <p className="mt-4 font-display text-6xl leading-none text-foreground tabular-nums">{f.dayNumber}</p>
            <p className="mt-4 font-display text-2xl text-foreground">{L.t(f.theme)}</p>
            <p className="mt-1 text-base text-muted">{L(<>Día personal {L.t(f.personalDay)}</>, <>Personal day {L.t(f.personalDay)}</>)}</p>
            <p className="mt-6 pt-4 border-t border-ink/15 text-sm text-muted">{L(<>Energía {L.t(getScoreLabel(f.score).toLowerCase())}</>, <>{L.t(getScoreLabel(f.score).toLowerCase())} energy</>)}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-base">{L(<>
        <Link href="/calendario" className="underline underline-offset-4 hover:no-underline">
          Ver el mes completo
        </Link>
      </>, <><Link href="/calendario" className="underline underline-offset-4 hover:no-underline">See the full month</Link></>)}</p>
    </div>
  );
}
