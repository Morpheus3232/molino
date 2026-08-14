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
  if (!ref.current) return;
  try {
    ref.current.focus();
  } catch {}
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

  const valuesRef = useRef({
    dd: initial[2] === "00" ? "" : initial[2],
    mm: initial[1] === "00" ? "" : initial[1],
    yyyy: initial[0] === "0000" ? "" : initial[0],
  });

  const ddRef = useRef<HTMLInputElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const yyyyRef = useRef<HTMLInputElement>(null);
  const errorId = `${id}-error`;

  const emit = useCallback(() => {
    const d = (ddRef.current?.value || valuesRef.current.dd || "").replace(/\D/g, "");
    const m = (mmRef.current?.value || valuesRef.current.mm || "").replace(/\D/g, "");
    const y = (yyyyRef.current?.value || valuesRef.current.yyyy || "").replace(/\D/g, "");

    if (d.length >= 1 && m.length >= 1 && y.length === 4) {
      const pd = d.padStart(2, "0");
      const pm = m.padStart(2, "0");
      const py = y.padStart(4, "0");
      const yNum = parseInt(py, 10);
      const mNum = parseInt(pm, 10);
      const dNum = parseInt(pd, 10);
      if (
        yNum >= 1900 &&
        yNum <= 2100 &&
        mNum >= 1 &&
        mNum <= 12 &&
        dNum >= 1 &&
        dNum <= 31
      ) {
        onChange(`${py}-${pm}-${pd}`);
        return;
      }
    } else if (!d && !m && !y) {
      onChange("");
    }
  }, [onChange]);

  useEffect(() => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-");
      valuesRef.current = { dd: d, mm: m, yyyy: y };
      setDd(d);
      setMm(m);
      setYyyy(y);
    }
  }, [value]);

  // ── DAY ──────────────────────────────────────────────────────────────────────
  const handleDdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    valuesRef.current.dd = raw;
    setDd(raw);
      if (raw.length === 2) {
        const n = clamp(parseInt(raw, 10), 1, 31);
        const fixed = String(n).padStart(2, "0");
        valuesRef.current.dd = fixed;
        setDd(fixed);
        focusAndReveal(mmRef);
      }
      emit();
    },
    [emit]
  );

  const handleDdBlur = useCallback(() => {
    const cur = ddRef.current?.value.replace(/\D/g, "") || valuesRef.current.dd;
    if (cur.length === 1 && parseInt(cur, 10) >= 1) {
      const fixed = cur.padStart(2, "0");
      valuesRef.current.dd = fixed;
      setDd(fixed);
      emit();
    }
  }, [emit]);

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
      valuesRef.current.mm = raw;
      setMm(raw);
      if (raw.length === 2) {
        const n = clamp(parseInt(raw, 10), 1, 12);
        const fixed = String(n).padStart(2, "0");
        valuesRef.current.mm = fixed;
        setMm(fixed);
        // Clamp day if year and month exist
        const yVal = yyyyRef.current?.value.replace(/\D/g, "") || valuesRef.current.yyyy;
        const dVal = ddRef.current?.value.replace(/\D/g, "") || valuesRef.current.dd;
        if (yVal.length === 4 && dVal.length >= 1) {
          const maxD = daysInMonth(n, parseInt(yVal, 10));
          const clampedD = String(clamp(parseInt(dVal, 10), 1, maxD)).padStart(2, "0");
          valuesRef.current.dd = clampedD;
          setDd(clampedD);
        }
        focusAndReveal(yyyyRef);
      }
      emit();
    },
    [emit]
  );

  const handleMmBlur = useCallback(() => {
    const cur = mmRef.current?.value.replace(/\D/g, "") || valuesRef.current.mm;
    if (cur.length === 1 && parseInt(cur, 10) >= 1) {
      const fixed = cur.padStart(2, "0");
      valuesRef.current.mm = fixed;
      setMm(fixed);
      emit();
    }
  }, [emit]);

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
      valuesRef.current.yyyy = raw;
      setYyyy(raw);
      emit();
    },
    [emit]
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
    const { dd: d, mm: m, yyyy: y } = valuesRef.current;
    if (d.length < 2) {
      setMissingField("dd");
      focusAndReveal(ddRef);
      return false;
    }
    if (m.length < 2) {
      setMissingField("mm");
      focusAndReveal(mmRef);
      return false;
    }
    if (y.length < 4) {
      setMissingField("yyyy");
      focusAndReveal(yyyyRef);
      return false;
    }
    setMissingField(null);
    return true;
  }, []);

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
      const { dd: d, mm: m, yyyy: y } = valuesRef.current;
      const isComplete = d.length >= 1 && m.length >= 1 && y.length === 4;
      if (!isComplete) {
        e.preventDefault();
        e.stopPropagation();
        reportIncomplete();
      }
      // Fecha completa: se deja pasar el Enter para que el onKeyDown del
      // formulario (fuera de este componente) dispare el submit existente.
    },
    [reportIncomplete]
  );

  return (
    <div className="mx-auto max-w-xs">
      <div
        className="flex items-center gap-0 rounded-md border border-border px-2 py-3 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 transition-colors"
        role="group"
        aria-label="Fecha de nacimiento"
        aria-describedby={missingField ? errorId : undefined}
        onKeyDown={handleGroupKeyDown}
      >
        {/* Day */}
        <input
          ref={ddRef}
          id={`${id}-dd`}
          name="birthdate-day"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={2}
          placeholder="DD"
          value={dd}
          onChange={handleDdChange}
          onBlur={handleDdBlur}
          onKeyDown={handleDdKeyDown}
          onFocus={e => { e.target.select(); e.target.scrollIntoView({ block: "center", behavior: "smooth" }); }}
          className={`${baseInput} text-3xl sm:text-4xl w-16 sm:w-20`}
          aria-invalid={missingField === "dd"}
          autoComplete="off"
          suppressHydrationWarning
        />

        <span className="text-2xl sm:text-3xl text-muted-foreground font-light select-none px-0.5">/</span>

        {/* Month */}
        <input
          ref={mmRef}
          id={`${id}-mm`}
          name="birthdate-month"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={2}
          placeholder="MM"
          value={mm}
          onChange={handleMmChange}
          onBlur={handleMmBlur}
          onKeyDown={handleMmKeyDown}
          onFocus={e => { e.target.select(); e.target.scrollIntoView({ block: "center", behavior: "smooth" }); }}
          className={`${baseInput} text-3xl sm:text-4xl w-16 sm:w-20`}
          aria-invalid={missingField === "mm"}
          autoComplete="off"
          suppressHydrationWarning
        />

        <span className="text-2xl sm:text-3xl text-muted-foreground font-light select-none px-0.5">/</span>

        {/* Year */}
        <input
          ref={yyyyRef}
          id={`${id}-yyyy`}
          name="birthdate-year"
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
          aria-invalid={missingField === "yyyy"}
          autoComplete="off"
          suppressHydrationWarning
        />
      </div>

      {/* Labels: <label> real asociado por htmlFor, no solo aria-label —
          así el lector de pantalla anuncia "Día, edit text" al enfocar,
          en vez de depender de un atributo que un futuro edit podría borrar. */}
      <div className="flex items-center mt-2 px-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <label htmlFor={`${id}-dd`} className="w-16 sm:w-20 text-center">Día</label>
        <span className="text-2xl sm:text-3xl px-0.5 opacity-0">/</span>
        <label htmlFor={`${id}-mm`} className="w-16 sm:w-20 text-center">Mes</label>
        <span className="text-2xl sm:text-3xl px-0.5 opacity-0">/</span>
        <label htmlFor={`${id}-yyyy`} className="flex-1 text-center">Año</label>
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
