"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import {
  CALENDARIO_NUMBERS,
  MASTER_DAYS,
  reduceDayNumber,
  reductionSteps,
} from "@/lib/data/calendario-numerologico";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function monthLabel(year: number, monthIndex: number): string {
  return capitalize(
    new Date(year, monthIndex, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" })
  );
}

function fullDateLabel(year: number, monthIndex: number, day: number): string {
  return capitalize(
    new Date(year, monthIndex, day).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={direction === "left" ? "rotate-180" : undefined}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function CalendarioPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day: number) =>
    day === now.getDate() && monthIndex === now.getMonth() && year === now.getFullYear();

  const goPrev = () => {
    setSelectedDay((d) => Math.min(d, daysInMonth));
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const goNext = () => {
    setSelectedDay((d) => Math.min(d, daysInMonth));
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  const goToday = () => {
    setYear(now.getFullYear());
    setMonthIndex(now.getMonth());
    setSelectedDay(now.getDate());
  };

  const selected = reduceDayNumber(selectedDay);
  const selectedInfo = CALENDARIO_NUMBERS[selected];
  const isMaster = MASTER_DAYS.includes(selected);
  const steps = reductionSteps(selectedDay);

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Inicio</Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">Calendario</span>
        </nav>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Calendario</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Calendario numerológico
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            La energía del día, según el número al que se reduce. Sin cuentas, sin servidor: todo se calcula en tu dispositivo.
          </p>
        </motion.section>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          {/* Navegación */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Mes anterior"
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-background text-foreground hover:border-accent/50 transition-colors"
            >
              <Chevron direction="left" />
            </button>

            <div className="flex flex-col items-center gap-2">
              <p className="font-serif text-lg sm:text-2xl font-semibold text-foreground">{monthLabel(year, monthIndex)}</p>
              <button
                type="button"
                onClick={goToday}
                className="text-[11px] uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors"
              >
                Hoy
              </button>
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Mes siguiente"
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-background text-foreground hover:border-accent/50 transition-colors"
            >
              <Chevron direction="right" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
            {WEEKDAYS.map((wd) => (
              <p key={wd} className="text-center text-[10px] sm:text-xs uppercase tracking-[0.15em] text-muted font-medium py-1">
                {wd}
              </p>
            ))}
          </div>

          {/* Grilla de días */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} aria-hidden="true" />;
              }
              const reduced = reduceDayNumber(day);
              const info = CALENDARIO_NUMBERS[reduced];
              const master = MASTER_DAYS.includes(reduced);
              const selected = day === selectedDay;
              const today = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  aria-label={`Día ${day}: ${info.title}`}
                  aria-pressed={selected}
                  className={[
                    "relative flex flex-col items-center justify-center gap-0.5 rounded-xl border px-0.5 py-1.5 sm:py-2.5 min-h-[48px] sm:min-h-[72px] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                    master
                      ? "border-accent/40 bg-accent/[0.08] text-accent"
                      : "border-border bg-background text-foreground hover:border-accent/40",
                    selected
                      ? "ring-2 ring-accent border-accent/60 shadow-glow-accent"
                      : "",
                  ].join(" ")}
                >
                  <span className={`font-serif text-sm sm:text-lg font-semibold leading-none ${today && !selected ? "text-accent" : ""}`}>
                    {day}
                  </span>
                  <span className="w-full text-center text-[8px] sm:text-[10px] leading-tight truncate opacity-80">
                    {reduced} · {info.title}
                  </span>
                  {master && (
                    <span className="absolute top-0.5 right-1 text-[9px] sm:text-[10px] text-accent" aria-hidden="true">✦</span>
                  )}
                  {today && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-4 flex items-center gap-2 text-xs text-muted">
            <span className="inline-block w-3 h-3 rounded border border-accent/40 bg-accent/[0.08]" aria-hidden="true" />
            Número maestro (11, 22, 28, 33): no se reduce
          </div>
        </div>

        {/* Panel del día seleccionado */}
        <motion.section
          key={`${year}-${monthIndex}-${selectedDay}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-6 sm:mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] uppercase tracking-[0.15em] font-medium">
              Día {selected} · {selectedInfo.title}
            </span>
            {isMaster && (
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-accent/40 text-accent text-[11px] uppercase tracking-[0.15em] font-medium">
                ✦ Número maestro
              </span>
            )}
          </div>

          <p className="text-xs text-muted mb-6">
            {fullDateLabel(year, monthIndex, selectedDay)}
            <span className="mx-2" aria-hidden="true">·</span>
            {steps.join(" → ")}
            {isMaster && " (maestro)"}
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">{selectedInfo.title}</h2>

          <p className="text-sm text-foreground leading-relaxed mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium block mb-1">Propósito del día</span>
            {selectedInfo.essence}
          </p>

          <p className="text-sm text-muted leading-relaxed">{selectedInfo.description}</p>

          <div className="flex flex-wrap gap-2 mt-5">
            {selectedInfo.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full border border-border text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-muted leading-relaxed">
          La numerología es un lenguaje simbólico. Molino la usa como una lente de autoconocimiento, no como una métrica objetiva.
          Conocé más en{" "}
          <Link href="/conocimiento/numerologia" className="text-accent hover:text-accent/80 transition-colors">
            /conocimiento/numerologia
          </Link>
          .
        </p>
      </main>

      <UniversityFooter />
    </div>
  );
}
