"use client";

import { useRef, useState, useCallback, useId } from "react";

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

/**
 * Fast date input: DD / MM / YYYY
 * - Writes left-to-right, auto-advances on completion
 * - Backspace steps back between fields
 * - Validates ranges in real time
 */
export default function DateInput({ value, onChange }: DateInputProps) {
  const id = useId();
  // Parse initial value
  const initial = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value.split("-")
    : ["", "", ""];

  const [dd, setDd] = useState(initial[2] === "00" ? "" : initial[2]);
  const [mm, setMm] = useState(initial[1] === "00" ? "" : initial[1]);
  const [yyyy, setYyyy] = useState(initial[0] === "0000" ? "" : initial[0]);

  const ddRef = useRef<HTMLInputElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const yyyyRef = useRef<HTMLInputElement>(null);

  const emit = useCallback(
    (d: string, m: string, y: string) => {
      const pd = d.padStart(2, "0");
      const pm = m.padStart(2, "0");
      const py = y.padStart(4, "0");
      if (d.length === 2 && m.length === 2 && y.length === 4) {
        onChange(`${py}-${pm}-${pd}`);
      }
    },
    [onChange]
  );

  // ── DAY ──────────────────────────────────────────────────────────────────────
  const handleDdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
      setDd(raw);
      if (raw.length === 2) {
        const n = clamp(parseInt(raw), 1, 31);
        const fixed = String(n).padStart(2, "0");
        setDd(fixed);
        emit(fixed, mm, yyyy);
        mmRef.current?.focus();
        mmRef.current?.select();
      }
    },
    [mm, yyyy, emit]
  );

  const handleDdKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowRight" && (e.currentTarget.selectionStart ?? 0) >= dd.length) {
        e.preventDefault();
        mmRef.current?.focus();
        mmRef.current?.select();
      }
    },
    [dd]
  );

  // ── MONTH ─────────────────────────────────────────────────────────────────────
  const handleMmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
      setMm(raw);
      if (raw.length === 2) {
        const n = clamp(parseInt(raw), 1, 12);
        const fixed = String(n).padStart(2, "0");
        setMm(fixed);
        // Clamp day if necessary
        if (yyyy.length === 4 && dd.length === 2) {
          const maxD = daysInMonth(n, parseInt(yyyy));
          const clampedD = String(clamp(parseInt(dd), 1, maxD)).padStart(2, "0");
          setDd(clampedD);
          emit(clampedD, fixed, yyyy);
        } else {
          emit(dd, fixed, yyyy);
        }
        yyyyRef.current?.focus();
        yyyyRef.current?.select();
      }
    },
    [dd, yyyy, emit]
  );

  const handleMmKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && mm === "") {
        e.preventDefault();
        ddRef.current?.focus();
        ddRef.current?.select();
      }
      if (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
        e.preventDefault();
        ddRef.current?.focus();
        ddRef.current?.select();
      }
      if (e.key === "ArrowRight" && (e.currentTarget.selectionStart ?? 0) >= mm.length) {
        e.preventDefault();
        yyyyRef.current?.focus();
        yyyyRef.current?.select();
      }
    },
    [mm]
  );

  // ── YEAR ─────────────────────────────────────────────────────────────────────
  const handleYyyyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
      setYyyy(raw);
      if (raw.length === 4) {
        const y = parseInt(raw);
        const currentYear = new Date().getFullYear();
        if (y >= 1900 && y <= currentYear) {
          emit(dd, mm, raw);
        }
      }
    },
    [dd, mm, emit]
  );

  const handleYyyyKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && yyyy === "") {
        e.preventDefault();
        mmRef.current?.focus();
        mmRef.current?.select();
      }
      if (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
        e.preventDefault();
        mmRef.current?.focus();
        mmRef.current?.select();
      }
    },
    [yyyy]
  );

  const baseInput =
    "w-full bg-transparent text-center font-heading font-semibold text-foreground " +
    "placeholder:text-muted-foreground focus:outline-none tabular-nums";

  return (
    <div className="mx-auto max-w-xs">
      <div
        className="flex items-center gap-0 rounded-md border border-border bg-card shadow-sm px-2 py-3 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 transition-all"
        role="group"
        aria-label="Fecha de nacimiento"
      >
        {/* Day */}
        <input
          ref={ddRef}
          id={`${id}-dd`}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={2}
          placeholder="DD"
          value={dd}
          onChange={handleDdChange}
          onKeyDown={handleDdKeyDown}
          onFocus={e => e.target.select()}
          className={`${baseInput} text-3xl sm:text-4xl w-16 sm:w-20`}
          aria-label="Día"
          autoComplete="off"
        />

        <span className="text-2xl sm:text-3xl text-muted-foreground font-light select-none px-0.5">/</span>

        {/* Month */}
        <input
          ref={mmRef}
          id={`${id}-mm`}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={2}
          placeholder="MM"
          value={mm}
          onChange={handleMmChange}
          onKeyDown={handleMmKeyDown}
          onFocus={e => e.target.select()}
          className={`${baseInput} text-3xl sm:text-4xl w-16 sm:w-20`}
          aria-label="Mes"
          autoComplete="off"
        />

        <span className="text-2xl sm:text-3xl text-muted-foreground font-light select-none px-0.5">/</span>

        {/* Year */}
        <input
          ref={yyyyRef}
          id={`${id}-yyyy`}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={4}
          placeholder="AAAA"
          value={yyyy}
          onChange={handleYyyyChange}
          onKeyDown={handleYyyyKeyDown}
          onFocus={e => e.target.select()}
          className={`${baseInput} text-3xl sm:text-4xl flex-1`}
          aria-label="Año"
          autoComplete="off"
        />
      </div>

      {/* Labels */}
      <div className="flex items-center mt-2 px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="w-16 sm:w-20 text-center">Día</span>
        <span className="px-2 opacity-0">/</span>
        <span className="w-16 sm:w-20 text-center">Mes</span>
        <span className="px-2 opacity-0">/</span>
        <span className="flex-1 text-center">Año</span>
      </div>
    </div>
  );
}
