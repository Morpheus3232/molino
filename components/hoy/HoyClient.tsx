"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { buildConvergence } from "@/lib/engines/convergentEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import { buildMomentState } from "@/lib/engines/synthesisEngine";
import { buildOrientation } from "@/lib/utils/orientation";
import { getTopAffinityHighlights, TIER_META } from "@/lib/engines/affinityEngine";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import {
  recordDailySnapshot,
  getPreviousSnapshot,
  toLocalDateKey,
  type Orientation,
  type EnergyLevel,
} from "@/lib/session/dailyHistory";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import Link from "next/link";

function getEnergyLevel(score: number): EnergyLevel {
  if (score >= 75) return "ALTA";
  if (score >= 55) return "MEDIA";
  return "BAJA";
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
    // Orientación canónica del momento — misma fuente que MomentOrientation en /profile.
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
    });
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
      energyLevel: getEnergyLevel(data.energy.overallScore),
      decisionPosture,
      decisionCopy: DECISION_COPY[decisionPosture],
      topStrengths: data.energy.strengths.slice(0, 3),
      dateLabel: today.toLocaleDateString("es-AR", {
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
    energyLevel,
    decisionPosture,
    decisionCopy,
    topStrengths,
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
        <motion.div
          {...fadeUp}
          className="border-t border-ink/10 py-10 sm:py-16"
        >
          <nav className="flex items-center gap-2 text-xs text-muted mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Hoy</span>
          </nav>

          <p className="eyebrow-brutalist mb-4">HOY · {dateLabel}</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            TU DÍA, EN PERSPECTIVA.
          </h1>
          <p className="text-sm text-muted mt-4">
            Una lectura de tu mapa aplicado al momento que estás viviendo.
          </p>
          <AnimatePresence>
            {snapshotSaved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-xs text-muted mt-2"
              >
                Tu día quedó guardado.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 1 · TU ENERGÍA — nivel, tema, luna y qué favorece hoy, en un solo golpe de vista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border border-ink/10 p-8 lg:p-12"
        >
          <p className="label-micro mb-1">Tu energía</p>
          <p
            className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-4"
            style={{ color: scoreStyle }}
          >
            {energyLevel}
          </p>
          <p className="text-xs text-muted mb-6">
            {energy.theme} · Luna {energy.moonPhase.phase}
          </p>
          <p className="font-heading text-lg sm:text-xl text-foreground leading-relaxed max-w-2xl">
            {energy.description}
          </p>
          {topStrengths.length > 0 && (
            <ul className="flex flex-wrap gap-x-2 gap-y-2 mt-6">
              {topStrengths.map((s, i) => (
                <li
                  key={i}
                  className="text-xs text-muted border border-ink/10 rounded-full px-3 py-1"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* 2 · TU MOMENTO — postura de decisión y por qué, seguido de la acción directa si hay algo que decidir */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6 border border-ink/10 p-8 lg:p-12"
        >
          <p className="eyebrow-brutalist mb-4">Tu momento</p>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-4">
            <p
              className="text-3xl sm:text-4xl font-display font-bold tracking-tight"
              style={{ color: getScoreStyle(timing.timingScore) }}
            >
              {decisionPosture}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xs text-muted">{timing.timingScore}/100</p>
              <Button variant="secondary" size="md" onClick={() => router.push("/timing")}>
                Ver mi timing
              </Button>
            </div>
          </div>

          {previousSnapshot && (
            <p className="text-xs text-muted mb-4">
              Ayer fue <span className="font-medium text-foreground">{previousSnapshot.orientation}</span>.
            </p>
          )}

          <p className="text-sm text-foreground leading-relaxed max-w-2xl">{timing.explanation}</p>

          {timing.favorableDimensions.length > 0 && (
            <ul className="flex flex-wrap gap-x-2 gap-y-2 mt-4">
              {timing.favorableDimensions.map((dim, i) => (
                <li key={i} className="text-xs text-accent border border-accent/20 rounded-full px-3 py-1">
                  {dim}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 border-t border-ink/10 pt-6 text-center">
            <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-[0.9] tracking-tight mb-3">
              {decisionCopy.title}
            </h2>
            <p className="text-sm text-muted mb-6 max-w-md mx-auto">{decisionCopy.body}</p>
            <Button variant="primary" size="lg" onClick={() => router.push("/decisions")}>
              {decisionCopy.cta}
            </Button>
          </div>
        </motion.div>

        {/* 3 · QUÉ HACER HOY — favorece / evitá / momento recomendado, sin inventar más allá de lo que ya calculan los engines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6 p-8 lg:p-12"
        >
          <p className="eyebrow-brutalist mb-6">Qué hacer hoy</p>

          <div>
            <p className="label-micro mb-2 text-accent">Favorece</p>
            <p className="text-base text-foreground leading-relaxed">{moment.orientation}</p>
          </div>

          {energy.cautions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-ink/10">
              <p className="label-micro mb-2 text-muted">Evitá</p>
              <p className="text-sm text-foreground leading-relaxed">{energy.cautions.join(" · ")}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-ink/10">
            <p className="label-micro mb-2">Momento recomendado</p>
            <p className="text-sm text-foreground leading-relaxed">{timing.recommendedWindow}</p>
          </div>
        </motion.div>

        {/* 4 · TU DÍA EN UNA FRASE — conclusión, no otra introducción: compone lo ya mostrado, no agrega una lectura nueva */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6 border-t border-ink/10 pt-12 text-center"
        >
          <p className="font-display text-2xl sm:text-3xl text-foreground leading-snug tracking-tight max-w-2xl mx-auto">
            Un día de {energy.theme.toLowerCase()} para {decisionPosture.toLowerCase()}.
          </p>
        </motion.div>

        {/* 5 · EXPLORAR MÁS — solo después de lo útil; un CTA por destino, sin competir entre sí */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-10 border-t border-ink/10 pt-12"
        >
          <p className="eyebrow-brutalist mb-6">Explorar más</p>

          {topAffinities.length > 0 && (
            <div className="mb-8">
              <p className="label-micro mb-3 text-muted">Relaciones</p>
              <ul className="space-y-0">
                {topAffinities.map((r) => (
                  <li key={r.entity.id}>
                    <Link
                      href={`/affinity/${r.entity.type}/${r.entity.id}`}
                      className="group flex items-center justify-between gap-4 py-4 border-b border-ink/10 hover:border-accent/40 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0" aria-hidden="true">
                          {r.entity.emoji}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-muted">
                            {ENTITY_TYPES[r.entity.type]?.label ?? r.entity.type}
                          </span>
                          <span className="block font-heading text-base text-foreground truncate group-hover:text-accent transition-colors">
                            {r.entity.name}
                          </span>
                        </span>
                      </span>
                      <span className="text-xs shrink-0" style={{ color: TIER_META[r.tier].color }}>
                        {TIER_META[r.tier].label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/affinity" className="inline-flex items-center gap-2 text-sm text-accent hover:underline mt-4">
                Ver todas mis afinidades →
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-px bg-ink/10">
            <Link href="/profile" className="bg-background p-6 text-center group transition-colors hover:bg-accent/5">
              <p className="font-display text-lg text-foreground group-hover:text-accent transition-colors">Mi mapa</p>
            </Link>
            <Link href="/evolution" className="bg-background p-6 text-center group transition-colors hover:bg-accent/5">
              <p className="font-display text-lg text-foreground group-hover:text-accent transition-colors">Tu recorrido</p>
            </Link>
          </div>

          <details className="mt-8 group">
            <summary className="text-sm text-muted cursor-pointer hover:text-accent transition-colors list-none flex items-center gap-2">
              <span aria-hidden="true" className="group-open:rotate-90 transition-transform">
                ›
              </span>
              Interpretación de Molino y detalle técnico
            </summary>
            <div className="mt-6">
              <MolinoInterpretation
                profile={profile}
                type="daily_energy"
                dailyEnergy={energy}
                label="Interpretación de Molino"
                description="Análisis personalizado de tu día"
              />
            </div>
            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm border-t border-ink/10 pt-6">
              <div>
                <dt className="label-micro mb-1">Energía exacta</dt>
                <dd className="text-foreground">{energy.overallScore}/100</dd>
              </div>
              <div>
                <dt className="label-micro mb-1">Timing exacto</dt>
                <dd className="text-foreground">{timing.timingScore}/100</dd>
              </div>
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

          <div className="mt-10 pt-8 border-t border-ink/10 text-center">
            {previousSnapshot ? (
              <Link href="/evolution" className="text-sm text-muted hover:text-accent transition-colors">
                Ver cómo viene tu recorrido →
              </Link>
            ) : (
              <p className="text-sm text-muted">
                Mañana tu energía y tu orientación pueden cambiar.{" "}
                <Link href="/evolution" className="text-accent hover:underline">
                  Volvé para verlo.
                </Link>
              </p>
            )}
          </div>
        </motion.div>
        </main>

        <UniversityFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
