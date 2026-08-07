"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/lib/i18n/format";
import { getScoreLabel, getScoreColor } from "@/lib/utils/score";
import type { TimingResult } from "@/lib/engines/timingEngine";

interface BestDatesTimelineProps {
  dates: TimingResult[];
  elementColor: string;
  intentionLabel: string;
  maxVisible?: number;
  compact?: boolean;
}

const DAY_LABELS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export default function BestDatesTimeline({
  dates,
  elementColor,
  intentionLabel,
  maxVisible = 7,
  compact = false,
}: BestDatesTimelineProps) {
  if (dates.length === 0) return null;

  const visibleDates = dates.slice(0, maxVisible);
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

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="overflow-hidden"
      >
        <div className="flex flex-wrap gap-2">
          {visibleDates.map((date, i) => {
            const d = new Date(date.date + "T12:00:00");
            const label = isToday(date.date)
              ? "HOY"
              : DAY_LABELS[d.getDay()] + " " + d.getDate();
            const color = getScoreColor(date.timingScore);

            return (
              <motion.div
                key={date.date}
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={`group flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all ${
                  isToday(date.date)
                    ? "border-accent bg-accent/5"
                    : isPast(date.date)
                    ? "border-ink/5 bg-ink/2 opacity-50"
                    : "border-ink/10 hover:border-accent/30 hover:bg-accent/5"
                }`}
              >
                <span className="text-[10px] uppercase tracking-[0.1em] text-muted">
                  {label}
                </span>
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color }}
                >
                  {date.timingScore}
                </span>
                <span className="text-[9px] uppercase tracking-[0.05em] font-medium" style={{ color }}>
                  {getScoreLabel(date.timingScore)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="overflow-hidden"
    >
      <div className="flex flex-col gap-3">
        {visibleDates.map((date, i) => {
          const d = new Date(date.date + "T12:00:00");
          const dayName = d.toLocaleDateString("es-ES", { weekday: "long" });
          const dayNum = d.getDate();
          const monthName = d.toLocaleDateString("es-ES", { month: "long" });
          const scoreColor = getScoreColor(date.timingScore);
          const isTodayDate = isToday(date.date);
          const isPastDate = isPast(date.date);

          return (
            <motion.div
              key={date.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isTodayDate
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : isPastDate
                  ? "border-ink/5 bg-ink/2 opacity-60"
                  : "border-ink/10 bg-background hover:border-accent/30 hover:bg-accent/3"
              }`}
            >
              {/* Day indicator */}
              <div
                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl ${
                  isTodayDate
                    ? "bg-accent text-accent-foreground"
                    : isPastDate
                    ? "bg-ink/5 text-muted"
                    : "bg-ink/3"
                }`}
              >
                <span className="text-[10px] uppercase tracking-[0.1em] font-medium">
                  {dayName.charAt(0).toUpperCase() + dayName.slice(1, 3)}
                </span>
                <span className="font-display text-2xl font-bold">{dayNum}</span>
                <span className="text-[10px] text-muted/70">{monthName.slice(0, 3)}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium text-foreground">
                    {isTodayDate ? "Hoy" : dayName.charAt(0).toUpperCase() + dayName.slice(1)}
                  </p>
                  {isTodayDate && (
                    <span className="text-[9px] uppercase tracking-[0.1em] font-semibold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                      HOY
                    </span>
                  )}
                  {isPastDate && (
                    <span className="text-[9px] uppercase tracking-[0.1em] text-muted">
                      Pasado
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">{date.theme}</p>
              </div>

              {/* Score & details */}
              <div className="flex flex-col items-end gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-mono font-bold text-xs ${
                    isPastDate ? "border-ink/10 text-muted" : ""
                  }`}
                  style={{
                    borderColor: isPastDate ? "var(--color-muted)" : scoreColor,
                    color: isPastDate ? "var(--color-muted)" : scoreColor,
                  }}
                >
                  {date.timingScore}
                </div>
                <span
                  className="text-[9px] uppercase tracking-[0.05em] font-medium"
                  style={{ color: scoreColor }}
                >
                  {getScoreLabel(date.timingScore)}
                </span>
              </div>

              {/* Hover expand - favorable dimensions */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="absolute left-0 right-0 bottom-0 top-full mt-2 overflow-hidden group-hover:opacity-100 group-hover:visible transition-opacity duration-200"
              >
                <div className="px-4 pb-3 border-t border-ink/10 bg-background/95 backdrop-blur rounded-b-xl">
                  {date.favorableDimensions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {date.favorableDimensions.slice(0, 3).map((dim, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full border"
                          style={{ borderColor: scoreColor + "40", color: scoreColor }}
                        >
                          {dim}
                        </span>
                      ))}
                    </div>
                  )}
                  {date.challengingDimensions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {date.challengingDimensions.slice(0, 2).map((dim, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full border border-muted/30 text-muted"
                        >
                          {dim}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}