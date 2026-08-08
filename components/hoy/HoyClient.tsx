"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy, type DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import { buildConvergence, type Convergence } from "@/lib/engines/convergentEngine";
import { analyzeTiming, type TimingResult } from "@/lib/engines/timingEngine";
import { buildMomentState, type MomentState } from "@/lib/engines/synthesisEngine";
import { buildOrientation, type OrientationData } from "@/lib/utils/orientation";
import { getTopAffinityHighlights, type AffinityResult } from "@/lib/engines/affinityEngine";
import { getScoreLabel, getScoreColor } from "@/lib/utils/score";
import {
  recordDailySnapshot,
  getPreviousSnapshot,
  computeStreak,
  toLocalDateKey,
  type Orientation,
  type EnergyLevel,
  type DailySnapshot,
} from "@/lib/session/dailyHistory";
import { Plane, Briefcase, type LucideIcon } from "lucide-react";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { formatDate } from "@/lib/i18n/format";
import { resolveUserContext } from "@/lib/context/userContext";
import VibrationCalendar from "@/components/timing/VibrationCalendar";
import { type TopicId } from "@/lib/utils/dateVibration";
import HoyBaseEnergy from "@/components/hoy/HoyBaseEnergy";
import EnergyRing from "@/components/hoy/EnergyRing";
import { getGenericDailyEnergy } from "@/lib/utils/daily-energy-utils";

function getEnergyLevel(score: number): EnergyLevel {
  if (score >= 75) return "ALTA";
  if (score >= 55) return "MEDIA";
  return "BAJA";
}

function getDecisionPosture(timingScore: number): Orientation {
  if (timingScore >= 70) return "ACTUAR";
  if (timingScore >= 50) return "ESPERAR";
  return "OBSERVAR";
}

const DECISION_COPY: Record<Orientation, { title: string; body: string; cta: string }> = {
  ACTUAR: {
    title: "Actuar",
    body: "La energía apoya la iniciativa. Es momento de avanzar con decisiones importantes.",
    cta: "Ver qué decisiones apoya tu mapa",
  },
  ESPERAR: {
    title: "Esperar",
    body: "La energía sugiere pausa. Reúne información, pero no cierres nada definitivo aún.",
    cta: "Ver qué decisiones requieren esperar",
  },
  OBSERVAR: {
    title: "Observar",
    body: "La energía está en transición. Mantente atento a señales antes de mover ficha.",
    cta: "Ver qué decisiones requieren observar",
  },
};

function buildContinuityLine(
  previous: DailySnapshot | null,
  theme: string,
  score: number
): string {
  if (!previous) return "Primer registro — empieza tu continuidad.";
  const delta = score - (previous.overallScore ?? 50);
  const deltaLabel = delta > 2 ? "subió" : delta < -2 ? "bajó" : "se sostuvo";
  if (previous.theme === theme) {
    return `Sigue siendo un día de ${theme.toLowerCase()} — tu energía ${deltaLabel} respecto a ayer.`;
  }
  return `Ayer fue ${previous.theme.toLowerCase()}. Hoy es ${theme.toLowerCase()} y tu energía ${deltaLabel}.`;
}

interface DayState {
  energy: DailyEnergyResult;
  convergence: Convergence;
  timing: TimingResult;
  momentState: MomentState;
  moment: OrientationData;
  topAffinities: AffinityResult[];
}

