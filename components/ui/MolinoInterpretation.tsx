"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  buildMolinoContext,
  generateIntelligenceInterpretation,
  generateFallbackInterpretation,
  type MolinoContext,
  type InterpretationType,
  type InterpretationRequest,
  type MolinoInterpretation,
} from "@/lib/engines/intelligenceEngine";
import type { UserProfile } from "@/types/user";
import type { CompatibilityResult } from "@/lib/engines/compatibilityEngine";
import type { DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import type { TimingResult } from "@/lib/engines/timingEngine";
import type { DecisionResult } from "@/lib/engines/decisionsEngine";
import type { EntityProfile } from "@/lib/data/entities";

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
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Insight principal */}
      <div className="p-5 rounded-none bg-background border border-border">
        <div className="h-4 bg-border/50 rounded w-3/4 mb-3" />
        <div className="h-3 bg-border/50 rounded w-full mb-2" />
        <div className="h-3 bg-border/50 rounded w-5/6" />
      </div>

      {/* Qué significa */}
      <div className="p-4 rounded-none bg-background border border-border">
        <div className="h-2 bg-border/50 rounded w-1/4 mb-2" />
        <div className="h-3 bg-border/50 rounded w-full mb-2" />
        <div className="h-3 bg-border/50 rounded w-4/5" />
      </div>

      {/* Por qué importa */}
      <div className="p-4 rounded-none bg-background border border-border">
        <div className="h-2 bg-border/50 rounded w-1/4 mb-2" />
        <div className="h-3 bg-border/50 rounded w-full mb-2" />
        <div className="h-3 bg-border/50 rounded w-3/4" />
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
 * 4. Recomendación práctica (suggestedNextStep)
 * 5. Próximo paso (whatToConsider)
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
}: MolinoInterpretationProps) {
  const [localInterpretation, setLocalInterpretation] = useState<MolinoInterpretation | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<MolinoInterpretation | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedAI, setHasAttemptedAI] = useState(false);

  // Build context from available data
  const context: MolinoContext = buildMolinoContext(profile, {
    dailyEnergy,
    timing,
    compatibility,
    entity,
    decision,
  });

  // Generate local fallback interpretation immediately
  useEffect(() => {
    if (showFallbackImmediately && !localInterpretation) {
      const fallback = generateFallbackInterpretation({
        type,
        context,
        question,
      });
      setLocalInterpretation(fallback);
    }
  }, [type, context, question, showFallbackImmediately]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get AI interpretation
  const getAIInterpretation = useCallback(async (retry = false) => {
    if (isInterpreting) return;
    setIsInterpreting(true);
    setError(null);
    if (retry) setAiInterpretation(null);

    try {
      const request: InterpretationRequest = {
        type,
        context,
        question,
      };
      const interp = await generateIntelligenceInterpretation(request);
      setAiInterpretation(interp);
      setHasAttemptedAI(true);
    } catch (err) {
      console.error("Error getting AI interpretation:", err);
      setError("No se pudo obtener la interpretación de IA. Mostrando datos locales.");
      setHasAttemptedAI(true);
    } finally {
      setIsInterpreting(false);
    }
  }, [type, context, question, isInterpreting]);

  // Auto-fetch AI interpretation on mount
  useEffect(() => {
    if (!hasAttemptedAI) {
      getAIInterpretation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Use AI interpretation if available, otherwise fallback
  const interpretation = aiInterpretation || localInterpretation;
  const isUsingAI = !!aiInterpretation;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium">{label}</p>
          {description && (
            <p className="text-xs text-muted mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isUsingAI && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-accent/60 font-medium px-2 py-0.5 rounded-full border border-accent/20">
              IA
            </span>
          )}
          {hasAttemptedAI && !isInterpreting && (
            <button
              type="button"
              onClick={() => getAIInterpretation(true)}
              className="text-[9px] uppercase tracking-[0.15em] text-muted hover:text-foreground font-medium px-2 py-0.5 rounded-full border border-border hover:border-foreground/20 transition-colors"
              aria-label="Regenerar interpretación"
            >
              Regenerar
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      <AnimatePresence mode="wait">
        {isInterpreting && !interpretation && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {interpretation && (
          <motion.div
            key={isUsingAI ? "ai" : "local"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-3"
          >
            {/* 1. INSIGHT PRINCIPAL */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="p-5 rounded-none bg-background border border-border"
            >
              <p className="text-sm text-foreground leading-relaxed">{interpretation.summary}</p>
            </motion.div>

            {/* 2. Qué significa */}
            {interpretation.alignment && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="p-4 rounded-none bg-background border border-border"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">
                  {type === "compatibility" ? "Qué significa esta compatibilidad" : "Qué significa"}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{interpretation.alignment}</p>
              </motion.div>
            )}

            {/* 3. Por qué importa */}
            {interpretation.timing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="p-4 rounded-none bg-background border border-border"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-1">
                  {type === "timing" ? "Qué tipo de acciones favorece" : "Por qué importa"}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{interpretation.timing}</p>
              </motion.div>
            )}

            {/* Strengths */}
            {interpretation.strengths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="p-4 rounded-none bg-background border border-border"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-2">
                  {type === "compatibility" ? "Fortalezas de la relación" : "Fortalezas"}
                </p>
                <ul className="space-y-1.5">
                  {interpretation.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Tensions */}
            {interpretation.tensions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="p-4 rounded-none bg-background border border-border"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">
                  {type === "compatibility" ? "Tensiones o puntos de fricción" : "Zonas de atención"}
                </p>
                <ul className="space-y-1.5">
                  {interpretation.tensions.map((t, i) => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* 4. Recomendación práctica */}
            {interpretation.suggestedNextStep && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="p-5 rounded-none bg-accent/5 border border-accent/20"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">
                  {type === "compatibility" ? "Recomendación práctica" : "Recomendación"}
                </p>
                <p className="text-sm text-foreground font-medium leading-relaxed">{interpretation.suggestedNextStep}</p>
              </motion.div>
            )}

            {/* 5. Qué considerar */}
            {interpretation.whatToConsider.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="p-4 rounded-none bg-background border border-border"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-2">Qué considerar</p>
                <ul className="space-y-1.5">
                  {interpretation.whatToConsider.map((c, i) => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Confidence */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="pt-3 border-t border-border"
            >
              <p className="text-xs text-muted">
                Confianza: {interpretation.confidence}
                {interpretation.limitations[0] && ` · ${interpretation.limitations[0]}`}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state (only show if no interpretation at all) */}
      {error && !interpretation && (
        <div className="p-4 rounded-none bg-yellow-50 border border-yellow-200">
          <p className="text-sm text-yellow-700 mb-2">{error}</p>
          <button
            type="button"
            onClick={() => getAIInterpretation(true)}
            className="text-xs text-yellow-800 underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Subtle error when AI failed but local fallback exists */}
      {error && interpretation && (
        <p className="text-[10px] text-muted text-right">
          Interpretación local · AI no disponible
        </p>
      )}
    </div>
  );
}
