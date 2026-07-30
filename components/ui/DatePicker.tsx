"use client";

import { useState, useRef, useCallback } from "react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts: string[] = [];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join(" / ");
}

function isValidDay(d: number, month: number, year: number): boolean {
  if (d < 1 || d > 31) return false;
  if (!month || !year) return true;
  return d <= new Date(year, month, 0).getDate();
}

interface DatePickerProps {
  day: string;
  month: string;
  year: string;
  onDayChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export default function DatePicker({
  day, month, year,
  onDayChange, onMonthChange, onYearChange,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const rawValue = `${day}${month}${year}`;
  const displayValue = rawValue === "0100" ? "" : formatDateInput(rawValue);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4, 8);

    if (d) onDayChange(d.replace(/^0+/, ""));
    else onDayChange("");

    if (m) onMonthChange(m);
    else onMonthChange("");

    if (y) onYearChange(y);
    else onYearChange("");
  }, [onDayChange, onMonthChange, onYearChange]);

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  const valid = (!day || (dayNum >= 1 && dayNum <= 31)) &&
                (!month || (monthNum >= 1 && monthNum <= 12)) &&
                (!year || yearNum >= 1900);
  const complete = day && month && year;
  const monthName = monthNum >= 1 && monthNum <= 12 ? MONTHS[monthNum - 1] : "";

  return (
    <div className="space-y-3">
      <div
        className={`relative border transition-colors ${focused ? "border-accent" : "border-border"} ${!valid && focused ? "border-red-400" : ""}`}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="DD / MM / AAAA"
          className="w-full bg-transparent text-center font-heading text-xl sm:text-2xl font-semibold tracking-widest text-foreground px-4 py-6 focus:outline-none placeholder:text-muted"
          aria-label="Fecha de nacimiento"
          autoComplete="bday"
        />
      </div>

      {complete && monthName && (
        <p className="text-center text-xs text-muted font-mono tracking-wider">
          {day} de {monthName} de {year}
        </p>
      )}
    </div>
  );
}
