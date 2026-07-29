"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";

const MONTHS_SHORT = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function range(start: number, end: number): string[] {
  return Array.from({ length: end - start + 1 }, (_, i) =>
    String(start + i).padStart(2, "0")
  );
}

interface ScrollColumnProps {
  values: string[];
  value: string;
  onChange: (v: string) => void;
}

function ScrollColumn({ values, value, onChange }: ScrollColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    const idx = values.indexOf(value);
    if (idx >= 0) {
      ref.current.scrollTop = idx * ITEM_HEIGHT;
    }
  }, [ready]); // only on mount

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const idx = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(idx, values.length - 1));
      const newVal = values[clamped];
      if (newVal !== value) {
        onChange(newVal);
      }
    });
  }, [values, onChange, value]);

  const padding = Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT;
  const height = VISIBLE_ITEMS * ITEM_HEIGHT;

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{ height }}
    >
      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-full overflow-y-auto snap-y snap-mandatory"
        style={{
          scrollbarWidth: "none",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        }}
        tabIndex={0}
        role="listbox"
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        <div style={{ paddingTop: padding, paddingBottom: padding }}>
          {values.map((v, i) => {
            const isSelected = v === value;
            return (
              <div
                key={v}
                className="snap-center flex items-center justify-center transition-all duration-150 select-none cursor-pointer"
                style={{ height: ITEM_HEIGHT }}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  ref.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: "smooth" });
                }}
              >
                <span
                  className={`font-heading text-center transition-all duration-150 ${
                    isSelected
                      ? "text-xl font-semibold text-foreground"
                      : "text-sm text-muted-foreground/30"
                  }`}
                >
                  {v}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-[44px] rounded-xl bg-accent/10 border border-accent/20 pointer-events-none z-10"
        aria-hidden="true"
      />
    </div>
  );
}

interface ScrollDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function parseValue(v: string): [string, string, string] {
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return v.split("-") as [string, string, string];
  }
  return ["01", "01", "2000"];
}

export default function ScrollDatePicker({ value, onChange }: ScrollDatePickerProps) {
  const [parsedDay, parsedMonth, parsedYear] = parseValue(value);
  const [day, setDay] = useState(parsedDay);
  const [month, setMonth] = useState(parsedMonth);
  const [year, setYear] = useState(parsedYear);

  const yearNum = parseInt(year) || 2000;
  const monthNum = parseInt(month) || 1;
  const daysInMonth = getDaysInMonth(monthNum, yearNum);
  const days = useMemo(() => range(1, daysInMonth), [daysInMonth]);
  const years = useMemo(() => range(1940, new Date().getFullYear()), []);

  const monthIndex = monthNum - 1;
  const monthValue = MONTHS_SHORT[monthIndex] || "ENE";

  const emitChange = useCallback((d: string, m: string, y: string) => {
    onChange(`${y}-${m}-${d}`);
  }, [onChange]);

  const handleDayChange = useCallback((d: string) => {
    setDay(d);
    emitChange(d, month, year);
  }, [month, year, emitChange]);

  const handleMonthChange = useCallback((mAbbr: string) => {
    const idx = MONTHS_SHORT.indexOf(mAbbr);
    if (idx < 0) return;
    const mStr = String(idx + 1).padStart(2, "0");
    setMonth(mStr);
    const newMax = getDaysInMonth(idx + 1, yearNum);
    const d = parseInt(day) > newMax ? String(newMax).padStart(2, "0") : day;
    setDay(d);
    emitChange(d, mStr, year);
  }, [year, yearNum, day, emitChange]);

  const handleYearChange = useCallback((y: string) => {
    setYear(y);
    const parsedY = parseInt(y) || 2000;
    const newMax = getDaysInMonth(monthNum, parsedY);
    const d = parseInt(day) > newMax ? String(newMax).padStart(2, "0") : day;
    setDay(d);
    emitChange(d, month, y);
  }, [monthNum, day, emitChange]);

  return (
    <div>
      <div className="flex gap-0 items-stretch">
        <ScrollColumn values={days} value={day} onChange={handleDayChange} />
        <ScrollColumn
          values={MONTHS_SHORT}
          value={monthValue}
          onChange={handleMonthChange}
        />
        <ScrollColumn values={years} value={year} onChange={handleYearChange} />
      </div>
      <div className="flex justify-between mt-2 px-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Día
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Mes
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Año
        </span>
      </div>
    </div>
  );
}
