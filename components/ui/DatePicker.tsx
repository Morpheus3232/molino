"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

type PickerColumn = {
  label: string;
  values: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
};

function WheelPicker({ label, values, selected, onSelect }: PickerColumn) {
  const [highlight, setHighlight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const itemHeight = el.children[0]?.clientHeight || 44;
    const scrollTop = el.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (values[index] && values[index].value !== selected) {
      onSelect(values[index].value);
    }
  }, [values, selected, onSelect]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">{label}</p>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border border-border bg-card"
        style={{ maxHeight: "160px" }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-11 bg-gradient-to-b from-card/90 via-card to-card/90 pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border/50 pointer-events-none z-10" />
        <div
          className="overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "160px" }}
          onScroll={handleScroll}
        >
          <div className="p-1 space-y-1">
            {values.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => onSelect(v.value)}
                className={`w-full text-center py-2.5 rounded-lg transition-colors duration-150 ${
                  v.value === selected
                    ? "font-serif text-base sm:text-lg font-semibold text-foreground bg-accent/10"
                    : "text-sm text-muted/50 hover:text-muted"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DatePickerProps {
  day: string;
  month: string;
  year: string;
  onDayChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  daysInMonth: number;
  currentYear: number;
}

export default function DatePicker({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  daysInMonth,
  currentYear,
}: DatePickerProps) {
  const months = [
    { value: "01", label: "Ene" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Abr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Ago" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dic" },
  ];

  const dayValues = Array.from({ length: daysInMonth }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const yearValues = Array.from({ length: 100 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  return (
    <div className="grid grid-cols-3 gap-3">
      <WheelPicker label="Día" values={dayValues} selected={day} onSelect={onDayChange} />
      <WheelPicker label="Mes" values={months} selected={month} onSelect={onMonthChange} />
      <WheelPicker label="Año" values={yearValues} selected={year} onSelect={onYearChange} />
    </div>
  );
}