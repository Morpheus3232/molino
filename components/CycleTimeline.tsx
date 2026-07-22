"use client";

import { motion } from "framer-motion";
import { getPersonalYear } from "@/lib/engines/dateEngine";
import { CYCLE_YEARS } from "@/lib/data";

interface CycleTimelineProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

interface TimelineEvent {
  year: number;
  label: string;
  cycleNumber: number;
}

export default function CycleTimeline({ birthDay, birthMonth, birthYear }: CycleTimelineProps) {
  const currentYear = new Date().getFullYear();
  const birthYearNum = birthYear;

  const events: TimelineEvent[] = [];

  for (let year = birthYearNum + 18; year <= currentYear + 8; year += 3) {
    const cycleNum = getPersonalYear(birthDay, birthMonth, year);
    const cycle = CYCLE_YEARS[cycleNum] || CYCLE_YEARS[1];

    let label = cycle.name.replace("Año de ", "");
    if (year === 2018) label = "Cambiaste de ciclo";
    else if (year === 2021) label = "Comenzó tu año 1";
    else if (year === currentYear) label = `Año ${cycleNum} — ${label}`;
    else if (year === currentYear + 4) label = "Nuevo ciclo";

    events.push({ year, label, cycleNumber: cycleNum });
  }

  const displayEvents = events.slice(0, 5);

  return (
    <div className="relative pl-6">
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
      {displayEvents.map((event, index) => (
        <motion.div
          key={event.year}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative mb-6 last:mb-0"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
            className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-foreground shadow"
          />
          <p className="text-xs font-medium text-muted">{event.year}</p>
          <p className="text-sm font-medium text-foreground">{event.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
