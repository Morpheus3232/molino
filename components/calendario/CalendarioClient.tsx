"use client";
/* eslint-disable react-hooks/preserve-manual-memoization */

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap, Target, Sparkles } from "lucide-react";
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

// Mapeo de colores por número
const numberColors: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "from-red-500/10", text: "text-red-500", border: "border-red-500/30" },
  2: { bg: "from-orange-500/10", text: "text-orange-500", border: "border-orange-500/30" },
  3: { bg: "from-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/30" },
  4: { bg: "from-green-500/10", text: "text-green-500", border: "border-green-500/30" },
  5: { bg: "from-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/30" },
  6: { bg: "from-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
  7: { bg: "from-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/30" },
  8: { bg: "from-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
  9: { bg: "from-pink-500/10", text: "text-pink-500", border: "border-pink-500/30" },
};

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

  // Calcular stats del mes
  const monthStats = useMemo(() => {
    const numbers: Record<number, number> = {};
    const masters: number[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const content = getCalendarDayContent(toLocalDateKey(date));
      const num = content.number;

      numbers[num] = (numbers[num] || 0) + 1;
      if (content.master) masters.push(day);
    }

    return { numbers, masters };
  }, [daysInMonth, year, month]);

  return (
    <div>
      {/* Encabezado del calendario */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground capitalize mb-2">
            {MONTH_NAMES[month]} {year}
          </h2>
          <p className="text-sm text-muted">
            {daysInMonth} días · {selectedContent?.master ? "Número maestro" : "Energía regular"} de hoy
          </p>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            aria-label="Mes anterior"
            className="w-10 h-10 flex items-center justify-center border border-border rounded-lg text-muted hover:text-foreground hover:border-accent/50 hover:bg-accent/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Mes siguiente"
            className="w-10 h-10 flex items-center justify-center border border-border rounded-lg text-muted hover:text-foreground hover:border-accent/50 hover:bg-accent/5 transition-all"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Estadísticas del mes */}
      {monthStats.masters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20"
        >
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-heading text-sm font-bold text-foreground mb-1">
                Números maestros este mes
              </p>
              <p className="text-xs text-muted mb-2">
                {monthStats.masters.length} día{monthStats.masters.length !== 1 ? "s" : ""} con energía amplificada
              </p>
              <div className="flex flex-wrap gap-2">
                {monthStats.masters.map((day) => {
                  const date = new Date(year, month, day);
                  const content = getCalendarDayContent(toLocalDateKey(date));
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelected(date)}
                      className="text-xs font-mono font-bold px-2.5 py-1 bg-accent text-accent-foreground rounded border border-accent/50 hover:bg-accent/90 transition-colors"
                    >
                      {day} ({content.number})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid del calendario */}
      <div className="mb-12 p-6 rounded-xl border border-border bg-card">
        {/* Header de días */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted font-semibold">
              {d}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg p-px overflow-hidden">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="h-20 sm:h-24 bg-card" />;

            const date = new Date(year, month, day);
            const content = getCalendarDayContent(toLocalDateKey(date));
            const isToday = isSameDay(date, today);
            const isSelected = selected ? isSameDay(date, selected) : false;
            const colors = numberColors[content.number] || numberColors[1];

            return (
              <motion.button
                key={day}
                type="button"
                onClick={() => setSelected(date)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`h-20 sm:h-24 flex flex-col items-center justify-center gap-1 transition-all p-2 bg-card hover:bg-accent/5 ${
                  isSelected ? `bg-gradient-to-br ${colors.bg} border-l-4 ${colors.border}` : ""
                } ${isToday ? "ring-2 ring-accent/50" : ""}`}
              >
                <span className={`text-xs font-mono font-bold ${isToday ? "text-accent font-bold" : "text-muted"}`}>
                  {day}
                </span>

                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold transition-all border ${
                    content.master
                      ? "border-accent text-accent bg-accent/20 scale-110"
                      : `${colors.border} ${colors.text} bg-background border-2`
                  }`}
                >
                  {content.number}
                </div>

                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Panel de detalle del día seleccionado */}
      <AnimatePresence mode="wait">
        {selectedContent && selected && (
          <motion.div
            key={selected.toDateString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-10 rounded-xl border border-border bg-gradient-to-br from-card to-card/50"
          >
            {/* Header del panel */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center font-mono text-2xl font-bold border-2 transition-all ${
                  selectedContent.master
                    ? "border-accent text-accent bg-accent/20"
                    : "border-border text-foreground bg-background"
                }`}
              >
                {selectedContent.number}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-display text-2xl sm:text-3xl tracking-tight text-foreground font-bold">
                    {selectedContent.title}
                  </p>
                  {selectedContent.master && (
                    <Sparkles className="w-5 h-5 text-accent" />
                  )}
                </div>
                <p className="text-sm text-muted">
                  {selected.getDate()} de {MONTH_NAMES[selected.getMonth()]} de {selected.getFullYear()}
                  {selectedContent.master && " · Número maestro"}
                </p>
              </div>
            </div>

            {/* Propósito del día */}
            <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/20 flex items-start gap-3">
              <Target className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-heading text-sm font-bold text-foreground mb-1">Propósito del día</p>
                <p className="text-sm text-accent font-medium">{selectedContent.purpose}</p>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-base text-foreground leading-relaxed mb-6">
              {selectedContent.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedContent.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs uppercase tracking-[0.15em] px-3 py-1.5 border border-border bg-background text-muted hover:border-accent/50 hover:text-accent transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Recomendaciones */}
            {selectedContent.recommendations && selectedContent.recommendations.length > 0 && (
              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-accent" />
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted font-semibold">
                    Recomendado para hoy
                  </p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedContent.recommendations.map((rec) => (
                    <li
                      key={rec}
                      className="text-sm text-foreground px-4 py-3 bg-accent/5 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      ✓ {rec}
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
