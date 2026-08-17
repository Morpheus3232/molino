"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/user";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { PERSONAL_YEAR_MEANINGS } from "@/lib/engines/dailyEnergyEngine";
import { ChevronDown, CalendarRange } from "lucide-react";

interface PersonalCyclesSectionProps {
  profile: UserProfile;
  daily: EnrichedDailyEnergy;
}

interface CycleCardProps {
  icon: React.ReactNode;
  label: string;
  number: number;
  theme: string;
  children: React.ReactNode;
}

function CycleCard({ icon, label, number, theme, children }: CycleCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-ink/5 bg-background/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 sm:p-5 text-left hover:bg-background/80 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-expanded={open}
      >
        <span className="text-accent shrink-0" aria-hidden="true">{icon}</span>
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
            {label} {number}
          </span>
          <span className="font-semibold text-sm text-foreground truncate block">{theme}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"} transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-muted leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Año Personal como card colapsable debajo de DailyEnergyCard — el único
 * ciclo que se muestra en /hoy. Mes y Día Personal dejaron de mostrarse acá
 * (2026-08-17): el resto de la tarjeta ya muestra energía universal del día
 * (igual para cualquier visitante, ver calculateUniversalDailyEnergy en
 * dailyEnergyEngine.ts) — mezclar eso con un Mes/Día Personal individual
 * generaba confusión sobre qué dato era de quién. personalMonth/personalDay
 * se siguen calculando y usando en decisionsEngine/timingEngine/journal, no
 * se tocaron — esto es un cambio de qué se muestra en esta card puntual,
 * no del motor.
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
      <CycleCard icon={<CalendarRange className="w-4 h-4" />} label="Año Personal" number={daily.personalYear} theme={yearMeaning.theme}>
        <p><span className="text-foreground font-medium">Enfoque: </span>{yearMeaning.focus}</p>
        <p><span className="text-foreground font-medium">Desafíos: </span>{yearMeaning.challenges}</p>
        <p><span className="text-foreground font-medium">Oportunidades: </span>{yearMeaning.opportunities}</p>
      </CycleCard>
    </div>
  );
}
