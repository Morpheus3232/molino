"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="animate-pulse">
      {/* Insight principal */}
      <div className="pb-4">
        <div className="h-5 bg-border/50 rounded w-3/4 mb-3" />
        <div className="h-3 bg-border/50 rounded w-full mb-2" />
        <div className="h-3 bg-border/50 rounded w-5/6" />
      </div>

      {/* Qué significa */}
      <div className="pt-4 border-t border-ink/10">
        <div className="h-2 bg-border/50 rounded w-1/4 mb-2" />
        <div className="h-3 bg-border/50 rounded w-full mb-2" />
        <div className="h-3 bg-border/50 rounded w-4/5" />
      </div>

      {/* Por qué importa */}
      <div className="pt-4 mt-4 border-t border-ink/10">
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
}: MolinoInterpretationProps) {
  const [fallbackInterpretation, setFallbackInterpretation] = useState<MolinoInterpretation | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<MolinoInterpretation | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [premiumRequired, setPremiumRequired] = useState(false);
  const [hasAttemptedAI, setHasAttemptedAI] = useState(false);

  const fetchInterpretation = useCallback(async () => {
    if (hasAttemptedAI) return;
    setIsInterpreting(true);
    setError(null);
    setPremiumRequired(false);

    try {
      const response = await fetch('/api/intelligence/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          dob: profile.birthDate,
          name: profile.name,
          dailyEnergy,
          timing,
          compatibility,
          entity,
          decision,
          question,
        }),
      });

      // 403 = contenido premium sin acceso — server-side gate, independiente
      // de si el paywall del cliente está habilitado (NEXT_PUBLIC_PREMIUM_ENABLED).
      // No es una falla técnica: no tiene sentido ni reintentar ni mostrar un
      // error genérico "algo se rompió" en la pantalla insignia del producto.
      if (response.status === 403) {
        setPremiumRequired(true);
        setHasAttemptedAI(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      setFallbackInterpretation(data.fallback || null);
      if (data.ai) {
        setAiInterpretation(data.ai);
      } else if (data.error) {
        setError(data.error);
      }
      setHasAttemptedAI(true);
    } catch (err) {
      // A diferencia del camino feliz (línea 130), acá el fetch mismo falló
      // antes de llegar a leer `data.fallback` — no hay dato local para
      // mostrar. El mensaje anterior prometía "mostrando datos locales" sin
      // que ningún dato local llegara a setearse.
      console.error("Error getting interpretation:", err);
      setError("No se pudo obtener la interpretación. Intentá de nuevo.");
      setHasAttemptedAI(true);
    } finally {
      setIsInterpreting(false);
    }
  }, [
    type,
    profile.birthDate,
    profile.name,
    dailyEnergy,
    timing,
    compatibility,
    entity,
    decision,
    question,
    hasAttemptedAI,
  ]);

  useEffect(() => {
    if (!hasAttemptedAI) {
      fetchInterpretation();
    }
  }, [fetchInterpretation, hasAttemptedAI]);

  const handleRegenerate = useCallback(() => {
    setAiInterpretation(null);
    fetchInterpretation();
  }, [fetchInterpretation]);

  const interpretation = aiInterpretation || fallbackInterpretation;
  const isUsingAI = !!aiInterpretation;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">{label}</p>
          {description && (
            <p className="text-xs text-muted mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isUsingAI && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-accent/60 font-medium px-2 py-0.5 rounded-sm border border-accent/20">
              IA
            </span>
          )}
          {/* Transparencia: si la IA no respondió, el usuario ve una síntesis
              calculada localmente — no debe parecer indistinguible de la
              interpretación de IA completa que el premium promete. */}
          {hasAttemptedAI && !isUsingAI && interpretation && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-muted/70 font-medium px-2 py-0.5 rounded-sm border border-border" title="Síntesis calculada localmente — la IA no respondió esta vez.">
              Local
            </span>
          )}
          {hasAttemptedAI && !isInterpreting && (
            <button
              type="button"
              onClick={handleRegenerate}
              className="text-[9px] uppercase tracking-[0.15em] text-muted hover:text-accent font-medium underline-offset-4 hover:underline transition-colors"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {/* 1. INSIGHT PRINCIPAL — lede editorial, sin caja */}
            <div className="pb-5">
              <p className="font-heading text-lg sm:text-xl text-foreground leading-relaxed">{interpretation.summary}</p>
            </div>

            {/* 2. Qué significa */}
            {interpretation.alignment && (
              <div className="py-4 border-t border-ink/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">
                  {type === "compatibility" ? "Qué significa esta compatibilidad" : "Qué significa"}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{interpretation.alignment}</p>
              </div>
            )}

            {/* 3. Por qué importa */}
            {interpretation.timing && (
              <div className="py-4 border-t border-ink/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">
                  {type === "timing" ? "Qué tipo de acciones favorece" : "Por qué importa"}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{interpretation.timing}</p>
              </div>
            )}

            {/* 3.5 Timing para la intención elegida — usa el TimingResult real, no el string genérico de arriba */}
            {timing && (
              <div className="py-4 border-t border-ink/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-1">
                  Timing para {INTENTION_LABELS[timing.intention]}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{timing.explanation}</p>
              </div>
            )}

            {/* Strengths */}
            {interpretation.strengths.length > 0 && (
              <div className="py-4 border-t border-ink/10">
                <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">
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
              </div>
            )}

            {/* Tensions */}
            {interpretation.tensions.length > 0 && (
              <div className="py-4 border-t border-ink/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">
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
              </div>
            )}

            {/* 4. Recomendación práctica — único acento de color, borde izquierdo en vez de caja rellena */}
            {interpretation.suggestedNextStep && (
              <div className="py-4 mt-4 border-t border-ink/10">
                <div className="border-l-2 border-accent pl-4 sm:pl-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-1">
                    {type === "compatibility" ? "Recomendación práctica" : "Recomendación"}
                  </p>
                  <p className="text-sm text-foreground font-medium leading-relaxed">{interpretation.suggestedNextStep}</p>
                </div>
              </div>
            )}

            {/* 5. Qué considerar */}
            {interpretation.whatToConsider.length > 0 && (
              <div className="py-4 border-t border-ink/10">
                <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Qué considerar</p>
                <ul className="space-y-1.5">
                  {interpretation.whatToConsider.map((c, i) => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confidence */}
            <div className="pt-3 mt-4 border-t border-ink/10">
              <p className="text-xs text-muted">
                Confianza: {interpretation.confidence}
                {interpretation.limitations[0] && ` · ${interpretation.limitations[0]}`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requiere premium — no es un error, no tiene sentido ofrecer reintentar */}
      {premiumRequired && !interpretation && (
        <p className="text-sm text-muted">
          Esta lectura forma parte de la síntesis paga.
        </p>
      )}

      {/* Error state (only show if no interpretation at all) */}
      {error && !interpretation && !premiumRequired && (
        <div className="p-4 border border-ink/10 bg-ink/[0.02]">
          <p className="text-sm text-muted mb-2">{error}</p>
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
      {error && interpretation && (
        <p className="text-xs text-muted text-right">
          Interpretación local · AI no disponible
        </p>
      )}
    </div>
  );
}
