"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/lib/utils/score";
import type { TimingResult } from "@/lib/engines/timingEngine";

interface TimingCalendarProps {
  dates: TimingResult[];
  elementColor: string;
  intentionLabel: string;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const SCALE_LEGEND = [
  { min: 75, label: "Favorable", color: "var(--score-excellent)" },
  { min: 55, label: "Bueno", color: "var(--score-good)" },
  { min: 40, label: "Neutro", color: "var(--score-neutral)" },
  { min: 0, label: "Desafiante", color: "var(--score-poor)" },
];

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

export default function TimingCalendar({
  dates,
  elementColor,
  intentionLabel,
}: TimingCalendarProps) {
  const [tooltip, setTooltip] = useState<{ dateStr: string; x: number; y: number } | null>(null);

  if (dates.length === 0) return null;

  const dateMap = new Map(dates.map(d => [d.date, d]));
  const sortedDates = [...dates].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = new Date(sortedDates[0].date + "T12:00:00");
  const lastDate = new Date(sortedDates[sortedDates.length - 1].date + "T12:00:00");

  const startMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  const endMonth = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const isPast = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isInRange = (dateStr: string) => dateMap.has(dateStr);

  // Flatten all days into a single array for grid rendering
  const allDays: { date: Date; dateStr: string; inRange: boolean; data?: TimingResult; today: boolean; past: boolean }[] = [];
  const cursor = new Date(startMonth);
  cursor.setDate(cursor.getDate() - cursor.getDay());

  while (cursor <= endMonth || (cursor.getDay() !== 0)) {
    const dateStr = cursor.toISOString().split("T")[0];
    allDays.push({
      date: new Date(cursor),
      dateStr,
      inRange: isInRange(dateStr),
      data: dateMap.get(dateStr),
      today: isToday(dateStr),
      past: isPast(dateStr),
    });
    cursor.setDate(cursor.getDate() + 1);
    if (cursor > endMonth && cursor.getDay() === 0) break;
  }

  const totalCells = Math.ceil(allDays.length / 7) * 7;
  while (allDays.length < totalCells) {
    allDays.push({
      date: new Date(cursor),
      dateStr: "",
      inRange: false,
      today: false,
      past: true,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const hovered = tooltip ? dateMap.get(tooltip.dateStr) : undefined;

  return (
    <div className="relative">
      <p className="eyebrow-brutalist mb-2">Tu semana en timing</p>
      <p className="text-sm text-muted mb-6">
        Mejores días para {intentionLabel.toLowerCase()}. Los números son el score de timing (0–100).
      </p>

      <div className="grid grid-cols-7">
        {DAY_NAMES.map((day) => (
          <div key={day} className="py-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted border-b border-ink/10">
            {day}
          </div>
        ))}

        {allDays.map((cell, i) => {
          const { date, dateStr, inRange, data, today: isTodayCell, past } = cell;
          const score = data?.timingScore;
          const color = score != null ? getScoreColor(score) : null;
          const isCurrentMonth = date.getMonth() === startMonth.getMonth();
          const isEmpty = !dateStr;

          if (isEmpty) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }

          if (!isCurrentMonth && !inRange) {
            return (
              <div key={dateStr} className="aspect-square flex items-center justify-center">
                <span className="text-[10px] text-muted/30 font-mono">{date.getDate()}</span>
              </div>
            );
          }

          return (
            <div
              key={dateStr}
              className="relative aspect-square flex items-center justify-center"
              onMouseEnter={(e) => {
                if (!data) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({ dateStr, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
              }}
              onMouseLeave={() => setTooltip(null)}
              onFocus={() => {
                if (data) setTooltip({ dateStr, x: 0, y: 0 });
              }}
              onBlur={() => setTooltip(null)}
              tabIndex={data ? 0 : -1}
              aria-label={
                data
                  ? `${formatDayLabel(dateStr)}: score ${data.timingScore} de 100, tema ${data.theme}`
                  : undefined
              }
            >
              {inRange && color ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.25 }}
                  className={`flex flex-col items-center justify-center gap-0.5 ${data ? "cursor-pointer" : ""}`}
                >
                  <span className="text-[9px] font-mono text-muted">{date.getDate()}</span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2 transition-transform duration-150 hover:scale-110"
                    style={{
                      borderColor: color,
                      color: isTodayCell ? "var(--color-background)" : color,
                      backgroundColor: isTodayCell ? color : `${color}12`,
                    }}
                  >
                    {score}
                  </span>
                </motion.div>
              ) : (
                <span className={`text-[10px] font-mono ${past || isTodayCell ? "text-muted/40" : "text-muted"}`}>
                  {date.getDate()}
                </span>
              )}

              {isTodayCell && (
                <div className="absolute inset-0.5 border border-accent/50 rounded pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip con detalle del día */}
      <AnimatePresence>
        {tooltip && hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 w-64 bg-background border border-ink/10 shadow-xl p-4 pointer-events-none hidden sm:block"
            style={{
              left: Math.min(tooltip.x, window.innerWidth - 280),
              top: tooltip.y > window.innerHeight - 260 ? tooltip.y - 220 : tooltip.y + 16,
            }}
          >
            <p className="label-micro text-muted mb-1 capitalize">{formatDayLabel(tooltip.dateStr)}</p>
            <p className="font-heading text-lg font-semibold text-foreground mb-1">
              {getScoreLabel(hovered.timingScore)}
              <span className="text-muted font-normal text-sm"> · {hovered.timingScore}/100</span>
            </p>
            <p className="text-sm text-foreground leading-relaxed">{hovered.explanation}</p>
            {hovered.favorableDimensions.length > 0 && (
              <div className="mt-3">
                <p className="label-micro text-muted mb-1">Favorece</p>
                <div className="flex flex-wrap gap-1">
                  {hovered.favorableDimensions.map((d) => (
                    <span key={d} className="text-[10px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5 border border-ink/10 text-foreground">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {hovered.challengingDimensions.length > 0 && (
              <div className="mt-2">
                <p className="label-micro text-muted mb-1">Observar</p>
                <div className="flex flex-wrap gap-1">
                  {hovered.challengingDimensions.map((d) => (
                    <span key={d} className="text-[10px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5 border border-ink/10 text-muted">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leyenda de escala */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mr-1">Escala:</span>
        {SCALE_LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.1em] text-muted">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            {item.min}+ {item.label}
          </span>
        ))}
      </div>

      {/* Temas presentes */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mr-1">Temas:</span>
        {(() => {
          const groups = new Map<string, { color: string; count: number }>();
          dates.forEach(d => {
            const existing = groups.get(d.theme);
            if (existing) {
              existing.count++;
            } else {
              groups.set(d.theme, { color: getScoreColor(d.timingScore), count: 1 });
            }
          });
          return Array.from(groups.entries()).map(([theme, info]) => (
            <span
              key={theme}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.1em]"
              style={{ color: info.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: info.color }} />
              {theme} ({info.count})
            </span>
          ));
        })()}
      </div>
    </div>
  );
}
