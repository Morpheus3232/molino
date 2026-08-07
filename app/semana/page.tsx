"use client";

import { useMemo, useState } from "react";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/lib/hooks/useProfile";
import { analyzeTiming, type TimingIntention, INTENTION_LABELS } from "@/lib/engines/timingEngine";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { getScoreColor } from "@/lib/utils/score";
import { formatDate } from "@/lib/i18n/format";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";

const INTENTION_OPTIONS: { id: TimingIntention; label: string; emoji: string }[] = [
  { id: "start_project", label: "Empezar un proyecto", emoji: "🚀" },
  { id: "make_decision", label: "Tomar una decisión", emoji: "⚡" },
  { id: "start_relationship", label: "Empezar una relación", emoji: "💫" },
];

export default function SemanaPage() {
  return (
    <Suspense fallback={null}>
      <SemanaContent />
    </Suspense>
  );
}

function SemanaContent() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const [intention, setIntention] = useState<TimingIntention>("start_project");

  const elementColor = profile ? ELEMENT_COLORS[profile.element] || "var(--color-accent)" : "var(--color-accent)";

  // Get Monday to Sunday of current week
  const weekDays = useMemo(() => {
    if (!profile) return [];
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [profile]);

  const weekResults = useMemo(() => {
    if (!profile || weekDays.length === 0) return [];
    return weekDays.map(d => analyzeTiming(profile, d, intention));
  }, [profile, weekDays, intention]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = today.toISOString().split("T")[0];

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
          <div className="animate-pulse space-y-6">
            <div className="h-3 bg-[var(--skeleton)] rounded w-32" />
            <div className="h-10 bg-[var(--skeleton)] rounded w-3/4" />
            <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-24 text-center">
          <p className="eyebrow-brutalist mb-4">Tu semana</p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground mb-4">
            Creá tu mapa primero
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Necesitás tu perfil para ver el timing de tu semana.
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push("/")}>
            Crear mi mapa
          </Button>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  const weekRange = weekDays.length >= 2
    ? `${formatDate(weekDays[0], { day: "numeric", month: "long" })} – ${formatDate(weekDays[6], { day: "numeric", month: "long" })}`
    : "";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24" id="main-content">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="border-t border-ink/10 py-10 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span aria-hidden="true">›</span>
            <Link href="/hoy" className="hover:text-foreground transition-colors">Hoy</Link>
            <span aria-hidden="true">›</span>
            <span className="text-foreground font-medium">Semana</span>
          </nav>

          <p className="eyebrow-brutalist mb-4">Tu semana</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.9] tracking-tight">
            {formatDate(new Date(), { weekday: "long" })}
          </h1>
          <p className="text-sm text-muted mt-3">{weekRange}</p>
        </motion.div>

        {/* Selector de intención */}
        <div className="flex flex-wrap gap-2 mb-8">
          {INTENTION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setIntention(opt.id)}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium transition-colors ${
                intention === opt.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-ink/10 text-muted hover:border-ink/20 hover:text-foreground"
              }`}
            >
              <span aria-hidden="true">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* 7 días de la semana */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-px bg-ink/10">
          {weekResults.map((day, i) => {
            const color = getScoreColor(day.timingScore);
            const isTodayCell = day.date === todayKey;
            const date = new Date(day.date + "T12:00:00");
            const dayName = date.toLocaleDateString("es-AR", { weekday: "short" });
            const dayNum = date.getDate();

            return (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className={`bg-background p-4 sm:p-5 flex flex-col items-center text-center ${
                  isTodayCell ? "ring-2 ring-accent" : ""
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{dayName}</span>
                <span className={`font-display text-2xl mt-1 ${isTodayCell ? "text-accent" : "text-foreground"}`}>{dayNum}</span>
                {isTodayCell && (
                  <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent font-semibold">HOY</span>
                )}
                <span
                  className="mt-2 w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2"
                  style={{
                    borderColor: color,
                    color: isTodayCell ? "var(--color-background)" : color,
                    backgroundColor: isTodayCell ? color : `${color}12`,
                  }}
                >
                  {day.timingScore}
                </span>
                <span className="mt-2 text-xs text-muted leading-tight line-clamp-2 min-h-[2rem]">
                  {day.theme}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Detalle del día actual */}
        {weekResults.length > 0 && (() => {
          const todayResult = weekResults.find(d => d.date === todayKey);
          if (!todayResult) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="border border-ink/10 p-6 mt-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="eyebrow-brutalist">Tu día de hoy</span>
                <span
                  className="text-xs font-mono uppercase tracking-[0.1em] px-2 py-0.5 border border-ink/10"
                  style={{ color: getScoreColor(todayResult.timingScore) }}
                >
                  {todayResult.theme}
                </span>
              </div>
              <p className="text-base text-foreground leading-relaxed">{todayResult.explanation}</p>
              <p className="text-sm text-muted mt-3">{todayResult.recommendedWindow}</p>
            </motion.div>
          );
        })()}

        <div className="mt-8">
          <Link href="/hoy" className="text-sm text-accent hover:underline">
            ← Volver a Hoy
          </Link>
        </div>
      </main>
      <UniversityFooter />
    </div>
  );
}
