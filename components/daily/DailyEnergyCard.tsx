"use client";

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
  const cells: { k: string; v: string; note?: string }[] = [
    { k: "Fase lunar", v: daily.moonPhase?.phase ?? "—", note: daily.moonPhase?.description },
    ...(daily.isPersonalized
      ? [{ k: "Ciclo en curso", v: `Año Personal ${daily.personalYear}` }]
      : [{ k: "Fortaleza del día", v: daily.strengths?.[0] || "Claridad" }]),
    ...(profile
      ? [
          { k: "Tu elemento", v: `${profile.element || "Fuego"} en sintonía` },
          { k: "Tu arquetipo", v: profile.archetype },
        ]
      : []),
  ];

  return (
    <div className={className}>
      <h2 className="section-title text-foreground">Energía de {daily.theme}</h2>
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

      <p className="mt-6 text-base text-muted">
        Día {streakDays} conociéndote.
      </p>
    </div>
  );
}
