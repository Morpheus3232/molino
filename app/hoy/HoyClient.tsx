"use client";

import { useProfile } from "@/lib/hooks/useProfile";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { useStreak } from "@/lib/hooks/useStreak";
import { useJournal } from "@/lib/hooks/useJournal";
import { computeJournalStreak, findEntryForDate } from "@/lib/utils/journalStreak";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import DailyEnergyCard from "@/components/daily/DailyEnergyCard";
import PersonalCyclesSection from "@/components/daily/PersonalCyclesSection";
import DailyFocus from "@/components/daily/DailyFocus";
import WeekPreview from "@/components/daily/WeekPreview";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function HoyClient() {
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const { streakDays, badge } = useStreak();
  const { entries: journalEntries } = useJournal();
  const todayKey = toLocalDateKey(new Date());
  const todayEntry = findEntryForDate(journalEntries, todayKey);
  const journalStreak = computeJournalStreak(journalEntries);

  // Sin perfil, useDailyEnergy ya devuelve energía universal (misma para
  // cualquier visitante ese día — ver calculateUniversalDailyEnergy en
  // dailyEnergyEngine.ts). No hace falta pedir fecha de nacimiento para
  // mostrar algo con sentido acá.
  const daily = useDailyEnergy(profile);

  // Esperar a que useProfile() resuelva localStorage/sesión — evita un
  // flash de "sin perfil" cuando en realidad sí hay uno guardado.
  if (!mounted || loading) return null;

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 space-y-8">
        <div className="flex items-center gap-2 text-xs">
          {profile ? (
            <span className="font-mono text-xs text-muted">
              Mapa de <strong className="text-foreground">{profile.name || profile.archetype}</strong>
            </span>
          ) : (
            <Link href="/onboarding" className="font-mono text-xs text-accent hover:underline">
              Creá tu mapa para sumar tu Año Personal →
            </Link>
          )}
        </div>

        {/* 1. Daily Energy Card (Score, Theme, Moon, Streak) */}
        {daily && (
          <DailyEnergyCard
            profile={profile}
            daily={daily}
            streakDays={streakDays}
            streakBadge={badge}
          />
        )}

        {/* 1.5 Personal Year — solo con perfil (contenido determinista, no depende de IA ni pago) */}
        {daily?.isPersonalized && profile && <PersonalCyclesSection profile={profile} daily={daily} />}

        {/* 2. Daily Focus vs Avoid, desglose "Favorece hoy" por área & Journal Callout */}
        {daily && (
          <DailyFocus daily={daily} todayEntry={todayEntry} journalStreak={journalStreak} />
        )}

        {/* 3. Week Preview (3-day forecast) */}
        {daily?.nextDaysForecast && <WeekPreview forecast={daily.nextDaysForecast} />}

        {/* 4. Link a la vista de patrones ya construida — sin esto, /evolution
            queda aislada del loop diario */}
        <div className="text-center pt-2">
          <Link
            href="/evolution"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-accent transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Ver tus patrones →
          </Link>
        </div>
      </div>
    </div>
  );
}
