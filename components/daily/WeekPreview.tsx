"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { DayForecast } from "@/lib/hooks/useDailyEnergy";
import { CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { getScoreLabel } from "@/lib/utils/score";

interface WeekPreviewProps {
  forecast: DayForecast[];
  className?: string;
}

export default function WeekPreview({ forecast, className = "" }: WeekPreviewProps) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className={`rounded-3xl border border-ink/10 bg-card p-6 sm:p-8 space-y-6 ${className}`}>
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-ink/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
              Vista de los Próximos 3 Días
            </h3>
            <p className="text-xs text-muted">
              Anticipá la energía y el ritmo de los próximos días.
            </p>
          </div>
        </div>

        <Link
          href="/calendario"
          className="hidden sm:inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline"
        >
          <span>Ver mes completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {forecast.map((f, idx) => (
          <div
            key={f.date}
            className="rounded-2xl border border-ink/5 bg-background p-4 sm:p-5 flex flex-col justify-between hover:border-accent/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted font-mono mb-2">
                <span className="capitalize font-bold text-foreground">
                  {idx === 0 ? "Mañana" : f.dayName}
                </span>
                <span>{f.moonEmoji}</span>
              </div>

              <div className="flex items-baseline gap-2 my-1">
                <span className="font-display text-2xl text-foreground font-bold">
                  {f.dayNumber}
                </span>
                <span className="font-mono text-xs text-accent font-semibold">
                  Día {f.personalDay}
                </span>
              </div>

              <h4 className="font-heading text-sm font-bold text-foreground mt-1">
                {f.theme}
              </h4>
            </div>

            <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between text-[11px] font-mono text-muted">
              <span>Energía: {getScoreLabel(f.score)}</span>
              <span className="text-accent">●</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sm:hidden text-center pt-2">
        <Link href="/calendario" className="inline-flex items-center gap-1 font-mono text-xs text-accent">
          <span>Ver calendario mensual completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