const TOPIC_OPTIONS: { id: TopicId; label: string; icon: LucideIcon }[] = [
  { id: "viajes", label: "Viajar", icon: Plane },
  { id: "negocios", label: "Emprender / Negocios", icon: Briefcase },
];

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function HoyClient() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const [dayState, setDayState] = useState<DayState | null>(null);
  const [snapshotSaved, setSnapshotSaved] = useState(false);
  const [streak, setStreak] = useState<{ days: number; orientation: Orientation } | null>(null);
  const [previousSnapshot, setPreviousSnapshot] = useState<DailySnapshot | null>(null);
  const [topic, setTopic] = useState<TopicId>("viajes");
  const [calcFailed, setCalcFailed] = useState(false);

  useEffect(() => {
    if (!mounted || !profile) return;
    try {
      const today = new Date();
      const todayStr = toLocalDateKey(today);
      const userCtx = resolveUserContext();
      const energy = calculateDailyEnergy(profile, today);
      const convergence = buildConvergence(profile);
      const timing = analyzeTiming(profile, today, "start_project");
      const momentState = buildMomentState(profile, energy.overallScore, energy.theme);
      const moment = buildOrientation(energy, momentState, timing);
      const topAff = getTopAffinityHighlights(profile);

      setDayState({ energy, convergence, timing, momentState, moment, topAffinities: topAff });
      setPreviousSnapshot(getPreviousSnapshot(profile.birthDate, todayStr));
      setStreak(computeStreak(profile.birthDate));
      recordDailySnapshot({
        date: todayStr,
        profileKey: profile.birthDate,
        orientation: getDecisionPosture(timing.timingScore),
        energyLevel: getEnergyLevel(energy.overallScore),
        theme: energy.theme,
        overallScore: energy.overallScore,
        personalDay: momentState.personalDay,
      });
      setSnapshotSaved(true);
      const timeout = setTimeout(() => setSnapshotSaved(false), 2500);
      return () => clearTimeout(timeout);
    } catch (err) {
      console.error("[Hoy] Error calculando el día:", err);
      setCalcFailed(true);
    }
  }, [profile, mounted]);

  const derived = useMemo(() => {
    if (!dayState) return null;
    const decisionPosture = getDecisionPosture(dayState.timing.timingScore);
    return {
      ...dayState,
      scoreStyle:
        dayState.energy.overallScore >= 75
          ? "var(--score-excellent)"
          : dayState.energy.overallScore >= 55
            ? "var(--score-good)"
            : dayState.energy.overallScore >= 40
              ? "var(--score-neutral)"
              : "var(--score-poor)",
      decisionPosture,
      decisionCopy: DECISION_COPY[decisionPosture],
      dateLabel: formatDate(new Date(), {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  }, [dayState]);

  const calendarDates = useMemo(() => {
    const dates: string[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(toLocalDateKey(d));
    }
    return dates;
  }, []);

  const {
    energy,
    convergence,
    timing,
    momentState,
    moment,
    scoreStyle,
    decisionPosture,
    decisionCopy,
    topAffinities: affinities,
    dateLabel,
  } = derived ?? ({} as NonNullable<typeof derived>);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading || !mounted || (profile && !dayState && !calcFailed) ? (
          <motion.div
            key="loading"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
              <p className="sr-only" role="status" aria-label="Preparando tu día...">
                Preparando tu día...
              </p>
              <div className="animate-pulse space-y-6">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2" />
                <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-lg" />
                <div className="h-96 bg-[var(--skeleton)] border border-ink/10 rounded-lg" />
              </div>
              <UniversityFooter />
            </div>
          </motion.div>
        ) : !profile ? (
          <HoyBaseEnergy data={getGenericDailyEnergy(new Date())} />
        ) : (
          <motion.div
            key="content"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <main
              className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24"
              id="main-content"
            >
              {/* ═══════════════════════════════════════════════
                  01 · HERO — fecha, anillo de energía, frase protagonista
                  ═══════════════════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-ink/10 py-12 sm:py-16"
              >
                <nav className="flex items-center gap-2 text-xs text-muted mb-8" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
                  <span aria-hidden="true">›</span>
                  <span className="text-foreground font-medium">Hoy</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
                  {/* Anillo de energía */}
                  <div className="flex justify-center md:justify-start">
                    <EnergyRing score={energy.overallScore} label="energía" />
                  </div>

                  {/* Score + frase */}
                  <div>
                    <p className="text-sm text-muted mb-3">TU DÍA · {dateLabel}</p>
                    <p
                      className="text-5xl sm:text-6xl font-display font-bold tracking-tight leading-[0.9]"
                      style={{ color: scoreStyle }}
                    >
                      {getScoreLabel(energy.overallScore)}
                    </p>
                    <p className="text-sm text-muted mt-3">
                      {energy.theme} · Luna {energy.moonPhase.phase} {energy.moonPhase.emoji}
                    </p>
                    <p className="font-heading text-xl sm:text-2xl text-foreground leading-relaxed max-w-2xl mt-6">
                      {energy.description}
                    </p>
                    <p className="text-sm text-accent mt-4 max-w-xl">
                      {buildContinuityLine(previousSnapshot, energy.theme, energy.overallScore)}
                    </p>
                    {streak && streak.days >= 2 && (
                      <p className="text-xs text-muted mt-2">
                        Continuidad: {streak.days} días en postura de{" "}
                        <span className="font-medium text-foreground">{streak.orientation.toLowerCase()}</span>.
                      </p>
                    )}
                    <AnimatePresence>
                      {snapshotSaved && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs text-muted mt-4"
                        >
                          Tu día quedó registrado.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Micro-stats concretas */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-ink/10 border border-ink/10 mt-12">
                  {[
                    { label: "Tema", value: energy.theme, sub: energy.elementInfluence },
                    { label: "Luna", value: energy.moonPhase.phase, sub: "Sincronía lunar" },
                    { label: "Ventana", value: timing.recommendedWindow, sub: "Timing hoy" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-background p-4 sm:p-5">
                      <p className="label-micro text-muted mb-1">{stat.label}</p>
                      <p className="font-heading text-lg sm:text-xl text-foreground leading-tight">{stat.value}</p>
                      {stat.sub && <p className="text-xs text-muted mt-1">{stat.sub}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ═══════════════════════════════════════════════
                  02 · POSTURA DE DECISIÓN — qué hacer hoy
                  ═══════════════════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-ink/10 py-12 sm:py-16"
              >
                <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight text-foreground mb-4">
                  Tu momento
                </h2>
                <p className="label-micro text-muted mb-1">Para decidir hoy</p>

                <div className="flex items-baseline gap-4 mb-4">
                  <p
                    className="text-3xl sm:text-4xl font-display font-bold tracking-tight"
                    style={{ color: scoreStyle }}
                  >
                    {decisionPosture}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        decisionPosture === "ACTUAR"
                          ? "var(--score-excellent)"
                          : decisionPosture === "ESPERAR"
                            ? "var(--score-neutral)"
                            : "var(--score-poor)",
                      color: "var(--color-paper)",
                    }}
                  >
                    <span>{timing.timingScore}/100</span>
                    <span className="opacity-80" aria-hidden="true">·</span>
                    <span className="opacity-80">alineación</span>
                  </span>
                </div>

                <p className="text-sm text-foreground leading-relaxed max-w-2xl">{timing.explanation}</p>

                {previousSnapshot && (
                  <p className="text-xs text-muted mt-3">
                    Ayer fue <span className="font-medium text-foreground">{previousSnapshot.orientation}</span>.
                  </p>
                )}

                <p className="text-sm mt-6">
                  <Link href="/profile" className="text-accent hover:underline">
                    {decisionCopy.cta} →
                  </Link>
                </p>
              </motion.div>

              {/* ═══════════════════════════════════════════════
                  03 · QUÉ HACE TU ENERGÍA — áreas + favorece / observar
                  ═══════════════════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-ink/10 py-12 sm:py-16"
              >
                <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight text-foreground mb-6">
                  Lectura del día
                </h2>

                {/* Áreas con barras */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 mb-10">
                  {Object.entries(energy.areas).map(([key, area]) => {
                    const areaLabel =
                      key === "work" ? "Trabajo"
                        : key === "relationships" ? "Relaciones"
                          : key === "creativity" ? "Creatividad"
                            : key === "decisions" ? "Decisiones"
                              : key;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between gap-4 mb-1.5">
                          <p className="text-sm text-muted">{areaLabel}</p>
                          <p className="font-mono text-xs text-foreground">{area.score}% · {area.label}</p>
                        </div>
                        <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${area.score}%` }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: area.score >= 60 ? "var(--score-excellent)" : area.score >= 45 ? "var(--score-good)" : "var(--score-poor)" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="label-micro mb-2 text-accent">Favorece</p>
                    <p className="text-base text-foreground leading-relaxed">{moment.orientation}</p>
                  </div>

                  {energy.cautions.length > 0 && (
                    <div>
                      <p className="label-micro mb-2 text-muted">Puede ser un momento para observar</p>
                      <p className="text-sm text-foreground leading-relaxed">{energy.cautions.join(" · ")}</p>
                    </div>
                  )}

                  <div>
                    <p className="label-micro mb-2">Momento</p>
                    <p className="text-sm text-foreground leading-relaxed">{timing.recommendedWindow}</p>
                  </div>
                </div>
              </motion.div>

              {/* ═══════════════════════════════════════════════
                  04 · PRÓXIMOS DÍAS — Calendario de vibraciones
                  ═══════════════════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-ink/10 py-12 sm:py-16"
              >
                <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight text-foreground mb-4">
                  ¿Qué querés hacer?
                </h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {TOPIC_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTopic(opt.id)}
                      className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium transition-colors ${
                        topic === opt.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-ink/10 text-muted hover:border-ink/20 hover:text-foreground"
                      }`}
                    >
                      <opt.icon className="w-4 h-4" aria-hidden="true" />
                      {opt.label}
                    </button>
                  ))}
                </div>
                <VibrationCalendar topic={topic} dates={calendarDates} />
              </motion.div>

              {/* ═══════════════════════════════════════════════
                  05 · SEGUIR EL HILO — semana abreviada
                  ═══════════════════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-ink/10 py-12 sm:py-16"
              >
                <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight text-foreground mb-4">
                  Seguir el hilo
                </h2>
                <Link
                  href="/semana"
                  className="group inline-flex items-center gap-2 font-heading text-xl sm:text-2xl text-foreground hover:text-accent transition-colors"
                >
                  Ver tu semana
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>

                <details className="mt-10 group">
                  <summary className="text-sm text-muted cursor-pointer hover:text-accent transition-colors list-none flex items-center gap-2">
                    <span aria-hidden="true" className="group-open:rotate-90 transition-transform">
                      ›
                    </span>
                    Interpretación y detalle técnico
                  </summary>
                  <div className="mt-6 space-y-4 text-sm text-muted">
                    <div>
                      <p className="label-micro mb-1">Convergencia</p>
                      <p>{convergence.message}</p>
                    </div>
                    <div>
                      <p className="label-micro mb-1">Timing</p>
                      <p>{timing.explanation}</p>
                    </div>
                    <div>
                      <p className="label-micro mb-1">Momento</p>
                      <p>Año personal {momentState.personalYear} · {energy.moonPhase.phase}</p>
                    </div>
                    <div>
                      <p className="label-micro mb-1">Elemento</p>
                      <p>{energy.elementInfluence}</p>
                    </div>
                  </div>
                </details>
              </motion.div>
            </main>
            <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}