"use client";

import { motion } from "framer-motion";
import { getScoreLabel, getScoreColor } from "@/lib/utils/score";
import type { TimingResult } from "@/lib/engines/timingEngine";

interface TimingCalendarProps {
  dates: TimingResult[];
  elementColor: string;
  intentionLabel: string;
}

const DAY_NAMES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export default function TimingCalendar({
  dates,
  elementColor,
  intentionLabel,
}: TimingCalendarProps) {
  if (dates.length === 0) return null;

  // Build a map of all dates in range for quick lookup
  const dateMap = new Map(dates.map(d => [d.date, d]));
  
  // Determine the month range from the dates
  const sortedDates = [...dates].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = new Date(sortedDates[0].date + "T12:00:00");
  const lastDate = new Date(sortedDates[sortedDates.length - 1].date + "T12:00:00");
  
  // Start from the first day of the first date's month
  const startMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  // End at the last day of the last date's month
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

  const getDayData = (dateStr: string) => dateMap.get(dateStr);

  // Generate weeks for the calendar
  const weeks: { date: Date; days: (Date | null)[] }[] = [];
  let current = new Date(startMonth);
  current.setDate(current.getDate() - current.getDay()); // Start from Sunday

  while (current <= endMonth) {
    const weekStart = new Date(current);
    const days: (Date | null)[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      if (day >= startMonth && day <= endMonth) {
        days.push(day);
      } else {
        days.push(null);
      }
    }
    weeks.push({ date: weekStart, days });
    current.setDate(current.getDate() + 7);
  }

  // Group themes for legend
  const themeGroups = new Map<string, { color: string; count: number; dates: string[] }>();
  dates.forEach(d => {
    const existing = themeGroups.get(d.theme) || { color: getScoreColor(d.timingScore), count: 0, dates: [] };
    existing.count++;
    existing.dates.push(d.date);
    themeGroups.set(d.theme, existing);
  });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="eyebrow-brutalist mb-2">Calendario de timing — próximos 14 días</p>
          <p className="text-sm text-muted">Para: {intentionLabel}</p>
        </div>
        <span className="text-xs text-muted">
          {MONTH_NAMES[startMonth.getMonth()]} {startMonth.getFullYear()}
          {startMonth.getMonth() !== endMonth.getMonth() &&
            ` – ${MONTH_NAMES[endMonth.getMonth()]} ${endMonth.getFullYear()}`}
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="border border-ink/10 rounded-xl overflow-hidden bg-background">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-ink/10 bg-ink/3">
          {DAY_NAMES.map((day, i) => (
            <div key={i} className="px-2 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="grid grid-cols-7">
          {weeks.map((week, wIdx) => (
            <motion.div
              key={wIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wIdx * 0.05, duration: 0.3 }}
            >
              {week.days.map((day, dIdx) => {
                if (!day) {
                  return <div key={`${wIdx}-${dIdx}`} className="aspect-square bg-ink/2" />;
                }
                
                const dateStr = day.toISOString().split("T")[0];
                const data = getDayData(dateStr);
                const todayFlag = isToday(dateStr);
                const pastFlag = isPast(dateStr);
                const inRangeFlag = isInRange(dateStr);
                
                const isCurrentMonth = day.getMonth() === startMonth.getMonth();
                
                if (!inRangeFlag && !isCurrentMonth) {
                  return (
                    <div
                      key={dateStr}
                      className="relative aspect-square bg-ink/2 text-muted/30"
                    >
                      <span className="absolute bottom-1 right-1 text-[10px]">{day.getDate()}</span>
                    </div>
                  );
                }

                const score = data?.timingScore;
                const theme = data?.theme;
                const color = score ? getScoreColor(score) : "var(--color-muted)";
                const label = score ? getScoreLabel(score) : "";
                
                const bgColor = todayFlag
                  ? "var(--color-accent)"
                  : pastFlag
                  ? "var(--color-ink)/5"
                  : inRangeFlag
                  ? `${color}15`
                  : "transparent";
                  
                const textColor = todayFlag
                  ? "var(--color-accent-foreground)"
                  : pastFlag
                  ? "var(--color-muted)"
                  : inRangeFlag
                  ? color
                  : "var(--color-muted)";

                return (
                  <motion.div
                    key={dateStr}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (wIdx * 7 + dIdx) * 0.015, duration: 0.2 }}
                    className="relative aspect-square group cursor-pointer transition-all"
                    style={{ backgroundColor: bgColor }}
                  >
                    {/* Day number */}
                    <span
                      className={`absolute top-1 right-1 text-[10px] font-mono ${
                        todayFlag ? "text-accent-foreground" : "text-muted"
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {/* Score circle */}
                    {inRangeFlag && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (wIdx * 7 + dIdx) * 0.015 + 0.1, duration: 0.2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{ width: 40, height: 40 }}
                      >
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center border-2 font-mono font-bold text-xs"
                          style={{
                            borderColor: color,
                            color: textColor,
                            backgroundColor: todayFlag ? "transparent" : `${color}10`,
                          }}
                        >
                          {score}
                        </div>
                      </motion.div>
                    )}

                    {/* Today indicator */}
                    {todayFlag && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 border-2 rounded-sm"
                        style={{ borderColor: "var(--color-accent)" }}
                      />
                    )}

                    {/* Hover tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                      style={{
                        backgroundColor: "var(--color-ink)",
                        color: "var(--color-paper)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {inRangeFlag ? (
                        <>
                          <p className="font-medium">{theme}</p>
                          <p className="text-muted/70">{label} · {score}</p>
                        </>
                      ) : (
                        <p className="text-muted">Sin datos de timing</p>
                      )}
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent"
                        style={{ borderTopColor: "var(--color-ink)" }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Theme Legend */}
      {themeGroups.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Temáticas:</span>
          {Array.from(themeGroups.entries()).map(([theme, info], i) => (
            <motion.span
              key={theme}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.04, duration: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${info.color}15`,
                color: info.color,
                border: `1px solid ${info.color}40`,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
              {theme} ({info.count})
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-muted">
          Calculado para tu energía diaria y ciclo personal.{" "}
          <a href="/timing" className="text-accent hover:underline">
            Ver análisis detallado →
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}