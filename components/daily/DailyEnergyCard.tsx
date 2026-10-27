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
          { k: L("Tu elemento", "Your element"), v: `${profile.element || "Fuego"} en sintonía` },
          { k: L("Tu arquetipo", "Your archetype"), v: profile.archetype },
        ]
      : []),
  ];

  return (
    <div className={className}>
      <h2 className="section-title text-foreground">{L(<>Energía de {daily.theme}</>, <>Energy of {daily.theme}</>)}</h2>
      <p className="mt-4 text-xl text-foreground/85 leading-relaxed max-w-2xl">{daily.description}</p>

      <dl className={`mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15`}>
        {cells.map((c) => (
          <div key={c.k} className="bg-background p-6">
            <dt className="text-sm text-muted">{c.k}</dt>
            <dd className="mt-1 font-display text-2xl text-foreground leading-tight">{c.v}</dd>
            {c.note && <dd className="mt-2 text-base text-muted leading-snug">{c.note}</dd>}
          </div>
        ))}
      </dl>

      <p className="mt-6 text-base text-muted">{L(<>
        Día {streakDays} conociéndote.
      </>, <>Day {streakDays} getting to know yourself.</>)}</p>
    </div>
  );
}
