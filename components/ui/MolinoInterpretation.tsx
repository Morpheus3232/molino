"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { getProfileSalt } from "@/lib/profile-salt";
import type {
  InterpretationType,
  MolinoInterpretation,
} from "@/lib/engines/intelligenceEngine";
import type { UserProfile } from "@/types/user";
import type { CompatibilityResult } from "@/lib/engines/compatibilityEngine";
import type { DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import { INTENTION_LABELS, type TimingResult } from "@/lib/engines/timingEngine";
import type { DecisionResult } from "@/lib/engines/decisionsEngine";
import type { EntityProfile } from "@/lib/data/entities";
import BuildingMolino from "@/components/ui/BuildingMolino";
import MolinoReveal from "@/components/ui/MolinoReveal";

interface MolinoInterpretationProps {
  profile: UserProfile;
  type: InterpretationType;
  question?: string;
  compatibility?: CompatibilityResult;
  dailyEnergy?: DailyEnergyResult;
  timing?: TimingResult;
  decision?: DecisionResult;
  entity?: EntityProfile;
  showFallbackImmediately?: boolean;
  label?: string;
  description?: string;
  /** Set by PremiumGate right after a real unlock (coupon or payment) so the
   * loading state reads as part of the reveal instead of a second, unrelated
   * loading screen appearing right under the "you unlocked it" banner. */
  justUnlocked?: boolean;
  /** Recibe la interpretación una vez resuelta (AI o fallback). El padre la
   * usa para alimentar el export/share sin re-generar ni re-fetchar. */
  onInterpretationReady?: (interpretation: MolinoInterpretation | null) => void;
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {/* Apertura — aire editorial antes del contenido */}
      <div className="pt-10 sm:pt-14 pb-10 sm:pb-14">
        <div className="h-1.5 bg-border/40 rounded w-14 mb-6" />
        <div className="h-5 bg-border/40 rounded w-3/4 mb-3" />
        <div className="h-5 bg-border/40 rounded w-2/5" />
      </div>

      {/* Lede — resumen en jerarquía de titular */}
      <div className="pb-8 sm:pb-10">
        <div className="h-4 bg-border/40 rounded w-full mb-3" />
        <div className="h-4 bg-border/40 rounded w-4/5" />
      </div>

      {/* Secciones de cuerpo */}
      <div className="space-y-8 sm:space-y-10">
        {[0.6, 0.75, 0.5].map((w, i) => (
          <div key={i} className="py-5">
            <div className="h-1 bg-border/30 rounded w-16 mb-4" />
            <div className="h-3 bg-border/40 rounded w-full mb-2" />
            <div className="h-3 bg-border/40 rounded" style={{ width: `${w * 100}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Unified interpretation component for Molino.
 *
 * Shows local fallback interpretation immediately, then attempts to get
 * AI interpretation when available. Falls back gracefully to local data.
 *
 * Hierarchy:
 * 1. INSIGHT PRINCIPAL (summary)
 * 2. Qué significa (alignment)
 * 3. Por qué importa (timing/strengths)
 * 3.5. Timing para [intención] — solo si se pasó un TimingResult real
 * 4. Recomendación práctica (suggestedNextStep)
 * 5. Qué considerar (whatToConsider)
 */
export default function MolinoInterpretation({
  profile,
  type,
  question,
  compatibility,
  dailyEnergy,
  timing,
  decision,
  entity,
  showFallbackImmediately = true,
  label = "Interpretación de Molino",
  description,
  justUnlocked = false,
  onInterpretationReady,
}: MolinoInterpretationProps) {
  const [fallbackInterpretation, setFallbackInterpretation] = useState<MolinoInterpretation | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<MolinoInterpretation | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [premiumRequired, setPremiumRequired] = useState(false);
  const [hasAttemptedAI, setHasAttemptedAI] = useState(false);
  // React batches setFallbackInterpretation/setAiInterpretation/setIsInterpreting
  // together in the same render (they all happen in one fetch callback), so
  // `interpretation` and `!isInterpreting` become true in the SAME tick —
  // without this, BuildingMolino would never get to show its catch-up
  // animation, it'd just unmount the instant data arrives. revealReady is a
  // separate flag, only flipped by BuildingMolino's own onComplete once its
  // checklist has visually finished (or immediately for non-unlock flows).
  const [revealReady, setRevealReady] = useState(!justUnlocked);

  const prefersReducedMotion = useSafeReducedMotion();

  // Fetch the interpretation. Separated from the effect that triggers it to
  // avoid re-creating the callback on every render (it closes over profile).
  const fetchInterpretation = useCallback(async () => {
    try {
      setIsInterpreting(true);
      const { getPremiumTokenClient } = await import('@/lib/premium');
      const res = await fetch("/api/intelligence/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          dob: profile.birthDate,
          salt: getProfileSalt(),
          type,
          question,
          premiumToken: getPremiumTokenClient(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setPremiumRequired(true);
          setError(null);
        } else {
          setError(data.error?.message || "No pudimos interpretar tu perfil.");
        }
        setHasAttemptedAI(true);
        return;
      }
      if (data.ai) {
        setAiInterpretation(data.ai as MolinoInterpretation);
        setError(null);
      } else if (data.fallback) {
        setFallbackInterpretation(data.fallback as MolinoInterpretation);
        setError(data.error ?? null);
      } else {
        setError("No recibimos una interpretación válida.");
      }
      setHasAttemptedAI(true);
    } catch {
      setError("Hubo un problema de conexión. Reintentá en un momento.");
      setHasAttemptedAI(true);
    } finally {
      setIsInterpreting(false);
    }
  }, [profile.name, profile.birthDate, type, question]);

  // Try AI interpretation unless explicitly told to skip, or the user has
  // already asked to regenerate and we're waiting on the result.
  useEffect(() => {
    if (!hasAttemptedAI) {
      fetchInterpretation();
    }
  }, [fetchInterpretation, hasAttemptedAI]);

  // BuildingMolino's onComplete flips this — only after the checklist has
  // visually finished does the content swap in (see note above).
  const handleRevealComplete = useCallback(() => {
    setRevealReady(true);
  }, []);

  // Regenerate: clear the AI result so `interpretation` falls back to the
  // local synthesis while the new fetch runs, then re-fetch.
  const handleRegenerate = useCallback(async () => {
    setAiInterpretation(null);
    setError(null);
    setHasAttemptedAI(false);
  }, []);

  const interpretation = aiInterpretation || fallbackInterpretation;
  const isUsingAI = !!aiInterpretation;

  // Eleva la interpretación resuelta al padre (para el export/share) sin
  // re-generar: se dispara cada vez que cambia el resultado de la lectura.
  useEffect(() => {
    onInterpretationReady?.(interpretation);
  }, [interpretation, onInterpretationReady]);

  // Reveal progresivo: cada sección entra con un fade+rise breve y encadenado.
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };
  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const readingContent = (() => {
    if (!interpretation) return null;
    // Transparencia de fuente: IA o datos locales, nunca indistinguible.
    const sourceLabel = isUsingAI
      ? "Interpretación generada con IA"
      : "Interpretación generada con datos locales";
    // Nota epistemológica: siempre presente, sin duplicar la etiqueta de fuente
    // ("datos locales" ya aparece en la etiqueta del fallback).
    const epistemologicalNote = interpretation.limitations.find(
      (l) => !/datos locales/i.test(l)
    );
    return (
      <motion.div
        key={isUsingAI ? "ai" : "local"}
        variants={containerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        animate="show"
      >
        {/* 00. Apertura — solo en la síntesis premium (personal_profile) */}
        {interpretation.opening && (
          <motion.div variants={itemVariants} className="pt-10 sm:pt-14 pb-8 sm:pb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
              Tu lectura
            </p>
            <p className="font-heading text-base leading-[1.6] text-foreground sm:text-lg">
              {interpretation.opening}
            </p>
          </motion.div>
        )}

        {/* 1. INSIGHT PRINCIPAL — lede editorial, jerarquía de titular */}
        <motion.div
          variants={itemVariants}
          className={
            interpretation.opening
              ? "py-6 sm:py-8"
              : "pt-10 sm:pt-14 pb-8 sm:pb-10"
          }
        >
          <p className="font-heading text-lg sm:text-xl leading-[1.65] text-foreground">
            {interpretation.summary}
          </p>
        </motion.div>

        {/* 01. Tu patrón central */}
        {interpretation.corePattern && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
              Tu patrón central · {interpretation.corePattern.source}
            </p>
            <p className="text-sm leading-[1.75] sm:text-base text-foreground">
              {interpretation.corePattern.whyItMatters}
            </p>
          </motion.div>
        )}

        {/* 2. Qué significa */}
        {interpretation.alignment && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
              {type === "compatibility" ? "Qué significa esta compatibilidad" : "Qué significa"}
            </p>
            <p className="text-sm leading-[1.75] sm:text-base text-foreground">
              {interpretation.alignment}
            </p>
          </motion.div>
        )}

        {/* 3. Por qué importa */}
        {interpretation.timing && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
              {type === "timing" ? "Qué tipo de acciones favorece" : "Por qué importa"}
            </p>
            <p className="text-sm leading-[1.75] sm:text-base text-foreground">
              {interpretation.timing}
            </p>
          </motion.div>
        )}

        {/* 3.5 Timing para la intención elegida — usa el TimingResult real, no el string genérico de arriba */}
        {timing && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
              Timing para {INTENTION_LABELS[timing.intention]}
            </p>
            <p className="text-sm leading-[1.75] sm:text-base text-foreground">
              {timing.explanation}
            </p>
          </motion.div>
        )}

        {/* Strengths */}
        {interpretation.strengths.length > 0 && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
              {type === "compatibility" ? "Fortalezas de la relación" : "Fortalezas"}
            </p>
            <div className="space-y-3">
              {interpretation.strengths.map((s, si) => (
                <div key={si} className="flex items-start gap-3">
                  <span className="w-4 h-px bg-accent mt-[0.65em] shrink-0" aria-hidden="true" />
                  <p className="text-sm leading-[1.75] sm:text-base text-foreground">{s}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tensions */}
        {interpretation.tensions.length > 0 && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
              {type === "compatibility" ? "Tensiones o puntos de fricción" : "Zonas de atención"}
            </p>
            <div className="space-y-3">
              {interpretation.tensions.map((t, ti) => (
                <div key={ti} className="flex items-start gap-3">
                  <span className="w-4 h-px bg-border mt-[0.65em] shrink-0" aria-hidden="true" />
                  <p className="text-sm leading-[1.75] sm:text-base text-muted">{t}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 03. Cómo funcionás */}
        {interpretation.howYouOperate && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
              Cómo funcionás
            </p>
            <p className="text-sm leading-[1.75] sm:text-base text-foreground">
              {interpretation.howYouOperate}
            </p>
          </motion.div>
        )}

        {/* 04. Tus relaciones — solo si hay datos reales de afinidad de zodiaco chino */}
        {interpretation.relationalNote && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
              Tus relaciones
            </p>
            <p className="text-sm leading-[1.75] sm:text-base text-foreground">
              {interpretation.relationalNote}
            </p>
          </motion.div>
        )}

        {/* 4. Recomendación práctica — único acento de color, punto + regla fina en vez de borde izquierdo */}
        {interpretation.suggestedNextStep && (
          <motion.div variants={itemVariants} className="py-6 sm:py-8 mt-2">
            <div className="flex items-center gap-2 mb-3" aria-hidden="true">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="h-px flex-1 bg-ink/10" />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              {type === "compatibility" ? "Recomendación práctica" : "Recomendación"}
            </p>
            <p className="text-sm leading-[1.75] sm:text-base text-foreground font-medium">
              {interpretation.suggestedNextStep}
            </p>
          </motion.div>
        )}

        {/* 07. Síntesis — cierre memorable, pensado para compartir */}
        {interpretation.closingSynthesis && (
          <motion.div variants={itemVariants} className="py-8 sm:py-12 mt-2 border-t border-ink/10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-5">
              Tu síntesis
            </p>
            <blockquote className="font-heading text-lg sm:text-xl leading-[1.6] text-foreground italic">
              &ldquo;{interpretation.closingSynthesis}&rdquo;
            </blockquote>
          </motion.div>
        )}

        {/* 5. Qué considerar */}
        {interpretation.whatToConsider.length > 0 && (
          <motion.div variants={itemVariants} className="py-5 sm:py-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Qué considerar
            </p>
            <div className="space-y-3">
              {interpretation.whatToConsider.map((c, ci) => (
                <div key={ci} className="flex items-start gap-3">
                  <span className="w-4 h-px bg-border mt-[0.65em] shrink-0" aria-hidden="true" />
                  <p className="text-sm leading-[1.75] sm:text-base text-muted">{c}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Confidence */}
        <motion.div variants={itemVariants} className="pt-6 border-t border-ink/10">
          <p className="font-mono text-xs text-muted/70">
            Confianza: {interpretation.confidence} · {sourceLabel}
            {epistemologicalNote && ` · ${epistemologicalNote}`}
          </p>
        </motion.div>
      </motion.div>
    );
  })();

  return (
    <div className="space-y-6">
      {/* Header — byline editorial, sin ruido de dashboard */}
      <div className="flex items-center justify-between pb-6 sm:pb-10 border-b border-ink/10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {label}
          </p>
          {description && (
            <p className="text-sm text-muted leading-relaxed mt-2 max-w-lg">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {isUsingAI && (
            <span className="text-xs uppercase tracking-[0.2em] text-accent/60 font-medium px-2 py-0.5 rounded-sm border border-accent/20">
              IA
            </span>
          )}
          {/* Transparencia: si la IA no respondió, el usuario ve una síntesis
              calculada localmente — no debe parecer indistinguible de la
              interpretación de IA completa que el premium promete. */}
          {hasAttemptedAI && !isUsingAI && interpretation && (
            <span className="text-xs uppercase tracking-[0.2em] text-muted/70 font-medium px-2 py-0.5 rounded-sm border border-border" title="Síntesis calculada localmente — la IA no respondió esta vez.">
              Local
            </span>
          )}
          {hasAttemptedAI && !isInterpreting && (
            <button
              type="button"
              onClick={handleRegenerate}
              className="text-xs uppercase tracking-[0.2em] text-muted hover:text-accent font-medium underline-offset-4 hover:underline transition-colors"
              aria-label="Regenerar interpretación"
            >
              Regenerar
            </button>
          )}
        </div>
      </div>

      {/* Loading state — BuildingMolino solo en el flujo post-pago */}
      <AnimatePresence mode="wait">
        {justUnlocked ? (
          !revealReady && (
            <motion.div
              key="building"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BuildingMolino done={!isInterpreting} onComplete={handleRevealComplete} />
            </motion.div>
          )
        ) : (
          isInterpreting && !interpretation && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Main content — post-pago, la portada de identidad (MolinoReveal) abre
          antes de que el contenido editorial aparezca; en otros flujos entra
          directo con el reveal progresivo de secciones. */}
      <AnimatePresence mode="wait">
        {interpretation && revealReady && (
          justUnlocked ? (
            <MolinoReveal key="reading-reveal" profile={profile}>
              {readingContent}
            </MolinoReveal>
          ) : (
            readingContent
          )
        )}
      </AnimatePresence>

      {/* Requiere premium — no es un error, no tiene sentido ofrecer reintentar */}
      {premiumRequired && !interpretation && revealReady && (
        <div className="pt-6 border-t border-ink/10">
          <p className="text-sm text-muted">
            Esta lectura forma parte de la síntesis paga.
          </p>
        </div>
      )}

      {/* Error state (only show if no interpretation at all) */}
      {error && !interpretation && !premiumRequired && revealReady && (
        <div className="pt-6 border-t border-ink/10">
          <p className="text-sm text-muted mb-3">{error}</p>
          <button
            type="button"
            onClick={handleRegenerate}
            className="text-xs text-accent underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Subtle error when AI failed but local fallback exists */}
      {error && interpretation && revealReady && (
        <div className="pt-6 border-t border-ink/10">
          <p className="text-xs text-muted/70 text-right">
            Interpretación local · AI no disponible
          </p>
        </div>
      )}
    </div>
  );
}
