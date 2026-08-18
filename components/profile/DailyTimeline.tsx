"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { UserProfile } from "@/types/user";
import {
  getHistoryForProfile,
  recordDailySnapshot,
  buildDailySnapshot,
  computeStreak,
  getPreviousSnapshot,
  type DailySnapshot,
  type Orientation,
} from "@/lib/session/dailyHistory";
import { calculateDailyEnergy, getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import { getPersonalYear } from "@/lib/calculations";
import { formatDate as formatI18nDate } from "@/lib/i18n/format";
import Button from "@/components/ui/Button";
import { Flame, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { getScoreLabel } from "@/lib/utils/score";

const ORIENTATION_COLORS: Record<Orientation, string> = {
  ACTUAR: "var(--color-accent)",
  ESPERAR: "var(--tier-afin)",
  OBSERVAR: "var(--tier-neutral)",
};

const ORIENTATION_LABELS: Record<Orientation, string> = {
  ACTUAR: "Actuar",
  ESPERAR: "Esperar",
  OBSERVAR: "Observar",
};

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return formatI18nDate(date, { weekday: "short", day: "numeric", month: "short" });
}

function formatFullDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return formatI18nDate(date, { weekday: "long", day: "numeric", month: "long" });
}

interface DailyTimelineProps {
  profile: UserProfile;
}

