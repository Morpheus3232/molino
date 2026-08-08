"use client";

import { motion } from "framer-motion";
import { getScoreColor } from "@/lib/utils/score";
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

function getScoreLabel(score: number): string {
  if (score >= 75) return "Favorable";
  if (score >= 55) return "Bueno";
  if (score >= 40) return "Neutro";
  return "Desafiante";
}

export default function TimingCalendar({
  dates,
  elementColor,
  intentionLabel,
}: TimingCalendarProps) {
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

  return (
    <div>
      <p className="eyebrow-brutalist mb-2">Tu semana en timing</p>
      <p className="text-sm text-muted mb-6">
        Mejores días para {intentionLabel.toLowerCase()}. Los números son el score de timing (0–100).
      </p>

      <div className="grid grid-cols-7">
        {DAY_NAMES.map((day) => (
          <div key={day} className="py-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted border-b border-ink/10">
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
                <span className="text-xs text-muted/30 font-mono">{date.getDate()}</span>
              </div>
            );
          }

          return (
            <div
              key={dateStr}
              className="relative aspect-square flex items-center justify-center"
              title={data ? `${formatDayLabel(dateStr)} — ${data.theme}` : undefined}
            >
              {inRange && color ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.25 }}
                  className="flex flex-col items-center justify-center gap-0.5"
                >
                  <span className="text-xs font-mono text-muted">{date.getDate()}</span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2"
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
                <span className={`text-xs font-mono ${past || isTodayCell ? "text-muted/40" : "text-muted"}`}>
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

      {/* Detalle directo por día — cada fecha con su score, tema y explicación */}
      <div className="mt-6 border-t border-ink/10">
        {sortedDates.map((d, i) => {
          const color = getScoreColor(d.timingScore);
          const isTodayCell = isToday(d.date);
          return (
            <motion.div
              key={d.date}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              className={`flex items-start gap-4 py-4 border-b border-ink/10 ${isTodayCell ? "bg-ink/[0.03]" : ""}`}
            >
              <div className="flex flex-col items-center w-14 shrink-0">
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                  {formatDayLabel(d.date).split(" ")[0]}
                </span>
                <span
                  className="mt-1 w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold border-2"
                  style={{
                    borderColor: color,
                    color: isTodayCell ? "var(--color-background)" : color,
                    backgroundColor: isTodayCell ? color : `${color}12`,
                  }}
                >
                  {d.timingScore}
                </span>
                {isTodayCell && (
                  <span className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-accent">Hoy</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                  <span className="font-heading text-sm font-semibold text-foreground capitalize">
                    {formatDayLabel(d.date)}
                  </span>
                  <span
                    className="text-xs font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 border border-ink/10"
                    style={{ color }}
                  >
                    {d.theme}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted">
                    {getScoreLabel(d.timingScore)}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{d.explanation}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leyenda de escala */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted mr-1">Escala:</span>
        {SCALE_LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-muted">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            {item.min}+ {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
