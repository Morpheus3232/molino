"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { buildConvergence } from "@/lib/engines/convergentEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import { buildMomentState } from "@/lib/engines/synthesisEngine";
import { buildOrientation } from "@/lib/utils/orientation";
import { getTopAffinityHighlights } from "@/lib/engines/affinityEngine";
import { getScoreLabel } from "@/lib/utils/score";
import {
  recordDailySnapshot,
  getPreviousSnapshot,
  computeStreak,
  toLocalDateKey,
  type Orientation,
  type EnergyLevel,
  type DailySnapshot,
} from "@/lib/session/dailyHistory";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import LocationSelector from "@/components/hoy/LocationSelector";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { formatDate } from "@/lib/i18n/format";
import { resolveUserContext } from "@/lib/context/userContext";

function getEnergyLevel(score: number): EnergyLevel {
  if (score >= 75) return "ALTA";
  if (score >= 55) return "MEDIA";
  return "BAJA";
}

/**
 * El hilo de continuidad día a día — la razón real para volver a /hoy.
 * Usa dailyHistory (ya calculado, ya guardado localmente) para que el
 * usuario sienta que Molino "recuerda" su día anterior, sin backend ni
 * notificaciones: solo comparar el snapshot de ayer con el de hoy.
 */
function buildContinuityLine(
  previous: DailySnapshot | null,
  theme: string,
  currentScore: number
): string | null {
  if (!previous) return "Volvé mañana y vas a poder comparar cómo cambió tu energía.";

  const sameTheme = previous.theme === theme;

  if (typeof previous.overallScore === "number") {
    const delta = currentScore - previous.overallScore;
    const deltaLabel =
      Math.abs(delta) < 3
        ? "se mantiene estable"
        : delta > 0
          ? `subió ${Math.round(delta)} puntos`
          : `bajó ${Math.round(Math.abs(delta))} puntos`;

    if (sameTheme) {
      return `Sigue siendo un día de ${theme.toLowerCase()} — tu energía ${deltaLabel} respecto a ayer.`;
    }
    return `Ayer fue ${previous.theme.toLowerCase()}. Hoy es ${theme.toLowerCase()} y tu energía ${deltaLabel}.`;
  }

  const currentLevel = getEnergyLevel(currentScore);
  const sameEnergy = previous.energyLevel === currentLevel;
  const prevLabel = getScoreLabel(previous.overallScore ?? 50);
  const currLabel = getScoreLabel(currentScore);
  if (sameTheme && sameEnergy) {
    return `Segundo día seguido de ${theme.toLowerCase()} — la energía se sostiene.`;
  }
  if (sameTheme) {
    return `Sigue siendo un día de ${theme.toLowerCase()}, pero con otra intensidad: ayer ${prevLabel.toLowerCase()}, hoy ${currLabel.toLowerCase()}.`;
  }
  return `Ayer fue ${previous.theme.toLowerCase()}. Hoy es ${theme.toLowerCase()} — tu energía se movió.`;
}

function getScoreStyle(score: number): string {
  return score >= 75
    ? "var(--score-excellent)"
    : score >= 55
      ? "var(--score-good)"
      : score >= 40
        ? "var(--score-neutral)"
        : "var(--score-poor)";
}

/**
 * Postura de decisión — deriva únicamente de timing.timingScore, sin tocar el engine.
 * NO es la orientación general del momento (esa es buildOrientation(), de
 * lib/utils/orientation.ts): esto responde específicamente "¿qué hago con una
 * decisión hoy?", no "¿qué significa este momento para mí?".
 */
function getDecisionPosture(timingScore: number): Orientation {
  if (timingScore >= 70) return "ACTUAR";
  if (timingScore >= 50) return "ESPERAR";
  return "OBSERVAR";
}

const DECISION_COPY: Record<Orientation, { title: string; body: string; cta: string }> = {
  ACTUAR: {
    title: "¿Tenés algo que decidir hoy?",
    body: "El momento acompaña avanzar. Usá tu mapa como segunda perspectiva y dale curso.",
    cta: "Avanzar con una decisión",
  },
  ESPERAR: {
    title: "¿Hay algo que estás por decidir?",
    body: "El momento pide pensarlo un poco más antes de comprometerte del todo.",
    cta: "Pensar una decisión",
  },
  OBSERVAR: {
    title: "¿Hay algo que estás evaluando?",
    body: "Conviene explorar la información disponible antes de decidir.",
    cta: "Explorar una decisión",
  },
};