export default function DailyTimeline({ profile }: DailyTimelineProps) {
  const [history, setHistory] = useState<DailySnapshot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Registrar snapshot de hoy al montar (idempotente: misma fecha → sobrescribe)
    const snapshot = buildDailySnapshot(profile);
    recordDailySnapshot(snapshot);
    // Cargar historial
    const loaded = getHistoryForProfile(profile.birthDate);
    setHistory(loaded);
  }, [profile]);

  const streak = useMemo(() => {
    if (!mounted || history.length === 0) return null;
    return computeStreak(profile.birthDate);
  }, [mounted, history, profile.birthDate]);

  const tomorrowPreview = useMemo(() => {
    if (!mounted) return null;
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const energy = calculateDailyEnergy(profile, tomorrow);
      const [birthYear, birthMonth, birthDay] = profile.birthDate.split("-").map(Number);
      const yearCycle = getPersonalYear(birthDay, birthMonth, birthYear, tomorrow.getFullYear());
      const yearTheme = getYearTheme(yearCycle);
      return { theme: energy.theme, yearCycle, yearTheme, description: energy.description };
    } catch {
      return null;
    }
  }, [mounted, profile]);

  const selectedSnapshot = useMemo(() => {
    if (!selectedDate) return null;
    return history.find((s) => s.date === selectedDate) ?? null;
  }, [selectedDate, history]);

  const selectedDayCycle = useMemo(() => {
    if (!selectedSnapshot) return null;
    try {
      const [birthYear, birthMonth, birthDay] = profile.birthDate.split("-").map(Number);
      const year = new Date(`${selectedSnapshot.date}T00:00:00`).getFullYear();
      const cycle = getPersonalYear(birthDay, birthMonth, birthYear, year);
      const theme = getYearTheme(cycle);
      return { cycle, theme };
    } catch {
      return null;
    }
  }, [selectedSnapshot, profile.birthDate]);

  if (!mounted) return null;

  if (history.length === 0) {
    return (
      <div className="text-center py-12 border-t border-ink/10">
        <h3 className="font-display text-2xl tracking-tight text-foreground mb-3">
          Tu línea de energía
        </h3>
        <p className="text-muted mb-4 max-w-sm mx-auto">
          A partir de hoy vas a poder ver cómo evoluciona tu orientación día a día.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-ink/10 pt-8">
      {/* Header + Streak */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl tracking-tight text-foreground">
            Tu línea de energía
          </h3>
          <p className="text-xs text-muted mt-1">
            {history.length} {history.length === 1 ? "día registrado" : "días registrados"}
          </p>
        </div>
        {streak && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-md"
          >
            <Flame className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-accent">
              {streak.days} {streak.days === 1 ? "día" : "días"} consecutivos
            </span>
            <span className="text-xs text-muted">
              · {ORIENTATION_LABELS[streak.orientation]}
            </span>
          </motion.div>
        )}
      </div>

      {/* Timeline: horizontal scroll en mobile */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-end gap-0 min-w-max sm:min-w-0">
          {history.slice().reverse().map((snapshot, i) => {
            const isSelected = selectedDate === snapshot.date;
            const isToday = i === history.slice().reverse().length - 1;
            return (
              <button
                key={snapshot.date}
                type="button"
                onClick={() => setSelectedDate(isSelected ? null : snapshot.date)}
                className="group flex flex-col items-center relative"
                style={{ minWidth: "3.5rem" }}
                aria-label={`${formatDate(snapshot.date)}: ${ORIENTATION_LABELS[snapshot.orientation]}, ${snapshot.theme}`}
              >
                {/* Theme label */}
                <span className="text-[10px] text-muted mb-1.5 truncate max-w-[4rem] opacity-0 group-hover:opacity-100 transition-opacity">
                  {snapshot.theme}
                </span>

                {/* Score ring */}
                <div className="relative mb-2">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 36 36"
                    className="transform -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="var(--color-ink, #241F17)"
                      strokeWidth="2"
                      opacity="0.15"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={ORIENTATION_COLORS[snapshot.orientation]}
                      strokeWidth="2"
                      strokeDasharray={`${(snapshot.overallScore ?? 50) * 1.005} 100.5`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  {/* Score number centered */}
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium text-foreground">
                    {snapshot.overallScore ?? "—"}
                  </span>
                </div>

                {/* Dot + connector */}
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-offset-background scale-125"
                      : "group-hover:scale-110"
                  }`}
                  style={{
                    backgroundColor: ORIENTATION_COLORS[snapshot.orientation],
                    ...(isSelected ? { ringColor: ORIENTATION_COLORS[snapshot.orientation] } : {}),
                  }}
                  aria-hidden="true"
                />

                {/* Date label */}
                <span
                  className={`text-[10px] font-mono mt-2 whitespace-nowrap ${
                    isToday ? "text-accent font-semibold" : "text-muted"
                  } ${isSelected ? "text-foreground font-medium" : ""}`}
                >
                  {isToday ? "Hoy" : formatDate(snapshot.date).split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedSnapshot && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 p-5 border border-ink/10 rounded-lg bg-background"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="label-micro text-muted">
                {formatFullDate(selectedSnapshot.date)}
              </p>
              <p className="text-sm font-medium text-foreground mt-1">
                {selectedSnapshot.theme}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-sm font-heading font-semibold"
                style={{ color: ORIENTATION_COLORS[selectedSnapshot.orientation] }}
              >
                {ORIENTATION_LABELS[selectedSnapshot.orientation]}
              </p>
              <p className="text-xs text-muted mt-0.5">
                Día {selectedSnapshot.personalDay ?? "—"}
              </p>
            </div>
          </div>

          {selectedDayCycle && (
            <div className="flex items-center gap-2 pt-3 border-t border-ink/10">
              <span className="text-xs text-muted">
                Año personal {selectedDayCycle.cycle} · {selectedDayCycle.theme}
              </span>
            </div>
          )}

          {selectedSnapshot.overallScore != null && (
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${selectedSnapshot.overallScore}%`,
                      backgroundColor: ORIENTATION_COLORS[selectedSnapshot.orientation],
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-muted">
                  {getScoreLabel(selectedSnapshot.overallScore)}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Tomorrow preview */}
      {tomorrowPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 p-5 border border-accent/20 rounded-lg bg-accent/5"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent mb-2">
            Mañana
          </p>
          <p className="text-sm font-medium text-foreground">
            Tu energía será de tema{" "}
            <span className="font-semibold">{tomorrowPreview.theme}</span>.
          </p>
          <p className="text-xs text-muted mt-1.5">
            Volvé a ver cómo se conecta con tu{" "}
            <span className="text-foreground">{tomorrowPreview.yearTheme}</span>.
          </p>
          <div className="mt-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
            >
              Ver detalle en tu mapa
              <ChevronRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}