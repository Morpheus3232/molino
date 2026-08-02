"use client";

import { useRef, useState, useCallback, useId, useEffect, forwardRef, useImperativeHandle } from "react";

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

export interface DateInputHandle {
  /** Si la fecha está incompleta, marca error y lleva el foco al campo faltante. */
  reportIncomplete: () => void;
}

const MISSING_FIELD_MESSAGE = {
  dd: "Completá el día de nacimiento.",
  mm: "Completá el mes de nacimiento.",
  yyyy: "Completá el año de nacimiento.",
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

/**
 * Foco + selección + scroll-into-view. Sin esto, en mobile (especialmente
 * iOS Safari) el teclado virtual puede tapar el campo al avanzar
 * programáticamente entre Día → Mes → Año, dejando al usuario escribiendo
 * "a ciegas".
 */
function focusAndReveal(ref: React.RefObject<HTMLInputElement | null>) {
  ref.current?.focus();
  ref.current?.select();
  ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
}

/**
 * Fast date input: DD / MM / YYYY
 * - Writes left-to-right, auto-advances on completion
 * - Backspace steps back between fields
 * - Validates ranges in real time
 */
const DateInput = forwardRef<DateInputHandle, DateInputProps>(function DateInput(
  { value, onChange },
  ref
) {
  const id = useId();
  // Parse initial value
  const initial = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value.split("-")
    : ["", "", ""];

  const [dd, setDd] = useState(initial[2] === "00" ? "" : initial[2]);
  const [mm, setMm] = useState(initial[1] === "00" ? "" : initial[1]);
  const [yyyy, setYyyy] = useState(initial[0] === "0000" ? "" : initial[0]);
  const [missingField, setMissingField] = useState<"dd" | "mm" | "yyyy" | null>(null);

  const ddRef = useRef<HTMLInputElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const yyyyRef = useRef<HTMLInputElement>(null);
  const errorId = `${id}-error`;

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
        focusAndReveal(mmRef);
      }
    },
    [mm, yyyy, emit]
  );

  const handleDdKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowRight" && (e.currentTarget.selectionStart ?? 0) >= dd.length) {
        e.preventDefault();
        focusAndReveal(mmRef);
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
        focusAndReveal(yyyyRef);
      }
    },
    [dd, yyyy, emit]
  );

  const handleMmKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && mm === "") {
        e.preventDefault();
        focusAndReveal(ddRef);
      }
      if (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
        e.preventDefault();
        focusAndReveal(ddRef);
      }
      if (e.key === "ArrowRight" && (e.currentTarget.selectionStart ?? 0) >= mm.length) {
        e.preventDefault();
        focusAndReveal(yyyyRef);
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
        focusAndReveal(mmRef);
      }
      if (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0) {
        e.preventDefault();
        focusAndReveal(mmRef);
      }
    },
    [yyyy]
  );

  // Sin "w-full": en un flex row, `.w-full{width:100%}` compila después de
  // `.w-16`/`.sm\:w-20` en el CSS generado por Tailwind y, a igual
  // especificidad, gana la cascada — Día y Mes terminaban pidiendo 100% del
  // ancho cada uno y el campo Año (flex-1, basis 0%) quedaba en 0px reales.
  const baseInput =
    "bg-transparent text-center font-heading font-semibold text-foreground " +
    "placeholder:text-muted-foreground focus:outline-none tabular-nums";

  // Determina el primer campo incompleto, marca el error y le lleva el foco.
  // Devuelve true si la fecha ya está completa (nada que reportar).
  const reportIncomplete = useCallback(() => {
    if (dd.length < 2) {
      setMissingField("dd");
      focusAndReveal(ddRef);
      return false;
    }
    if (mm.length < 2) {
      setMissingField("mm");
      focusAndReveal(mmRef);
      return false;
    }
    if (yyyy.length < 4) {
      setMissingField("yyyy");
      focusAndReveal(yyyyRef);
      return false;
    }
    setMissingField(null);
    return true;
  }, [dd, mm, yyyy]);

  useImperativeHandle(ref, () => ({ reportIncomplete: () => { reportIncomplete(); } }), [reportIncomplete]);

  // Una vez mostrado el error, se limpia solo apenas el campo faltante se completa.
  useEffect(() => {
    if (!missingField) return;
    if (missingField === "dd" && dd.length === 2) setMissingField(null);
    if (missingField === "mm" && mm.length === 2) setMissingField(null);
    if (missingField === "yyyy" && yyyy.length === 4) setMissingField(null);
  }, [dd, mm, yyyy, missingField]);

  const handleGroupKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter") return;
      const isComplete = dd.length === 2 && mm.length === 2 && yyyy.length === 4;
      if (!isComplete) {
        e.preventDefault();
        e.stopPropagation();
        reportIncomplete();
      }
      // Fecha completa: se deja pasar el Enter para que el onKeyDown del
      // formulario (fuera de este componente) dispare el submit existente.
    },
    [dd, mm, yyyy, reportIncomplete]
  );

  return (
    <div className="mx-auto max-w-xs">
      <div
        className="flex items-center gap-0 rounded-md border border-border bg-card shadow-sm px-2 py-3 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 transition-all"
        role="group"
        aria-label="Fecha de nacimiento"
        aria-describedby={missingField ? errorId : undefined}
        onKeyDown={handleGroupKeyDown}
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
          onFocus={e => { e.target.select(); e.target.scrollIntoView({ block: "center", behavior: "smooth" }); }}
          className={`${baseInput} text-3xl sm:text-4xl w-16 sm:w-20`}
          aria-label="Día"
          aria-invalid={missingField === "dd"}
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
          onFocus={e => { e.target.select(); e.target.scrollIntoView({ block: "center", behavior: "smooth" }); }}
          className={`${baseInput} text-3xl sm:text-4xl w-16 sm:w-20`}
          aria-label="Mes"
          aria-invalid={missingField === "mm"}
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
          onFocus={e => { e.target.select(); e.target.scrollIntoView({ block: "center", behavior: "smooth" }); }}
          className={`${baseInput} text-3xl sm:text-4xl flex-1 min-w-0`}
          aria-label="Año"
          aria-invalid={missingField === "yyyy"}
          autoComplete="off"
        />
      </div>

      {/* Labels */}
      <div className="flex items-center mt-2 px-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span className="w-16 sm:w-20 text-center">Día</span>
        <span className="text-2xl sm:text-3xl px-0.5 opacity-0">/</span>
        <span className="w-16 sm:w-20 text-center">Mes</span>
        <span className="text-2xl sm:text-3xl px-0.5 opacity-0">/</span>
        <span className="flex-1 text-center">Año</span>
      </div>

      {missingField && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-2 px-3 text-xs font-medium text-error text-center">
          {MISSING_FIELD_MESSAGE[missingField]}
        </p>
      )}
    </div>
  );
});

DateInput.displayName = "DateInput";

export default DateInput;
