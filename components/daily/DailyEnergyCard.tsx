"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import type { StreakBadge } from "@/lib/hooks/useStreak";
import { Sparkles, Flame, Share2, ShieldCheck, ArrowRight } from "lucide-react";
import { getScoreLabel, getScoreColor } from "@/lib/utils/score";
import { getCalendarDayContent, getDateNumberBreakdown, formatDateNumberBreakdown } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import Link from "next/link";

interface DailyEnergyCardProps {
  profile: UserProfile | null;
  daily: EnrichedDailyEnergy;
  streakDays?: number;
  streakBadge?: StreakBadge;
  className?: string;
}

export default function DailyEnergyCard({
  profile,
  daily,
  streakDays = 1,
  streakBadge,
  className = "",
}: DailyEnergyCardProps) {
  const todayKey = useMemo(() => toLocalDateKey(new Date()), []);
  const todayNumber = useMemo(() => getCalendarDayContent(todayKey), [todayKey]);
  const breakdown = useMemo(() => getDateNumberBreakdown(todayKey), [todayKey]);

  const formattedToday = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const score = daily.overallScore;
  const scoreLabel = getScoreLabel(score);
  const scoreColor = getScoreColor(score);

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border border-accent/20 bg-card shadow-sm overflow-hidden ${className}`}
    >
      {/* ── 1. Top Bar: Fecha + Racha ───────────────────────────── */}
      <div className="px-6 sm:px-8 py-4 border-b border-border/70 flex flex-wrap items-center justify-between gap-3 bg-background/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted capitalize">
            {formattedToday}
          </span>
        </div>

        {streakDays >= 1 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 font-mono text-xs font-semibold">
            <span>{streakBadge?.emoji || "🌱"}</span>
            <span>{streakDays} {streakDays === 1 ? "día conociéndote" : "días seguidos"}</span>
          </div>
        )}
      </div>

      {/* ── 2. HERO PRINCIPAL: Hoy es día X (Numerología del día) ── */}
      <div className="p-6 sm:p-10 border-b border-border/70 bg-gradient-to-br from-card via-card to-background">
        <div className="flex flex-col md:flex-row md:items-start gap-6 sm:gap-8">
          {/* Número Gigante */}
          <div className="shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-1">
            <div className="text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted font-bold block">
                Hoy es día
              </span>
              <span className="font-display text-6xl sm:text-7xl lg:text-8xl font-black text-accent leading-none block mt-1 tracking-tight">
                {todayNumber.number}
              </span>
            </div>

            {/* Fórmula de reducción */}
            <div className="md:mt-2 pl-4 md:pl-0 border-l md:border-l-0 border-border/80">
              <p className="font-mono text-xs text-muted/90 bg-background/80 px-2.5 py-1 rounded-md border border-border/60 inline-block">
                {formatDateNumberBreakdown(breakdown)}
                {breakdown.isMaster && <span className="ml-1.5 text-accent font-bold">· maestro</span>}
              </p>
            </div>
          </div>

          {/* Arquetipo del día & Explicación */}
          <div className="min-w-0 flex-1 space-y-3 pt-1">
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold px-2 py-0.5 rounded bg-accent/10">
                Arquetipo del día
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {todayNumber.title}
            </h2>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
              {todayNumber.description}
            </p>

            {/* Recomendaciones / Acciones sugeridas */}
            {todayNumber.recommendations && todayNumber.recommendations.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {todayNumber.recommendations.map((rec) => (
                  <span
                    key={rec}
                    className="text-xs text-foreground/90 font-mono px-3 py-1 rounded-lg bg-accent/5 border border-accent/20 inline-flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {rec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Link al calendario completo */}
        <div className="mt-6 pt-4 border-t border-border/40 flex justify-end">
          <Link
            href="/calendario"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors"
          >
            <span>Ver calendario numerológico</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 3. SECCIÓN SECUNDARIA: Vibración & Energía de Manifestación ── */}
      <div className="p-6 sm:p-8 bg-background/50 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Score / Vibración */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-card border border-border/80 flex items-center justify-between lg:flex-col lg:items-start">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted font-bold block">
                Vibración de hoy
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                  {score}
                </span>
                <span className="font-mono text-xs text-muted">/100</span>
              </div>
            </div>
            <div className="text-right lg:text-left lg:mt-2">
              <span
                className="font-heading text-sm font-bold px-2.5 py-1 rounded-full bg-background border border-border inline-block"
                style={{ color: scoreColor }}
              >
                {scoreLabel}
              </span>
              {daily.isPersonalized && (
                <p className="font-mono text-[11px] text-muted mt-1.5">
                  Año Personal {daily.personalYear}
                </p>
              )}
            </div>
          </div>

          {/* Theme & Descripción de la energía */}
          <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-card border border-border/80 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Energía de {daily.theme}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal">
              {daily.description}
            </p>
          </div>
        </div>

        {/* ── 4. Pilares: Fase Lunar, Elemento y Arquetipo Personal ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Fase Lunar */}
          <div className="p-3.5 rounded-xl bg-card border border-border/70 flex items-center gap-3">
            <span className="text-xl">{daily.moonPhase?.emoji || "🌙"}</span>
            <div className="min-w-0">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted font-semibold block">
                Fase Lunar
              </span>
              <span className="font-heading font-semibold text-foreground truncate block text-xs sm:text-sm">
                {daily.moonPhase?.phase}
              </span>
            </div>
          </div>

          {profile ? (
            <>
              {/* Elemento */}
              <div className="p-3.5 rounded-xl bg-card border border-border/70 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted font-semibold block">
                    Elemento
                  </span>
                  <span className="font-heading font-semibold text-foreground truncate block text-xs sm:text-sm">
                    {profile.element || "Fuego"} en sintonía
                  </span>
                </div>
              </div>

              {/* Tu Arquetipo */}
              <div className="p-3.5 rounded-xl bg-card border border-border/70 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted font-semibold block">
                    Tu Arquetipo
                  </span>
                  <span className="font-heading font-semibold text-foreground truncate block text-xs sm:text-sm">
                    {profile.archetype}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-card border border-border/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted font-semibold block">
                  Fortaleza del día
                </span>
                <span className="font-heading font-semibold text-foreground truncate block text-xs sm:text-sm">
                  {daily.strengths?.[0] || "Claridad"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

