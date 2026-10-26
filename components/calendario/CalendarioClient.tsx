"use client";
/* eslint-disable react-hooks/preserve-manual-memoization */

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarDayContent } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarioClient() {
  // La fecha de hoy recién en el navegador: la página se genera estática y,
  // con new Date() en el render, el HTML quedaba con el día del build (y la
  // hidratación fallaba al día siguiente).
  const [today, setToday] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState<Date | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(now);
  }, []);

  const year = viewDate?.getFullYear() ?? 2026;
  const month = viewDate?.getMonth() ?? 0;
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

  // Calcular stats del mes
  const monthStats = useMemo(() => {
    const numbers: Record<number, number> = {};
    const masters: number[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const content = getCalendarDayContent(toLocalDateKey(date));
      const num = content.number;

      numbers[num] = (numbers[num] || 0) + 1;
      if (content.master || content.abundance) masters.push(day);
    }

    return { numbers, masters };
  }, [daysInMonth, year, month]);

  const special = (c: { master: boolean; abundance: boolean }) => c.master || c.abundance;

  if (!today || !viewDate) {
    return (
      <div className="min-h-[52rem] animate-pulse" aria-hidden="true">
        <div className="h-20 bg-ink/5 w-1/2" />
        <div className="mt-8 h-[36rem] bg-ink/5 lg:w-2/3" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-12 items-start">
      <div className="lg:col-span-8">
        {/* Encabezado del mes */}
        <div className="flex items-end justify-between gap-4 pb-6 border-b-2 border-ink">
          <div>
            <h2 className="font-display font-normal text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-foreground">
              {MONTH_NAMES[month]} {year}
            </h2>
            <p className="mt-2 text-base text-muted">
              {daysInMonth} días · {monthStats.masters.length}{" "}
              {monthStats.masters.length === 1 ? "día especial" : "días especiales"} (maestros y 28)
            </p>
          </div>
          <div className="flex items-center gap-px bg-ink/15 border border-ink/15 shrink-0">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              aria-label="Mes anterior"
              className="w-12 h-12 flex items-center justify-center bg-background text-foreground hover:bg-ink hover:text-paper transition-colors"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              aria-label="Mes siguiente"
              className="w-12 h-12 flex items-center justify-center bg-background text-foreground hover:bg-ink hover:text-paper transition-colors"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* La grilla del mes */}
        <div className="mt-6 grid grid-cols-7">
          {DAY_NAMES.map((d) => (
            <div key={d} className="pb-3 text-center text-sm text-muted">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-ink/15 border border-ink/15">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="aspect-square sm:aspect-auto sm:h-24 bg-paper-alt/60" />;

            const date = new Date(year, month, day);
            const content = getCalendarDayContent(toLocalDateKey(date));
            const isToday = isSameDay(date, today);
            const isSelected = selected ? isSameDay(date, selected) : false;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelected(date)}
                aria-pressed={isSelected}
                aria-label={`${day} de ${MONTH_NAMES[month]}: número ${content.number}${isToday ? ", hoy" : ""}`}
                className={`relative aspect-square sm:aspect-auto sm:h-24 flex flex-col items-center justify-center transition-colors ${
                  isSelected ? "bg-ink text-paper" : "bg-background hover:bg-paper-alt text-foreground"
                }`}
              >
                <span className={`absolute top-1.5 left-2 text-xs sm:text-sm tabular-nums ${isSelected ? "text-paper/70" : "text-muted"}`}>
                  {day}
                </span>
                <span className="font-display text-2xl sm:text-4xl leading-none tabular-nums">{content.number}</span>
                {special(content) && (
                  <span className={`hidden sm:block mt-1 text-[11px] leading-none ${isSelected ? "text-paper/80" : "text-muted"}`}>
                    {content.abundance ? "abundancia" : "maestro"}
                  </span>
                )}
                {isToday && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-vermilion" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted">
          El punto rojo marca hoy. Los maestros (11, 22, 33) y el 28 no se reducen.
        </p>

        {/* Cuántas veces cae cada número este mes */}
        <h3 className="mt-12 font-display text-2xl text-foreground">Cómo se reparte el mes</h3>
        <div className="mt-4 grid grid-cols-9 gap-px bg-ink/15 border border-ink/15">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            const count = monthStats.numbers[n] ?? 0;
            return (
              <div key={n} className="bg-background p-2 sm:p-3 flex flex-col items-center">
                <span className="font-display text-xl sm:text-2xl text-foreground">{n}</span>
                <span className="mt-2 w-full h-16 flex items-end justify-center" aria-hidden="true">
                  <span className="w-3 sm:w-4 bg-ink" style={{ height: `${Math.max(4, (count / Math.max(1, ...Object.values(monthStats.numbers))) * 100)}%` }} />
                </span>
                <span className="mt-1 text-sm text-muted tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>
        {monthStats.masters.length > 0 && (
          <p className="mt-4 text-base text-muted">
            Días especiales:{" "}
            {monthStats.masters.map((day, i) => {
              const date = new Date(year, month, day);
              const content = getCalendarDayContent(toLocalDateKey(date));
              return (
                <span key={day}>
                  {i > 0 && ", "}
                  <button type="button" onClick={() => setSelected(date)} className="text-foreground underline underline-offset-4 hover:no-underline">
                    el {day} ({content.number})
                  </button>
                </span>
              );
            })}
            .
          </p>
        )}
      </div>

      {/* Detalle del día elegido */}
      <aside className="lg:col-span-4 lg:sticky lg:top-24">
        <AnimatePresence mode="wait">
          {selectedContent && selected && (
            <motion.div
              key={selected.toDateString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t-2 border-ink pt-6"
              aria-live="polite"
            >
              <p className="text-sm text-muted label-caps">
                {selected.getDate()} de {MONTH_NAMES[selected.getMonth()].toLowerCase()} de {selected.getFullYear()}
              </p>
              <p className="mt-4 font-display text-[7rem] leading-[0.8] text-foreground tabular-nums">{selectedContent.number}</p>
              <h3 className="mt-4 font-display text-4xl leading-tight text-foreground">{selectedContent.title}</h3>
              {(selectedContent.master || selectedContent.abundance) && (
                <p className="mt-1 text-base text-muted">
                  {selectedContent.master ? "Número maestro" : "Número de la abundancia"}
                </p>
              )}

              <dl className="mt-6 border-t border-ink/15 divide-y divide-ink/15">
                <div className="py-4">
                  <dt className="text-sm text-muted">Propósito del día</dt>
                  <dd className="mt-1 text-lg text-foreground">{selectedContent.purpose}</dd>
                </div>
                <div className="py-4">
                  <dd className="text-lg text-foreground/85 leading-relaxed">{selectedContent.description}</dd>
                </div>
                {selectedContent.recommendations && selectedContent.recommendations.length > 0 && (
                  <div className="py-4">
                    <dt className="text-sm text-muted">Recomendado para ese día</dt>
                    <dd>
                      <ul className="mt-2 space-y-2">
                        {selectedContent.recommendations.map((rec) => (
                          <li key={rec} className="flex items-start gap-3 text-base text-foreground/90 leading-snug">
                            <span className="w-3 h-px bg-ink/50 mt-[0.75em] shrink-0" aria-hidden="true" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                {selectedContent.tags.length > 0 && (
                  <div className="py-4">
                    <dd className="text-base text-muted">{selectedContent.tags.join(" · ").toLowerCase()}</dd>
                  </div>
                )}
              </dl>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
