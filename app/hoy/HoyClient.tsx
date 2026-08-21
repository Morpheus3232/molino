"use client";

import { motion } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { useDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import { useStreak } from "@/lib/hooks/useStreak";
import { useJournal } from "@/lib/hooks/useJournal";
import { computeJournalStreak, findEntryForDate } from "@/lib/utils/journalStreak";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { heroReveal, smoothReveal, staggerApple, staggerItemSmooth } from "@/lib/utils/premiumMotion";
import DailyEnergyCard from "@/components/daily/DailyEnergyCard";
import TodayCalendarNumberCard from "@/components/daily/TodayCalendarNumberCard";
import PersonalCyclesSection from "@/components/daily/PersonalCyclesSection";
import DailyFocus from "@/components/daily/DailyFocus";
import WeekPreview from "@/components/daily/WeekPreview";
import Link from "next/link";
import { TrendingUp, Sparkles, Sun, ShieldCheck } from "lucide-react";

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

  if (!mounted || loading) return null;

  const formattedToday = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dayNumber = new Date().getDate();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24" id="main-content">
        {/* ═══════════════════════════════════════════════
            HERO — Revelación del día
            ═══════════════════════════════════════════════ */}
        <motion.section {...heroReveal} className="mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-ink/10">
            {/* Left: fecha + contexto */}
            <div className="bg-card p-8 lg:p-12">
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <Sun className="w-4 h-4 text-accent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                  Tu día de hoy
                </span>
              </div>

              <div className="mb-4">
                <span className="block text-xs font-mono uppercase tracking-wider text-muted">
                  Día del calendario
                </span>
                <span className="font-display text-4xl sm:text-5xl text-accent leading-none block mt-1">
                  {dayNumber}
                </span>
              </div>
              <p className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-3 capitalize">
                {formattedToday}
              </p>

              <p className="text-sm sm:text-base text-muted mt-5 leading-relaxed">
                No es un día más: cada fecha vibra distinto. Esto es lo que la numerología y
                la astrología leen en tu número del día, tu fase lunar y la energía que te rodea —
                ​​calculado 100% en tu navegador.
              </p>
            </div>

            {/* Right: foco revelador del día */}
            <div className="p-8 lg:p-12 bg-card border border-ink/10 relative overflow-hidden">
              {daily ? (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-4">
                    La señal de hoy
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground mb-4">
                    Día {daily.personalDay} — {daily.theme}
                  </h2>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                    {daily.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-6">
                    {daily.strengths.slice(0, 3).map((s) => (
                      <div key={s} className="p-3 rounded-md bg-accent/5 border border-accent/20">
                        <p className="font-mono text-[9px] uppercase tracking-wider text-muted">A favor</p>
                        <p className="font-heading text-xs font-bold text-accent mt-1">{s}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Calculando tu vibración del día…</span>
                </div>
              )}
            </div>
          </div>
        </motion.section>

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

          {/* 1. Daily Energy Card */}
          {daily && (
            <DailyEnergyCard
              profile={profile}
              daily={daily}
              streakDays={streakDays}
              streakBadge={badge}
            />
          )}

          {/* 1.2 Calendario number */}
          <TodayCalendarNumberCard />

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