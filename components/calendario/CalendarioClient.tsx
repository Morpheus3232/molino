"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarDayContent } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { fadeUp } from "@/lib/utils/motion";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarioClient() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToMonth = (delta: number) => {
    setViewDate(new Date(year, month + delta, 1));
  };

  const selectedContent = selected ? getCalendarDayContent(toLocalDateKey(selected)) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground capitalize">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            aria-label="Mes anterior"
            className="w-9 h-9 flex items-center justify-center border border-ink/10 text-muted hover:text-foreground hover:border-ink/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Mes siguiente"
            className="w-9 h-9 flex items-center justify-center border border-ink/10 text-muted hover:text-foreground hover:border-ink/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-1.5 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted border-b border-ink/10">
            {d}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="h-14 sm:h-16" />;

          const date = new Date(year, month, day);
          const content = getCalendarDayContent(toLocalDateKey(date));
          const isToday = isSameDay(date, today);
          const isSelected = selected ? isSameDay(date, selected) : false;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelected(date)}
              className={`h-14 sm:h-16 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isSelected ? "bg-accent/10" : "hover:bg-ink/[0.03]"
              }`}
            >
              <span className={`text-xs font-mono leading-none ${isToday ? "text-accent font-semibold" : "text-muted"}`}>
                {day}
              </span>
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold border leading-none ${
                  content.master
                    ? "border-accent text-accent bg-accent/10"
                    : "border-ink/10 text-foreground"
                }`}
              >
                {content.number}
              </span>
              {isToday && <span className="w-1 h-1 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedContent && selected && (
          <motion.div
            key={selected.toDateString()}
            {...fadeUp}
            className="mt-8 border border-ink/10 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border shrink-0 ${
                  selectedContent.master ? "border-accent text-accent bg-accent/10" : "border-ink/10 text-foreground"
                }`}
              >
                {selectedContent.number}
              </span>
              <div>
                <p className="font-display text-xl sm:text-2xl tracking-tight text-foreground">
                  {selectedContent.title}
                </p>
                <p className="text-xs text-muted capitalize">
                  {selected.getDate()} de {MONTH_NAMES[selected.getMonth()].toLowerCase()}
                  {selectedContent.master ? " · Número maestro" : ""}
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-accent mb-3">{selectedContent.purpose}</p>
            <p className="text-base text-foreground leading-relaxed max-w-2xl">{selectedContent.description}</p>

            <div className="flex flex-wrap gap-2 mt-5">
              {selectedContent.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs uppercase tracking-[0.15em] px-2.5 py-1 border border-ink/10 text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {selectedContent.recommendations && selectedContent.recommendations.length > 0 && (
              <div className="mt-6 pt-5 border-t border-ink/10">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted mb-2.5">
                  Recomendado para hoy
                </p>
                <ul className="flex flex-wrap gap-2">
                  {selectedContent.recommendations.map((rec) => (
                    <li
                      key={rec}
                      className="text-sm text-foreground px-3 py-1.5 bg-accent/5 border border-accent/20"
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
