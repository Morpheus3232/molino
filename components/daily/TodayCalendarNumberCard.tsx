"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { getCalendarDayContent, getDateNumberBreakdown, formatDateNumberBreakdown } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { fadeUp } from "@/lib/utils/motion";
import Link from "next/link";

/**
 * Número del día del calendario numerológico — el mismo dato universal
 * (no depende del perfil) que TodayNumberBanner.tsx muestra en el home,
 * pero en formato card compacto para convivir con el resto de /hoy sin
 * repetir Fase Lunar ni Foco/Evitá, que ya cubren DailyEnergyCard y
 * DailyFocus más arriba en esta misma página.
 */
export default function TodayCalendarNumberCard({ className = "" }: { className?: string }) {
  const todayKey = useMemo(() => toLocalDateKey(new Date()), []);
  const todayNumber = useMemo(() => getCalendarDayContent(todayKey), [todayKey]);
  const breakdown = useMemo(() => getDateNumberBreakdown(todayKey), [todayKey]);

  return (
    <motion.div
      {...fadeUp}
      className={`rounded-3xl border border-ink/10 bg-card p-6 sm:p-8 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-5">
        <div className="shrink-0 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">Hoy es día</p>
          <p className="font-display text-4xl sm:text-5xl leading-none tracking-tight text-accent">
            {todayNumber.number}
          </p>
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <p className="font-mono text-xs text-muted">
            {formatDateNumberBreakdown(breakdown)}
            {breakdown.isMaster && <span className="ml-2 text-accent">· número maestro</span>}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mt-4 mb-1">
            Arquetipo del día
          </p>
          <p className="font-heading text-lg sm:text-xl text-foreground tracking-tight">{todayNumber.title}</p>
          <p className="text-sm text-muted leading-relaxed mt-2">{todayNumber.description}</p>
        </div>
      </div>

      {todayNumber.recommendations && todayNumber.recommendations.length > 0 && (
        <div className="mt-6 pt-5 border-t border-ink/10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2.5">
            Recomendado para hoy
          </p>
          <ul className="flex flex-wrap gap-2">
            {todayNumber.recommendations.map((rec) => (
              <li key={rec} className="text-xs text-foreground px-2.5 py-1 bg-accent/5 border border-accent/20">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-ink/10 text-right">
        <Link href="/calendario" className="font-mono text-[11px] text-muted hover:text-accent transition-colors">
          Ver calendario numerológico →
        </Link>
      </div>
    </motion.div>
  );
}
