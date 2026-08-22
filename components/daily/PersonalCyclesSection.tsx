"use client";

import Link from "next/link";
import type { UserProfile } from "@/types/user";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { PERSONAL_YEAR_MEANINGS } from "@/lib/engines/dailyEnergyEngine";
import { CalendarRange } from "lucide-react";

interface PersonalCyclesSectionProps {
  profile: UserProfile;
  daily: EnrichedDailyEnergy;
}

/**
 * Año Personal debajo de DailyEnergyCard — el único ciclo que se muestra en
 * /hoy. Mes y Día Personal dejaron de mostrarse acá (2026-08-17): el resto de
 * la tarjeta ya muestra energía universal del día (igual para cualquier
 * visitante, ver calculateUniversalDailyEnergy en dailyEnergyEngine.ts) —
 * mezclar eso con un Mes/Día Personal individual generaba confusión sobre
 * qué dato era de quién. personalMonth/personalDay se siguen calculando y
 * usando en decisionsEngine/timingEngine/journal, no se tocaron — esto es un
 * cambio de qué se muestra en esta card puntual, no del motor.
 *
 * Sin acordeón (2026-08-18): con un solo ciclo para mostrar, el botón
 * "desplegar" era un clic extra sin ninguna función — la info se muestra
 * directa.
 */
export default function PersonalCyclesSection({ profile, daily }: PersonalCyclesSectionProps) {
  if (!profile.birthDate) return null;

  const yearMeaning = PERSONAL_YEAR_MEANINGS[daily.personalYear];
  if (!yearMeaning) return null;

  return (
    <div className="rounded-3xl border border-accent/25 bg-gradient-to-b from-card via-card to-background p-6 sm:p-8 shadow-xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-4">
        Tu año personal
      </p>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-accent shrink-0" aria-hidden="true">
          <CalendarRange className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
            Año Personal {daily.personalYear}
          </span>
          <span className="font-semibold text-sm text-foreground truncate block">{yearMeaning.theme}</span>
        </div>
      </div>
      <div className="text-xs sm:text-sm text-muted leading-relaxed space-y-2">
        <p><span className="text-foreground font-medium">Enfoque: </span>{yearMeaning.focus}</p>
        <p><span className="text-foreground font-medium">Desafíos: </span>{yearMeaning.challenges}</p>
        <p><span className="text-foreground font-medium">Oportunidades: </span>{yearMeaning.opportunities}</p>
      </div>
      <Link
        href="/blog/numerologia-ano-personal"
        className="inline-block mt-4 text-xs font-mono text-accent hover:underline underline-offset-2"
      >
        Cómo se calcula el Año Personal →
      </Link>
    </div>
  );
}
