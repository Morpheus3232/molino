"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import type { StreakBadge } from "@/lib/hooks/useStreak";
import { Sparkles, Moon, Compass, Zap, Flame, Shield, TrendingUp } from "lucide-react";

interface DailyEnergyCardProps {
  profile: UserProfile;
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
  const formattedToday = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div
      className={`rounded-3xl border border-accent/25 bg-gradient-to-b from-card via-card to-background p-6 sm:p-8 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Top Banner: Date + Streak badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted capitalize">
            {formattedToday}
          </span>
        </div>

        {streakDays >= 1 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-xs font-bold">
            <span>{streakBadge?.emoji || "⚡"}</span>
            <span>{streakDays} {streakDays === 1 ? "día conociéndote" : "días seguidos"}</span>
          </div>
        )}
      </div>

      {/* Main Energy Score & Theme Grid */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Left: Overall Score Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center sm:items-start justify-center text-center sm:text-left">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
            Vibración Diaria
          </span>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
              {daily.overallScore}
            </span>
            <span className="font-mono text-sm text-muted">/100</span>
          </div>
          <span className="font-mono text-xs text-muted">
            Día Personal {daily.personalDay} · Año {daily.personalYear}
          </span>
        </div>

        {/* Right: Theme & Description */}
        <div className="sm:col-span-7 p-4 sm:p-5 rounded-2xl bg-background/70 border border-ink/5 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              Energía de {daily.theme}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {daily.description}
          </p>
        </div>
      </div>

      {/* Sub-Pillars Strip: Moon Phase + Element Harmony */}
      <div className="pt-4 border-t border-ink/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        {/* Moon Phase */}
        <div className="p-2.5 rounded-xl bg-background/50 border border-ink/5 flex items-center gap-2.5">
          <span className="text-lg">{daily.moonPhase?.emoji || "🌙"}</span>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
              Fase Lunar
            </span>
            <span className="font-semibold text-foreground truncate block">
              {daily.moonPhase?.phase}
            </span>
          </div>
        </div>

        {/* Elemental Influence */}
        <div className="p-2.5 rounded-xl bg-background/50 border border-ink/5 flex items-center gap-2.5">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
              Elemento
            </span>
            <span className="font-semibold text-foreground truncate block">
              {profile.element || "Fuego"} en sintonía
            </span>
          </div>
        </div>

        {/* Archetype Resonance */}
        <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-background/50 border border-ink/5 flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-accent shrink-0" />
          <div className="min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted block">
              Tu Arquetipo
            </span>
            <span className="font-semibold text-foreground truncate block">
              {profile.archetype}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
