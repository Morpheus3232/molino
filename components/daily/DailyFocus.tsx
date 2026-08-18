"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { EnrichedDailyEnergy } from "@/lib/hooks/useDailyEnergy";
import type { JournalEntry } from "@/types/journal";
import {
  Target,
  AlertOctagon,
  Compass,
  BookOpen,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface DailyFocusProps {
  daily: EnrichedDailyEnergy;
  /** Entrada de Journal de hoy, si ya existe — cambia el CTA de "Anotar" a "Ver". */
  todayEntry?: JournalEntry;
  /** Racha de journaling (días consecutivos con entrada) — 0 o 1 no se muestra. */
  journalStreak?: number;
  className?: string;
}

export default function DailyFocus({ daily, todayEntry, journalStreak = 0, className = "" }: DailyFocusProps) {
  const journalHref = todayEntry
    ? "/journal"
    : `/journal?prompt=${encodeURIComponent(`Hoy tu mapa destaca ${daily.theme}. ¿Dónde apareció?`)}`;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 2-Card Grid: Focus vs Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Card 1: Focus */}
        <div className="rounded-3xl border border-emerald-500/25 bg-card p-6 sm:p-7 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Tu foco de hoy</span>
          </div>
          <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
            Acción recomendada
          </h4>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {daily.focusAction}
          </p>
        </div>

        {/* Card 2: Avoid */}
        <div className="rounded-3xl border border-rose-500/25 bg-card p-6 sm:p-7 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            <span>Evitá hoy</span>
          </div>
          <h4 className="font-heading text-base sm:text-lg font-bold text-foreground">
            Punto de fricción a posponer
          </h4>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {daily.avoidAction}
          </p>
        </div>
      </div>

      {/* Dynamic Advice & Journal Callout Banner */}
      <div className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Consejo del Momento</span>
          </div>
          <blockquote className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed border-l-2 border-accent pl-3 py-0.5">
            &ldquo;{daily.dailyAdvice}&rdquo;
          </blockquote>
          {journalStreak >= 2 && (
            <p className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              {journalStreak} días escribiendo en tu Journal
            </p>
          )}
        </div>

        {/* Journal CTA */}
        <div className="flex-shrink-0">
          <Link href={journalHref}>
            <Button
              variant="accent"
              size="md"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold px-5 py-3 shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>{todayEntry ? "Ver tu entrada de hoy" : "Anotar en mi Journal"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
