"use client";

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
  if (!profile.birthDate) return null;
  const yearMeaning = PERSONAL_YEAR_MEANINGS[daily.personalYear];
  if (!yearMeaning) return null;

  return (
    <section className="bg-background border-b border-ink/10">
      <div className={`${CONTAINER} py-16 sm:py-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8">
          <div className="lg:col-span-4">
            <p className="text-sm text-muted mb-3 label-caps">Tu año personal</p>
            <p className="font-display text-[clamp(6rem,14vw,10rem)] leading-[0.8] text-foreground tabular-nums">{daily.personalYear}</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl leading-tight text-foreground">
              Año Personal {daily.personalYear}: {yearMeaning.theme}
            </h2>
          </div>
          <dl className="lg:col-span-8 border-t-2 border-ink divide-y divide-ink/15">
            {[
              ["Enfoque", yearMeaning.focus],
              ["Desafíos", yearMeaning.challenges],
              ["Oportunidades", yearMeaning.opportunities],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-1 py-5">
                <dt className="font-display text-xl text-foreground">{k}</dt>
                <dd className="text-lg text-foreground/85 leading-relaxed">{v}</dd>
              </div>
            ))}
            <div className="py-5">
              <Link href="/blog/numerologia-ano-personal" className="text-base underline underline-offset-4 hover:no-underline">
                Cómo se calcula el Año Personal
              </Link>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
