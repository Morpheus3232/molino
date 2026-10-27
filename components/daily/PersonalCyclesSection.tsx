"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import type { UserProfile } from "@/types/user";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { PERSONAL_YEAR_MEANINGS } from "@/lib/engines/dailyEnergyEngine";
import { CONTAINER } from "@/components/knowledge/Kit";

interface PersonalCyclesSectionProps {
  profile: UserProfile;
  daily: EnrichedDailyEnergy;
}

/**
 * Tu Año Personal, el ciclo largo que enmarca el día. Mes y Día Personal no
 * se detallan acá: el resto de /hoy muestra la energía universal del día y
 * mezclar las dos cosas confundía de quién era cada dato.
 */
export default function PersonalCyclesSection({ profile, daily }: PersonalCyclesSectionProps) {
  const L = useL();
  if (!profile.birthDate) return null;
  const yearMeaning = PERSONAL_YEAR_MEANINGS[daily.personalYear];
  if (!yearMeaning) return null;

  return (
    <section className="bg-background border-b border-ink/10">
      <div className={`${CONTAINER} py-16 sm:py-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8">
          <div className="lg:col-span-4">
            <p className="text-sm text-muted mb-3 label-caps">{L("Tu año personal", "Your personal year")}</p>
            <p className="font-display text-[clamp(6rem,14vw,10rem)] leading-[0.8] text-foreground tabular-nums">{daily.personalYear}</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl leading-tight text-foreground">{L(<>
              Año Personal {daily.personalYear}: {L.t(yearMeaning.theme)}
            </>, <>Personal Year {daily.personalYear}: {L.t(yearMeaning.theme)}</>)}</h2>
          </div>
          <dl className="lg:col-span-8 border-t-2 border-ink divide-y divide-ink/15">
            {[
              [L("Enfoque", "Focus"), yearMeaning.focus],
              [L("Desafíos", "Challenges"), yearMeaning.challenges],
              [L("Oportunidades", "Opportunities"), yearMeaning.opportunities],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-1 py-5">
                <dt className="font-display text-xl text-foreground">{L.t(k)}</dt>
                <dd className="text-lg text-foreground/85 leading-relaxed">{L.t(v)}</dd>
              </div>
            ))}
            <div className="py-5">{L(<>
              <Link href="/blog/numerologia-ano-personal" className="text-base underline underline-offset-4 hover:no-underline">
                Cómo se calcula el Año Personal
              </Link>
            </>, <><Link href="/blog/numerologia-ano-personal" className="text-base underline underline-offset-4 hover:no-underline">How the Personal Year is calculated</Link></>)}</div>
          </dl>
        </div>
      </div>
    </section>
  );
}