const transitionVariants = {
  enter: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

export default function HoyClient() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const today = useMemo(() => new Date(), []);
  const [snapshotSaved, setSnapshotSaved] = useState(false);
  const [streak, setStreak] = useState<{ orientation: Orientation; days: number } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(() => {
    try { return resolveUserContext().country ?? null; } catch { return null; }
  });

  const data = useMemo(() => {
    if (!profile) return null;

    const energy = calculateDailyEnergy(profile, today);
    const convergence = buildConvergence(profile);
    const timing = analyzeTiming(profile, today, "make_decision");
    const momentState = buildMomentState(
      profile,
      energy.overallScore,
      energy.theme,
    );
    // Orientación canónica del momento — misma buildOrientation() que usaba
    // el ahora eliminado MomentOrientation de Intelligence.
    const moment = buildOrientation(energy, momentState, timing);
    const topAffinities = getTopAffinityHighlights(profile).slice(0, 2);

    return { energy, convergence, timing, momentState, moment, topAffinities };
  }, [profile, today]);

  const todayStr = useMemo(() => toLocalDateKey(today), [today]);

  const previousSnapshot = useMemo(() => {
    if (!profile || !data) return null;
    return getPreviousSnapshot(profile.birthDate, todayStr);
  }, [profile, data, todayStr]);

  useEffect(() => {
    if (!profile || !data) return;
    recordDailySnapshot({
      date: todayStr,
      profileKey: profile.birthDate,
      orientation: getDecisionPosture(data.timing.timingScore),
      energyLevel: getEnergyLevel(data.energy.overallScore),
      theme: data.energy.theme,
      overallScore: data.energy.overallScore,
      personalDay: data.momentState.personalDay,
    });
    setStreak(computeStreak(profile.birthDate));
    setSnapshotSaved(true);
    const timeout = setTimeout(() => setSnapshotSaved(false), 2500);
    return () => clearTimeout(timeout);
  }, [profile, data, todayStr]);

  const derived = useMemo(() => {
    if (!data) return null;
    const decisionPosture = getDecisionPosture(data.timing.timingScore);
    return {
      energy: data.energy,
      convergence: data.convergence,
      timing: data.timing,
      momentState: data.momentState,
      moment: data.moment,
      topAffinities: data.topAffinities,
      scoreStyle: getScoreStyle(data.energy.overallScore),
      decisionPosture,
      decisionCopy: DECISION_COPY[decisionPosture],
      dateLabel: formatDate(today, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  }, [data, today]);

  const {
    energy,
    convergence,
    timing,
    momentState,
    moment,
    scoreStyle,
    decisionPosture,
    decisionCopy,
    topAffinities,
    dateLabel,
  } = derived ?? ({} as NonNullable<typeof derived>);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading || !mounted ? (
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
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="h-64 bg-[var(--skeleton)] rounded border border-ink/10 mb-6" />
                <div className="h-40 bg-[var(--skeleton)] rounded border border-ink/10 mb-6" />
                <div className="h-40 bg-[var(--skeleton)] rounded border border-ink/10 mb-6" />
              </div>
              <UniversityFooter />
            </div>
          </motion.div>
        ) : !profile ? (
          <motion.div
            key="empty"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-24 text-center">
              <p className="eyebrow-brutalist mb-4">HOY</p>
              <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-foreground mb-4">
                Tu día, en perspectiva
              </h1>
              <p className="text-sm text-muted mb-8 max-w-md mx-auto">
                Para ver tu energía, timing y convergencia de hoy, primero
                necesitás crear tu perfil.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/onboarding")}
              >
                Crear mi perfil
              </Button>
            </div>
            <UniversityFooter />
          </motion.div>
        ) : !data ? (
          <motion.div
            key="nodata"
            variants={transitionVariants}
            initial="enter"
            animate="show"
            exit="exit"
          >
            <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
              <p className="sr-only" role="status" aria-label="Preparando tu día...">
                Preparando tu día...
              </p>
              <div className="animate-pulse">
                <div className="h-3 bg-[var(--skeleton)] rounded w-12rem mb-6" />
                <div className="h-10 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-12" />
                <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-md mb-6" />
                <div className="h-96 bg-[var(--skeleton)] border border-ink/10 rounded-md" />
              </div>
              <UniversityFooter />
            </div>
          </motion.div>
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
        {/* HERO — fecha, estado, una única frase protagonista. Nada compite acá. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="border-t border-ink/10 py-10 sm:py-16"
        >
          <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Hoy</span>
          </nav>

          <p className="eyebrow-brutalist mb-4">TU DÍA · {dateLabel}</p>
          <p
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[0.9]"
            style={{ color: scoreStyle }}
          >
            {getScoreLabel(energy.overallScore)}
          </p>
          <p className="text-xs text-muted mt-3">
            {energy.theme} · Luna {energy.moonPhase.phase}
          </p>
          <p className="font-heading text-xl sm:text-2xl text-foreground leading-relaxed max-w-2xl mt-6">
            {energy.description}
          </p>
          <p className="text-sm text-accent mt-4 max-w-xl">
            {buildContinuityLine(previousSnapshot, energy.theme, energy.overallScore)}
          </p>
          {streak && streak.days >= 2 && (
            <p className="text-xs text-muted mt-2">
              Continuidad de observación: {streak.days} días en postura de <span className="font-medium text-foreground">{streak.orientation.toLowerCase()}</span>.
            </p>
          )}
          <AnimatePresence>
            {snapshotSaved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-xs text-muted mt-4"
              >
                Tu día quedó registrado.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            UBICACIÓN — dónde estás ahora
            ═══════════════════════════════════════════════ */}
        <LocationSelector onCountryChange={setSelectedCountry} />

        {selectedCountry && topAffinities.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="border-t border-ink/10 py-6 sm:py-8"
          >
            <p className="text-sm text-muted leading-relaxed max-w-xl">
              Desde <span className="font-medium text-foreground">{selectedCountry}</span>,{" "}
              <Link
                href={`/affinity/${topAffinities[0].entity.type}/${topAffinities[0].entity.id}`}
                className="text-accent hover:underline"
              >
                {topAffinities[0].entity.name}
              </Link>{" "}
              resuena alrededor de tu energía de {profile?.chineseZodiacInfo?.animal ?? profile?.chineseZodiac}.
            </p>
          </motion.div>
        )}

        {/* TU MOMENTO — postura + por qué, en pocas líneas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-ink/10 py-10 sm:py-16"
        >
          <p className="eyebrow-brutalist mb-4">Tu momento</p>
          <p className="label-micro text-muted mb-1">Para decidir hoy</p>

          <div className="flex items-baseline gap-4 mb-4">
            <p
              className="text-3xl sm:text-4xl font-display font-bold tracking-tight"
              style={{ color: getScoreStyle(timing.timingScore) }}
            >
              {decisionPosture}
            </p>
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

        {/* QUÉ HACER — favorece / observar / momento, una idea por línea, sin cajas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-ink/10 py-10 sm:py-16"
        >
          <p className="eyebrow-brutalist mb-6">Lectura del día</p>

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

        {/* Seguir el hilo — antes era una grilla de 4 salidas de mismo peso
            (mapa/timing/relaciones/evolución) que no se desprendía de nada
            leído arriba, solo navegación genérica ya disponible en el menú.
            La única salida que sí tiene motivo narrativo acá es evolución:
            es literalmente donde se ve la racha/continuidad que esta misma
            pantalla acaba de mostrar (streak, energía de ayer vs. hoy). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-ink/10 py-10 sm:py-16"
        >
          <p className="eyebrow-brutalist mb-4">Seguir el hilo</p>
          <Link
            href="/evolution"
            className="group inline-flex items-center gap-2 font-display text-xl sm:text-2xl text-foreground hover:text-accent transition-colors"
          >
            Ver cómo vino tu semana
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>

          {!selectedCountry && topAffinities.length > 0 && (
            <p className="text-xs text-muted mt-4">
              <Link
                href={`/affinity/${topAffinities[0].entity.type}/${topAffinities[0].entity.id}`}
                className="text-accent hover:underline"
              >
                {topAffinities[0].entity.name}
              </Link>{" "}
              resuena especialmente con tu energía de {profile?.chineseZodiacInfo?.animal ?? profile?.chineseZodiac}.
            </p>
          )}

          <details className="mt-10 group">
            <summary className="text-sm text-muted cursor-pointer hover:text-accent transition-colors list-none flex items-center gap-2">
              <span aria-hidden="true" className="group-open:rotate-90 transition-transform">
                ›
              </span>
              Interpretación y detalle técnico
            </summary>
            <div className="mt-6">
              <MolinoInterpretation
                profile={profile}
                type="daily_energy"
                dailyEnergy={energy}
                label="Tu interpretación"
                description="Análisis personalizado de tu día"
              />
            </div>
            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm border-t border-ink/10 pt-6">
              <div>
                <dt className="label-micro mb-1">Elemento</dt>
                <dd className="text-foreground">{energy.elementInfluence}</dd>
              </div>
              <div>
                <dt className="label-micro mb-1">Ciclo</dt>
                <dd className="text-foreground">
                  Año {momentState.personalYear} · Mes {momentState.personalMonth} · Día {momentState.personalDay}
                </dd>
              </div>
            </dl>
            <p className="text-sm text-muted leading-relaxed mt-4">{momentState.cycleDescription}</p>
            <p className="text-xs text-muted mt-4">
              {convergence.convergentCount} de {convergence.totalLayers} capas de tu mapa coinciden hoy.
            </p>
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
