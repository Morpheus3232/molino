"use client";

import { motion } from "framer-motion";
import { getDayVibration, type TopicId, getFavorableNumbers } from "@/lib/utils/dateVibration";

interface VibrationCalendarProps {
  topic: TopicId;
  dates: string[];
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const TOPIC_COPY: Record<TopicId, { title: string; desc: string; color: string }> = {
  viajes: {
    title: "Viajar",
    desc: "Viajá en días cuya fecha sume 5: mueve, abre horizontes y fluye con los imprevistos.",
    color: "var(--score-excellent)",
  },
  negocios: {
    title: "Emprender",
    desc: "Emprendé o arrancá un negocio en días que sumen 8 o 28: construyen, concretan y dan estructura.",
    color: "var(--score-excellent)",
  },
};

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function VibrationCalendar({ topic, dates }: VibrationCalendarProps) {
  if (dates.length === 0) return null;

  const copy = TOPIC_COPY[topic];
  const favorableNumbers = getFavorableNumbers(topic);

  const dayMap = new Map(dates.map(d => [d, getDayVibration(topic, d)]));
  const sortedDates = [...dates].sort((a, b) => a.localeCompare(b));
  const firstDate = new Date(sortedDates[0] + "T12:00:00");
  const lastDate = new Date(sortedDates[sortedDates.length - 1] + "T12:00:00");

  const startMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  const endMonth = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const isPast = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const allDays: { date: Date; dateStr: string; hasData: boolean; vibration?: ReturnType<typeof getDayVibration>; today: boolean; past: boolean }[] = [];
  const cursor = new Date(startMonth);
  cursor.setDate(cursor.getDate() - cursor.getDay());

  while (cursor <= endMonth || cursor.getDay() !== 0) {
    const dateStr = toDateKey(cursor);
    const vibration = dayMap.get(dateStr);
    allDays.push({
      date: new Date(cursor),
      dateStr,
      hasData: !!vibration,
      vibration,
      today: isToday(dateStr),
      past: isPast(dateStr),
    });
    cursor.setDate(cursor.getDate() + 1);
    if (cursor > endMonth && cursor.getDay() === 0) break;
  }

  const totalCells = Math.ceil(allDays.length / 7) * 7;
  while (allDays.length < totalCells) {
    allDays.push({ date: new Date(cursor), dateStr: "", hasData: false, today: false, past: true });
    cursor.setDate(cursor.getDate() + 1);
  }

  const favorableDays = sortedDates.map(d => dayMap.get(d)!).filter(v => v.favorable);

  return (
    <div>
      <div className="flex flex-col gap-1 mb-5">
        <p className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {copy.title}
        </p>
        <p className="text-sm text-muted leading-relaxed max-w-2xl">{copy.desc}</p>
      </div>

      {/* Grid compacto */}
      <div className="max-w-md">
        <div className="grid grid-cols-7">
          {DAY_NAMES.map((day) => (
            <div key={day} className="py-1.5 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-muted border-b border-ink/10">
              {day}
            </div>
          ))}

          {allDays.map((cell, i) => {
            const { date, dateStr, hasData, vibration, today: isTodayCell, past } = cell;
            const isCurrentMonth = date.getMonth() === startMonth.getMonth();
            const isEmpty = !dateStr;

            if (isEmpty || !isCurrentMonth) {
              return <div key={`empty-${i}`} className="h-9" />;
            }

            if (!hasData || !vibration) {
              return (
                <div key={dateStr} className="h-9 flex items-center justify-center">
                  <span className={`text-[10px] font-mono ${past ? "text-muted/30" : "text-muted/50"}`}>{date.getDate()}</span>
                </div>
              );
            }

            return (
              <div key={dateStr} className="h-9 flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono text-muted leading-none">{date.getDate()}</span>
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold border leading-none"
                  style={{
                    borderColor: vibration.favorable ? vibration.color : "rgba(243,241,234,0.12)",
                    color: vibration.favorable ? (isTodayCell ? "var(--color-background)" : vibration.color) : isTodayCell ? "var(--color-foreground)" : "var(--color-muted)",
                    backgroundColor: vibration.favorable ? (isTodayCell ? vibration.color : `${vibration.color}1a`) : isTodayCell ? "rgba(243,241,234,0.08)" : "transparent",
                  }}
                >
                  {vibration.number}
                </span>
                {isTodayCell && <span className="w-1 h-1 rounded-full bg-accent mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Regla del topic */}
      <p className="text-xs text-muted mt-4">
        <span className="font-mono font-semibold" style={{ color: copy.color }}>{favorableNumbers}</span>{" "}
        {topic === "viajes" ? "= días ideales para viajar" : "= días ideales para emprender"}
      </p>

      {/* Días favorables con fecha */}
      {favorableDays.length > 0 && (
        <div className="mt-4 space-y-2">
          {favorableDays.map((d, i) => {
            const isTodayCell = isToday(d.date);
            return (
              <motion.div
                key={d.date}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className="flex items-center gap-3 py-2 border-b border-ink/10"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border shrink-0"
                  style={{ borderColor: d.color, color: d.color, backgroundColor: `${d.color}1a` }}
                >
                  {d.number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground capitalize leading-tight">{formatDayLabel(d.date)}</p>
                  <p className="text-xs text-muted leading-tight">{d.label}</p>
                </div>
                {isTodayCell && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-accent shrink-0">Hoy</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
