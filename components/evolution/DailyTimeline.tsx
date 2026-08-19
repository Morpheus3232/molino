"use client";

import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  getHistoryForProfile,
  computeStreak,
  type DailySnapshot,
  type Orientation,
} from "@/lib/session/dailyHistory";
import {
  calculateDailyEnergy,
  getYearTheme,
} from "@/lib/engines/dailyEnergyEngine";
import { getPersonalYear } from "@/lib/calculations";
import { formatDate as formatI18nDate } from "@/lib/i18n/format";

const ORIENTATION_COLORS: Record<Orientation, string> = {
  ACTUAR: "var(--color-accent)",
  ESPERAR: "var(--color-muted)",
  OBSERVAR: "var(--color-ink)",
};

function fmtDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return formatI18nDate(date, { weekday: "short", day: "numeric", month: "short" });
}

function dayIndex(dateStr: string, firstDate: string): number {
  const a = new Date(`${firstDate}T00:00:00`);
  const b = new Date(`${dateStr}T00:00:00`);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

interface DailyTimelineProps {
  profile: UserProfile;
}

export default function DailyTimeline({ profile }: DailyTimelineProps) {
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const history = useMemo(
    () => getHistoryForProfile(profile.birthDate, 30).slice().reverse(),
    [profile.birthDate]
  );

  const streak = useMemo(
    () => computeStreak(profile.birthDate),
    [profile.birthDate]
  );

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return calculateDailyEnergy(profile, d);
  }, [profile]);

  const yearTheme = useMemo(() => {
    const now = new Date();
    const [y, m, dd] = profile.birthDate.split("-").map(Number);
    const cycle = getPersonalYear(dd, m, y, now.getFullYear());
    return getYearTheme(cycle);
  }, [profile.birthDate]);

  const firstDate = history[0]?.date ?? "";
  const lastDate = history[history.length - 1]?.date ?? "";
  const totalDays =
    firstDate && lastDate ? dayIndex(lastDate, firstDate) + 1 : 0;

  const handleToggle = useCallback(
    (date: string) => setActiveDate((prev) => (prev === date ? null : date)),
    []
  );

  if (history.length === 0) return null;

  const active = history.find((h) => h.date === activeDate);

  return (
    <section className="border-t border-ink/10 pt-8 mt-8">
      {/* ── STREAK ──────────────────────────────────── */}
      {streak && (
        <div className="mb-6 px-1">
          <p className="text-sm text-foreground">
            Llevás{" "}
            <span className="font-heading text-lg font-bold text-foreground">
              {streak.days} {streak.days === 1 ? "día" : "días"}
            </span>{" "}
            consecutivos en{" "}
            <span
              className="font-medium"
              style={{ color: ORIENTATION_COLORS[streak.orientation] }}
            >
              {streak.orientation}
            </span>
          </p>
        </div>
      )}

      {/* ── TIMELINE (horizontal scrollable on mobile) ── */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="relative min-w-[480px] sm:min-w-0">
          {/* Connecting line */}
          <div
            className="absolute top-3 left-0 right-0 h-px"
            style={{ backgroundColor: "var(--color-ink)", opacity: 0.12 }}
            aria-hidden="true"
          />

          {/* Dots */}
          <div className="relative flex items-start justify-between" style={{ gap: totalDays > 14 ? 0 : undefined }}>
            {history.map((item, i) => {
              const isLast = i === history.length - 1;
              const isActive = activeDate === item.date;
              const color = ORIENTATION_COLORS[item.orientation];
              const radius = item.overallScore
                ? 4 + (item.overallScore / 100) * 6
                : 6;

              return (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => handleToggle(item.date)}
                  aria-label={`${fmtDate(item.date)}: ${item.orientation} — ${item.theme}`}
                  aria-expanded={isActive}
                  className="relative flex flex-col items-center group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  style={{ flex: "1 1 0", minWidth: 0 }}
                >
                  {/* Dot */}
                  <motion.span
                    className="relative z-10 rounded-full border-2 transition-shadow"
                    style={{
                      backgroundColor: isActive ? color : "var(--color-background)",
                      borderColor: color,
                      width: radius * 2,
                      height: radius * 2,
                      boxShadow: isActive ? `0 0 0 3px ${color}20` : "none",
                    }}
                    whileHover={{ scale: 1.25 }}
                    transition={{ duration: 0.15 }}
                  />

                  {/* Date label (visible on larger screens or when active) */}
                  <span
                    className={`mt-2 text-center leading-tight transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "text-muted group-hover:text-foreground"
                    }`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    <span className="hidden sm:inline">{fmtDate(item.date)}</span>
                    <span className="sm:hidden">
                      {new Date(`${item.date}T00:00:00`).getDate()}
                    </span>
                  </span>

                  {/* Orientation tag (only when active) */}
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-xs font-mono uppercase tracking-widest"
                      style={{ color, fontSize: "0.6rem" }}
                    >
                      {item.orientation}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── DETAIL PANEL (when a dot is active) ─────── */}
      {active && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mt-4 border border-ink/10 p-5 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-micro mb-1">{fmtDate(active.date)}</p>
              <p className="text-sm text-foreground font-medium">{active.theme}</p>
              <p className="text-xs text-muted mt-1">
                {active.energyLevel} · {active.orientation}
                {typeof active.personalDay === "number" && ` · Día ${active.personalDay}`}
              </p>
            </div>
            {typeof active.overallScore === "number" && (
              <div className="text-right shrink-0">
                <p className="font-heading text-2xl text-foreground">{active.overallScore}</p>
                <p className="text-xs text-muted">energía</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── MAÑANA ──────────────────────────────────── */}
      <div className="mt-6 border border-ink/10 p-5 sm:p-6 bg-ink/[0.02]">
        <p className="label-micro mb-2 text-accent">MAÑANA</p>
        <p className="text-sm text-foreground">
          <span className="font-medium">{tomorrow.theme}</span> · Energía{" "}
          {tomorrow.overallScore}/100
        </p>
        <p className="text-xs text-muted mt-2 leading-relaxed">
          Volvé a ver cómo se conecta con{" "}
          <span className="text-foreground">{yearTheme}</span>.
        </p>
      </div>
    </section>
  );
}
