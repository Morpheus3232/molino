"use client";

import { motion } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { useStreak } from "@/lib/hooks/useStreak";
import { useJournal } from "@/lib/hooks/useJournal";
import { computeJournalStreak, findEntryForDate } from "@/lib/utils/journalStreak";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { smoothReveal } from "@/lib/utils/premiumMotion";
import DailyEnergyCard from "@/components/daily/DailyEnergyCard";
import PersonalCyclesSection from "@/components/daily/PersonalCyclesSection";
import DailyFocus from "@/components/daily/DailyFocus";
import WeekPreview from "@/components/daily/WeekPreview";
import Link from "next/link";
import { TrendingUp, ShieldCheck } from "lucide-react";

export default function HoyClient() {
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });

  const { streakDays, badge } = useStreak();
  const { entries: journalEntries } = useJournal();
  const todayKey = toLocalDateKey(new Date());
  const todayEntry = findEntryForDate(journalEntries, todayKey);
  const journalStreak = computeJournalStreak(journalEntries);

  // Sin perfil, useDailyEnergy ya devuelve energía universal (misma para
  // cualquier visitante ese día). No hace falta pedir fecha de nacimiento.
  const daily = useDailyEnergy(profile);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
          <p className="sr-only" role="status" aria-live="polite">Cargando tu energía del día...</p>
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-[var(--skeleton)] rounded w-48 mb-6" />
            <div className="h-64 bg-[var(--skeleton)] rounded-3xl border border-border/40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 bg-[var(--skeleton)] rounded-3xl border border-border/40" />
              <div className="h-40 bg-[var(--skeleton)] rounded-3xl border border-border/40" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">


        <div className="space-y-10">
          {/* Profile / Crear mapa callout */}
          <motion.div {...smoothReveal}>
            {profile ? (
              <p className="inline-flex items-center gap-2 text-xs font-mono text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Mapa de <strong className="text-foreground">{profile.name || profile.archetype}</strong> · todo queda en tu navegador
              </p>
            ) : (
              <Link href="/onboarding" className="inline-flex items-center gap-2 font-mono text-xs text-accent hover:underline">
                Creá tu mapa para sumar tu Año Personal →
              </Link>
            )}
          </motion.div>

          {/* 1. Daily Energy Card (Unificado con Día del Calendario Numerológico) */}
          {daily && (
            <DailyEnergyCard
              profile={profile}
              daily={daily}
              streakDays={streakDays}
              streakBadge={badge}
            />
          )}

          {/* 1.5 Personal Year */}
          {daily?.isPersonalized && profile && <PersonalCyclesSection profile={profile} daily={daily} />}

          {/* 2. Daily Focus */}
          {daily && (
            <DailyFocus daily={daily} todayEntry={todayEntry} journalStreak={journalStreak} />
          )}

          {/* 3. Week Preview */}
          {daily?.nextDaysForecast && <WeekPreview forecast={daily.nextDaysForecast} />}

          {/* 4. Evolución */}
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
      </main>
    </div>
  );
}