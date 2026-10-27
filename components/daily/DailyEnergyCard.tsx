"use client";
import { useL } from "@/lib/i18n/useL";

import type { UserProfile } from "@/types/user";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import type { StreakBadge } from "@/lib/hooks/useStreak";

interface DailyEnergyCardProps {
  profile: UserProfile | null;
  daily: EnrichedDailyEnergy;
  streakDays?: number;
  streakBadge?: StreakBadge;
  className?: string;
}

/**
 * La energía del día: el tema en grande, qué significa y los datos que la
 * arman (luna, año personal, elemento) en una grilla con filetes. El número
 * del día y su cuenta viven en la portada de /hoy.
 */
export default function DailyEnergyCard({ profile, daily, streakDays = 1, className = "" }: DailyEnergyCardProps) {
  const L = useL();
  const cells: { k: string; v: string; note?: string }[] = [
    { k: L("Fase lunar", "Moon phase"), v: daily.moonPhase?.phase ?? "—", note: daily.moonPhase?.description },
    ...(daily.isPersonalized
      ? [{ k: L("Ciclo en curso", "Current cycle"), v: L(`Año Personal ${daily.personalYear}`, `Personal Year ${daily.personalYear}`) }]
      : [{ k: L("Fortaleza del día", "Strength of the day"), v: daily.strengths?.[0] || L("Claridad", "Clarity") }]),
    ...(profile
      ? [
          { k: L("Tu elemento", "Your element"), v: L(`${profile.element || "Fuego"} en sintonía`, `${L.t(profile.element || "Fuego")} in tune`) },
          { k: L("Tu arquetipo", "Your archetype"), v: L.t(profile.archetype) },
        ]
      : []),
  ];

  return (
    <div className={className}>
      <h2 className="section-title text-foreground">{L(<>Energía de {L.t(daily.theme)}</>, <>Energy of {L.t(daily.theme)}</>)}</h2>
      <p className="mt-4 text-xl text-foreground/85 leading-relaxed max-w-2xl">{L.t(daily.description)}</p>

      <dl className={`mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15`}>
        {cells.map((c) => (
          <div key={c.k} className="bg-background p-6">
            <dt className="text-sm text-muted">{L.t(c.k)}</dt>
            <dd className="mt-1 font-display text-2xl text-foreground leading-tight">{L.t(c.v)}</dd>
            {c.note && <dd className="mt-2 text-base text-muted leading-snug">{L.t(c.note)}</dd>}
          </div>
        ))}
      </dl>

      <p className="mt-6 text-base text-muted">{L(<>
        Día {L.t(streakDays)} conociéndote.
      </>, <>Day {L.t(streakDays)} getting to know yourself.</>)}</p>
    </div>
  );
}
