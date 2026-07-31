"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { buildConvergence } from "@/lib/engines/convergentEngine";
import { analyzeTiming } from "@/lib/engines/timingEngine";
import { buildMomentState } from "@/lib/engines/synthesisEngine";
import MolinoInterpretation from "@/components/ui/MolinoInterpretation";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import Link from "next/link";

function getEnergyLevel(score: number): string {
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

type Orientation = "ACTUAR" | "ESPERAR" | "OBSERVAR";

/** Orientación del momento — deriva de timing.timingScore, sin tocar el engine. */
function getOrientation(timingScore: number): Orientation {
  if (timingScore >= 70) return "ACTUAR";
  if (timingScore >= 50) return "ESPERAR";
  return "OBSERVAR";
}

const ORIENTATION_COPY: Record<Orientation, { headline: string; detail: string }> = {
  ACTUAR: {
    headline: "Es momento de actuar",
    detail: "Las condiciones acompañan avanzar con lo que tenías en mente.",
  },
  ESPERAR: {
    headline: "Es momento de esperar",
    detail: "Conviene dejar que las cosas maduren un poco más antes de comprometerte.",
  },
  OBSERVAR: {
    headline: "Es momento de observar",
    detail: "El día pide juntar información antes de tomar una posición.",
  },
};

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

export default function HoyClient() {
  const router = useRouter();
  const { profile, mounted, loading } = useProfile({ redirectIfNotFound: false });
  const today = useMemo(() => new Date(), []);

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

    return { energy, convergence, timing, momentState };
  }, [profile, today]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24">
          <p
            className="sr-only"
            role="status"
            aria-label="Preparando tu día..."
          >
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
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
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
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingState message="Preparando tu día..." />
        <UniversityFooter />
      </div>
    );
  }

  const { energy, convergence, timing, momentState } = data;
  const scoreStyle = getScoreStyle(energy.overallScore);
  const energyLevel = getEnergyLevel(energy.overallScore);
  const orientation = getOrientation(timing.timingScore);
  const orientationCopy = ORIENTATION_COPY[orientation];
  const decisionCopy = DECISION_COPY[orientation];
  const topStrengths = energy.strengths.slice(0, 3);
  const dateLabel = today.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background">
      <main
        className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-24"
        id="main-content"
      >
        <motion.div
          {...fadeUp}
          className="border-t border-ink/10 py-10 sm:py-16"
        >
          <p className="eyebrow-brutalist mb-4">HOY · {dateLabel}</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            TU DÍA, EN PERSPECTIVA.
          </h1>
          <p className="text-sm text-muted mt-4">
            Una lectura de tu mapa aplicado al momento que estás viviendo.
          </p>
        </motion.div>

        {/* HERO — el nivel de energía y la frase humana lideran; el score queda secundario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-ink/10 p-8 lg:p-12"
        >
          <p className="label-micro mb-1">Energía de hoy</p>
          <p
            className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-4"
            style={{ color: scoreStyle }}
          >
            {energyLevel}
          </p>
          <p className="text-lg sm:text-xl font-heading text-foreground leading-relaxed max-w-2xl">
            {energy.description}
          </p>
          <p className="text-xs text-muted mt-4">
            {energy.theme} · Luna {energy.moonPhase.phase}
          </p>
        </motion.div>

        {/* INSIGHT PRINCIPAL — interpretación humana determinística, no lenguaje de algoritmo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 border border-ink/10 p-8 lg:p-12"
        >
          <p className="eyebrow-brutalist mb-4">LO MÁS IMPORTANTE DE HOY</p>
          <p className="font-heading text-xl sm:text-2xl text-foreground leading-relaxed">
            {energy.explanation}
          </p>
          <p className="text-xs text-muted mt-6">
            {convergence.convergentCount} de {convergence.totalLayers} capas de tu mapa coinciden hoy.
          </p>
        </motion.div>

        {/* QUÉ HACER HOY — acciones concretas derivadas de energy.strengths, no un informe de fortalezas/debilidades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 border border-ink/10 p-8 lg:p-12"
        >
          <p className="eyebrow-brutalist mb-4">QUÉ HACER HOY</p>
          <ul className="space-y-3">
            {topStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-sm text-muted font-medium mt-0.5 w-4 shrink-0">
                  {i + 1}
                </span>
                <span className="text-base text-foreground leading-relaxed">
                  {s}
                </span>
              </li>
            ))}
          </ul>
          {energy.cautions.length > 0 && (
            <p className="text-xs text-muted mt-6 pt-4 border-t border-ink/10">
              Cuidado con: {energy.cautions.join(", ")}.
            </p>
          )}
        </motion.div>

        {/* MOMENTO PARA ACTUAR — orientación primero, score secundario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 border border-ink/10 p-8 lg:p-12"
        >
          <p className="eyebrow-brutalist mb-4">MOMENTO PARA ACTUAR</p>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-4">
            <p
              className="text-3xl sm:text-4xl font-display font-bold tracking-tight"
              style={{ color: getScoreStyle(timing.timingScore) }}
            >
              {orientation}
            </p>
            <div className="flex items-center gap-4">
              <p className="text-xs text-muted">{timing.timingScore}/100</p>
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push("/timing")}
              >
                Ver mi timing
              </Button>
            </div>
          </div>
          <p className="text-base text-foreground leading-relaxed max-w-2xl">
            {orientationCopy.detail}
          </p>

          {timing.favorableDimensions.length > 0 && (
            <div className="mt-6">
              <p className="label-micro mb-3 text-accent">Favorece</p>
              <ul className="space-y-2">
                {timing.favorableDimensions.map((dim, i) => (
                  <li
                    key={i}
                    className="text-sm text-foreground flex items-start gap-3"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"
                      aria-hidden="true"
                    />
                    {dim}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {timing.recommendedWindow && (
            <div className="mt-6 border-t border-ink/10 pt-4">
              <p className="label-micro mb-2">Ventana recomendada</p>
              <p className="text-sm text-foreground leading-relaxed">
                {timing.recommendedWindow}
              </p>
            </div>
          )}
        </motion.div>

        {/* CONTEXTO PERSONAL — los números aparecen contextualizados, no aislados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 border-t border-ink/10 pt-12"
        >
          <p className="eyebrow-brutalist mb-4">TU CICLO</p>
          <p className="text-sm text-muted mb-3">
            Año personal {momentState.personalYear} · Mes {momentState.personalMonth} · Día {momentState.personalDay}
          </p>
          <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-2xl">
            {momentState.cycleDescription}
          </p>
        </motion.div>

        {/* DECISIONES — CTA coherente con la orientación del momento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 border-t border-ink/10 pt-12 text-center"
        >
          <p className="eyebrow-brutalist mb-4">DECISIONES</p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground leading-[0.9] tracking-tight mb-4">
            {decisionCopy.title}
          </h2>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            {decisionCopy.body}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/decisions")}
          >
            {decisionCopy.cta}
          </Button>
        </motion.div>

        {/* PROFUNDIZAR — detalle técnico disponible pero subordinado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 border-t border-ink/10 pt-12"
        >
          <p className="eyebrow-brutalist mb-6">PROFUNDIZAR</p>

          <details className="mb-6 group">
            <summary className="text-sm text-muted cursor-pointer hover:text-accent transition-colors list-none flex items-center gap-2">
              <span aria-hidden="true" className="group-open:rotate-90 transition-transform">
                ›
              </span>
              Ver detalle técnico
            </summary>
            <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <dt className="label-micro mb-1">Energía exacta</dt>
                <dd className="text-foreground">{energy.overallScore}/100</dd>
              </div>
              <div>
                <dt className="label-micro mb-1">Timing exacto</dt>
                <dd className="text-foreground">{timing.timingScore}/100</dd>
              </div>
              <div>
                <dt className="label-micro mb-1">Fase lunar</dt>
                <dd className="text-foreground">{energy.moonPhase.phase}</dd>
              </div>
              <div>
                <dt className="label-micro mb-1">Elemento</dt>
                <dd className="text-foreground">{energy.elementInfluence}</dd>
              </div>
            </dl>
          </details>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink/10">
            <Link
              href="/daily-energy"
              className="bg-background p-6 text-center group transition-colors hover:bg-accent/5"
            >
              <p className="font-display text-lg text-foreground group-hover:text-accent transition-colors">
                Energía
              </p>
            </Link>
            <Link
              href="/timing"
              className="bg-background p-6 text-center group transition-colors hover:bg-accent/5"
            >
              <p className="font-display text-lg text-foreground group-hover:text-accent transition-colors">
                Timing
              </p>
            </Link>
            <Link
              href="/decisions"
              className="bg-background p-6 text-center group transition-colors hover:bg-accent/5"
            >
              <p className="font-display text-lg text-foreground group-hover:text-accent transition-colors">
                Decisiones
              </p>
            </Link>
            <Link
              href="/profile"
              className="bg-background p-6 text-center group transition-colors hover:bg-accent/5"
            >
              <p className="font-display text-lg text-foreground group-hover:text-accent transition-colors">
                Mi mapa
              </p>
            </Link>
          </div>
        </motion.div>

        {/* IA — enriquecimiento opcional, nunca fuente principal de verdad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-6"
        >
          <MolinoInterpretation
            profile={profile}
            type="daily_energy"
            dailyEnergy={energy}
            label="Interpretación de Molino"
            description="Análisis personalizado de tu día"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 border-t border-ink/10 pt-8 flex flex-col sm:flex-row gap-3"
        >
          <Button
            variant="secondary"
            fullWidth
            onClick={() => router.push("/decisions")}
          >
            Analizar una decisión
          </Button>
          <Button
            variant="ghost"
            fullWidth
            onClick={() => router.push("/profile")}
          >
            Ver mi mapa
          </Button>
        </motion.div>
      </main>

      <UniversityFooter />
    </div>
  );
}
