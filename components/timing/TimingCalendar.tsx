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
      <p className="text-sm text-muted mb-6">Mejores días para {intentionLabel.toLowerCase()}</p>

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
            >
              {inRange && color ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.25 }}
                  className="flex flex-col items-center justify-center gap-0.5"
                >
                  <span className="text-[9px] font-mono text-muted">{date.getDate()}</span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2"
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

      {/* Theme Legend */}
      <div className="flex flex-wrap items-center gap-2 mt-5">
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