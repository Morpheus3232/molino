"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/user";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import {
  PERSONAL_YEAR_MEANINGS,
  PERSONAL_MONTH_MEANINGS,
  getPersonalDayMeaning,
} from "@/lib/engines/dailyEnergyEngine";
import { ChevronDown, CalendarDays, CalendarRange, Sun } from "lucide-react";

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
 * Tres ciclos personales (Año/Mes/Día) como cards colapsables debajo de
 * DailyEnergyCard — el número y el tema ya son visibles en la card
 * principal (Día Personal X · Mes Y · Año Z), esto agrega la interpretación
 * completa de cada uno sin saturar la card de arriba. Solo se renderiza si
 * el perfil tiene birthDate (siempre lo tiene si daily existe, ya que
 * useDailyEnergy devuelve null sin perfil) — ver guard en HoyClient.tsx.
 */
export default function PersonalCyclesSection({ profile, daily }: PersonalCyclesSectionProps) {
  if (!profile.birthDate) return null;

  const yearMeaning = PERSONAL_YEAR_MEANINGS[daily.personalYear];
  const monthMeaning = PERSONAL_MONTH_MEANINGS[daily.personalMonth];
  const dayMeaning = getPersonalDayMeaning(daily.personalDay);

  if (!yearMeaning && !monthMeaning && !dayMeaning) return null;

  return (
    <div className="rounded-3xl border border-accent/25 bg-gradient-to-b from-card via-card to-background p-6 sm:p-8 shadow-xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-4">
        Tus ciclos personales
      </p>
      <div className="space-y-3">
        {yearMeaning && (
          <CycleCard icon={<CalendarRange className="w-4 h-4" />} label="Año Personal" number={daily.personalYear} theme={yearMeaning.theme}>
            <p><span className="text-foreground font-medium">Enfoque: </span>{yearMeaning.focus}</p>
            <p><span className="text-foreground font-medium">Desafíos: </span>{yearMeaning.challenges}</p>
            <p><span className="text-foreground font-medium">Oportunidades: </span>{yearMeaning.opportunities}</p>
          </CycleCard>
        )}
        {monthMeaning && (
          <CycleCard icon={<CalendarDays className="w-4 h-4" />} label="Mes Personal" number={daily.personalMonth} theme={monthMeaning.theme}>
            <p><span className="text-foreground font-medium">Energía: </span>{monthMeaning.energy}</p>
            <p><span className="text-foreground font-medium">Consejo: </span>{monthMeaning.advice}</p>
          </CycleCard>
        )}
        {dayMeaning && (
          <CycleCard icon={<Sun className="w-4 h-4" />} label="Día Personal" number={daily.personalDay} theme={dayMeaning.theme}>
            <p>{dayMeaning.description}</p>
            <p><span className="text-foreground font-medium">Fortalezas: </span>{dayMeaning.strengths.join(", ")}</p>
            <p><span className="text-foreground font-medium">Cuidado con: </span>{dayMeaning.cautions.join(", ")}</p>
          </CycleCard>
        )}
      </div>
    </div>
  );
}
