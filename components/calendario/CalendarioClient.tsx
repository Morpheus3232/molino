"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";
/* eslint-disable react-hooks/preserve-manual-memoization */

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarDayContent } from "@/lib/numerology/calendar";
import { toLocalDateKey } from "@/lib/session/dailyHistory";

const DAY_NAMES = (L: Pick2) => ([L("Dom", "Sun"), L("Lun", "Mon"), L("Mar", "Tue"), L("Mié", "Wed"), L("Jue", "Thu"), L("Vie", "Fri"), L("Sáb", "Sat")]);
const MONTH_NAMES = (L: Pick2) => ([
  L("Enero", "January"), L("Febrero", "February"), L("Marzo", "March"), L("Abril", "April"), L("Mayo", "May"), L("Junio", "June"),
  L("Julio", "July"), L("Agosto", "August"), L("Septiembre", "September"), L("Octubre", "October"), L("Noviembre", "November"), L("Diciembre", "December"),
]);

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarioClient() {
  const L = useL();
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
    const masters: number[] = [];
    // Los días del mes agrupados por número: "para qué sirve cada día".
    const groups = new Map<number, { number: number; title: string; purpose: string; special: boolean; days: number[] }>();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const content = getCalendarDayContent(toLocalDateKey(date));
      if (content.master || content.abundance) masters.push(day);
      const g = groups.get(content.number);
      if (g) g.days.push(day);
      else
        groups.set(content.number, {
          number: content.number,
          title: content.title,
          purpose: content.purpose,
          special: content.master || content.abundance,
          days: [day],
        });
    }

    return { masters, groups: [...groups.values()].sort((a, b) => a.number - b.number) };
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
              {L.t(MONTH_NAMES(L)[month])} {year}
            </h2>
            <p className="mt-2 text-base text-muted">{L(<>
              {L.t(daysInMonth)} días · {monthStats.masters.length}{" "}
              {monthStats.masters.length === 1 ? "día especial" : "días especiales"} (maestros y 28)
            </>, <>{L.t(daysInMonth)} days · {monthStats.masters.length}{" "}{monthStats.masters.length === 1 ? "special day" : "special days"} (masters and 28)</>)}</p>
          </div>
          <div className="flex items-center gap-px bg-ink/15 border border-ink/15 shrink-0">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              aria-label={L("Mes anterior", "Previous month")}
              className="w-12 h-12 flex items-center justify-center bg-background text-foreground hover:bg-ink hover:text-paper transition-colors"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToMonth(1)}
              aria-label={L("Mes siguiente", "Next month")}
              className="w-12 h-12 flex items-center justify-center bg-background text-foreground hover:bg-ink hover:text-paper transition-colors"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* La grilla del mes */}
        <div className="mt-6 grid grid-cols-7">
          {DAY_NAMES(L).map((d) => (
            <div key={d} className="pb-3 text-center text-sm text-muted">
              {L.t(d)}
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
                aria-label={L(`${day} de ${MONTH_NAMES(L)[month]}: número ${content.number}${isToday ? ", hoy" : ""}`, `${MONTH_NAMES(L)[month]} ${day}: number ${content.number}${isToday ? ", today" : ""}`)}
                className={`relative aspect-square sm:aspect-auto sm:h-24 flex flex-col items-center justify-center transition-colors ${
                  isSelected ? "bg-ink text-paper" : "bg-background hover:bg-paper-alt text-foreground"
                }`}
              >
                <span className={`absolute top-1.5 left-2 text-xs sm:text-sm tabular-nums ${isSelected ? "text-paper/70" : "text-muted"}`}>
                  {L.t(day)}
                </span>
                <span className="font-display text-2xl sm:text-4xl leading-none tabular-nums">{content.number}</span>
                {special(content) && (
                  <span className={`hidden sm:block mt-1 text-[11px] leading-none ${isSelected ? "text-paper/80" : "text-muted"}`}>
                    {L.t(content.abundance ? "abundancia" : "maestro")}
                  </span>
                )}
                {isToday && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-vermilion" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted">{L("El punto rojo marca hoy. Los maestros (11, 22, 33) y el 28 no se reducen.", "The red dot marks today. The master numbers (11, 22, 33) and 28 are not reduced.")}</p>

        {/* Para qué sirve cada día del mes: el número, qué propone y en qué fechas cae */}
        <h3 className="mt-14 section-title text-foreground">{L("Qué día conviene para qué", "Which day suits what")}</h3>
        <p className="mt-2 text-lg text-muted max-w-2xl">{L("Los días del mes agrupados por su número. Tocá una fecha para ver el detalle.", "The days of the month grouped by their number. Tap a date to see the detail.")}</p>
        <ul className="mt-6 border-t-2 border-ink">
          {monthStats.groups.map((g) => {
            const hasToday = today.getFullYear() === year && today.getMonth() === month && g.days.includes(today.getDate());
            return (
              <li key={g.number} className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] gap-x-5 gap-y-3 py-5 border-b border-ink/15 items-center">
                <span className="font-display text-4xl sm:text-5xl leading-none text-foreground tabular-nums">{g.number}</span>
                <div className="min-w-0">
                  <p className="font-display text-xl sm:text-2xl leading-tight text-foreground">
                    {L.t(g.title)}
                    {g.special && <span className="ml-2 text-base text-muted">{g.number === 28 ? "abundancia" : "maestro"}</span>}
                    {hasToday && <span className="ml-2 text-base text-vermilion">{L("· hoy", "· today")}</span>}
                  </p>
                  <p className="mt-0.5 text-base text-muted leading-snug">{L.t(g.purpose)}</p>
                </div>
                <div className="col-start-2 sm:col-start-auto flex flex-wrap gap-1.5 sm:justify-end">
                  {g.days.map((day) => {
                    const date = new Date(year, month, day);
                    const isSel = selected ? isSameDay(date, selected) : false;
                    const isToday = isSameDay(date, today);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setSelected(date);
                          // En móvil el detalle queda debajo: lo traemos a la vista.
                          if (window.matchMedia("(max-width: 1023px)").matches) {
                            requestAnimationFrame(() => document.getElementById("calendario-detalle")?.scrollIntoView({ behavior: "smooth", block: "start" }));
                          }
                        }}
                        aria-pressed={isSel}
                        aria-label={L(`${day} de ${MONTH_NAMES(L)[month]}`, `${MONTH_NAMES(L)[month]} ${day}`)}
                        className={`relative w-11 h-11 text-base tabular-nums border transition-colors ${
                          isSel ? "bg-ink text-paper border-ink" : "bg-background text-foreground border-ink/25 hover:border-ink"
                        }`}
                      >
                        {L.t(day)}
                        {isToday && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vermilion" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detalle del día elegido */}
      <aside id="calendario-detalle" className="lg:col-span-4 lg:sticky lg:top-24 scroll-mt-20">
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
                {L.t(selected.getDate())} de {L.t(MONTH_NAMES(L)[selected.getMonth()].toLowerCase())} de {selected.getFullYear()}
              </p>
              <p className="mt-4 font-display text-[7rem] leading-[0.8] text-foreground tabular-nums">{selectedContent.number}</p>
              <h3 className="mt-4 font-display text-4xl leading-tight text-foreground">{L.t(selectedContent.title)}</h3>
              {(selectedContent.master || selectedContent.abundance) && (
                <p className="mt-1 text-base text-muted">
                  {selectedContent.master ? L("Número maestro", "Master number") : L("Número de la abundancia", "Number of abundance")}
                </p>
              )}

              <dl className="mt-6 border-t border-ink/15 divide-y divide-ink/15">
                <div className="py-4">
                  <dt className="text-sm text-muted">{L("Propósito del día", "Purpose of the day")}</dt>
                  <dd className="mt-1 text-lg text-foreground">{L.t(selectedContent.purpose)}</dd>
                </div>
                <div className="py-4">
                  <dd className="text-lg text-foreground/85 leading-relaxed">{L.t(selectedContent.description)}</dd>
                </div>
                {selectedContent.recommendations && selectedContent.recommendations.length > 0 && (
                  <div className="py-4">
                    <dt className="text-sm text-muted">{L("Recomendado para ese día", "Recommended for that day")}</dt>
                    <dd>
                      <ul className="mt-2 space-y-2">
                        {selectedContent.recommendations.map((rec) => (
                          <li key={rec} className="flex items-start gap-3 text-base text-foreground/90 leading-snug">
                            <span className="w-3 h-px bg-ink/50 mt-[0.75em] shrink-0" aria-hidden="true" />
                            {L.t(rec)}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                {selectedContent.tags.length > 0 && (
                  <div className="py-4">
                    <dd className="text-base text-muted">{L.t(selectedContent.tags.map(L.t).join(" · ").toLowerCase())}</dd>
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
