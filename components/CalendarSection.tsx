"use client";

import { motion } from "framer-motion";
import { getPersonalDayForDate } from "@/lib/engines/dateEngine";
import { ENERGY_TYPES } from "@/lib/data";
import { getShortDayName } from "@/lib/utils";
import SectionCard from "./SectionCard";

interface CalendarSectionProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

export default function CalendarSection({ birthDay, birthMonth, birthYear }: CalendarSectionProps) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const personalDay = getPersonalDayForDate(birthDay, birthMonth, birthYear, date);
    const energy = ENERGY_TYPES[personalDay] || ENERGY_TYPES[7];
    return { date, energy, personalDay, isToday: i === 0 };
  });

  return (
    <SectionCard delay={0.15}>
      <div className="mb-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">Próximos 7 días</h3>
        <p className="text-xs text-muted">Tu energía personal por día</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {days.map((day, index) => (
          <motion.div
            key={day.date.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className={`flex-shrink-0 w-[72px] rounded-xl p-3 text-center transition ${
              day.isToday
                ? "bg-foreground text-background shadow-md"
                : "bg-background text-muted"
            }`}
          >
            <p className={`text-[10px] font-medium uppercase ${day.isToday ? "text-background/70" : "text-muted"}`}>
              {day.isToday ? "Hoy" : getShortDayName(day.date)}
            </p>
            <p className="text-lg font-semibold my-1">{day.date.getDate()}</p>
            <div
              className="mx-auto h-2 w-2 rounded-full mb-1"
              style={{ backgroundColor: day.isToday ? "var(--color-accent)" : day.energy.color }}
            />
            <p className={`text-[10px] leading-tight ${day.isToday ? "text-background/70" : "text-muted"}`}>
              {day.energy.name}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}
