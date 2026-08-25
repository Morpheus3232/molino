"use client";

import { useMemo } from "react";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { getScoreColor } from "@/lib/utils/score";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import { formatDate } from "@/lib/i18n/format";
import Button from "@/components/ui/Button";

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

  // Mismo motor que /hoy (calculateDailyEnergy): personalDay, theme y
  // descripción reales según el perfil — no el engine de "viajes"
  // (dateVibration.ts) que mostraba un número/label desconectado del resto
  // del sitio y una leyenda genérica ("días ideales para viajar").
  const weekResults = useMemo(() => {
    if (!profile || weekDays.length === 0) return [];
    // calculateDailyEnergy().date usa toISOString() (UTC) — se pisa acá con
    // toLocalDateKey() para no correr un día en husos horarios negativos
    // (ver comentario en lib/session/dailyHistory.ts).
    return weekDays.map(d => ({ ...calculateDailyEnergy(profile, d), date: toLocalDateKey(d) }));
  }, [profile, weekDays]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toLocalDateKey(today);

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
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground mb-4">
            Creá tu mapa primero
          </h1>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Necesitás tu perfil para ver el timing de tu semana.
          </p>
          <Button variant="primary" size="lg" onClick={() => router.push("/")}>
            Generá tu mapa
          </Button>
        </div>
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
            <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Inicio</Link>
            <span aria-hidden="true">›</span>
            <Link href="/calendario" className="underline decoration-ink/25 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">Calendario</Link>
            <span aria-hidden="true">›</span>
            <span className="text-foreground font-medium">Semana</span>
          </nav>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[0.9] tracking-tight">
            {formatDate(new Date(), { weekday: "long" })}
          </h1>
          <p className="text-sm text-muted mt-3">{weekRange}</p>
        </motion.div>

        {/* 7 días de la semana — mismo personalDay/theme/score que /hoy y
            /calendario, no un engine propio de "viajes" desconectado. */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-px bg-ink/10">
          {weekResults.map((day, i) => {
            const color = getScoreColor(day.overallScore);
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
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{dayName}</span>
                <span className={`font-heading text-2xl mt-1 ${isTodayCell ? "text-accent" : "text-foreground"}`}>{dayNum}</span>
                {isTodayCell && (
                  <span className="mt-0.5 font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">HOY</span>
                )}
                <span
                  className="mt-2 w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2"
                  style={{
                    borderColor: color,
                    color: isTodayCell ? "var(--color-background)" : color,
                    backgroundColor: isTodayCell ? color : `${color}12`,
                  }}
                >
                  {day.personalDay}
                </span>
                {/* Solo el theme (Armonía, Introspección...) — el label de
                    energía (Alta/Moderada) se repetía casi todos los días
                    y era ruido: el color del círculo ya lo comunica. */}
                <span className="mt-2 text-xs font-semibold text-foreground leading-tight">
                  {day.theme}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Detalle del día actual — misma descripción real que muestra /hoy
            para ese personalDay, no un texto de plantilla por tema. */}
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
                <h3 className="font-display text-xl sm:text-2xl tracking-tight text-foreground">Tu día de hoy</h3>
                <span
                  className="text-xs font-mono uppercase tracking-[0.2em] px-2 py-0.5 border border-ink/10"
                  style={{ color: getScoreColor(todayResult.overallScore) }}
                >
                  Día {todayResult.personalDay} · {todayResult.theme}
                </span>
              </div>
              <p className="text-base text-foreground leading-relaxed">
                {todayResult.description}
              </p>
            </motion.div>
          );
        })()}

        <div className="mt-8">
          <Link href="/calendario" className="text-sm text-accent hover:underline">
            ← Volver al calendario
          </Link>
        </div>
      </main>
    </div>
  );
}
