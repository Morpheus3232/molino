"use client";

import { useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import type { CompatibilityResult, UserProfile } from "@/lib/engines/compatibilityEngine";
import type { EntityProfile } from "@/lib/data/entities";
import ScoreDisplay from "./ScoreDisplay";
import { getScoreColor, getScoreLabel } from "@/lib/utils/score";

const AIInterpretation = lazy(() => import('./AIInterpretation'));

interface CompatibilityLabProps {
  user: UserProfile;
  entity: EntityProfile;
  result: CompatibilityResult;
  template?: string;
}

export default function CompatibilityLab({ user, entity, result, template }: CompatibilityLabProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-md p-6 border border-border shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Compatibilidad general</p>
            <ScoreDisplay score={result.scores.overall} label={getScoreLabel(result.scores.overall)} size="lg" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl">
              {entity.emoji || "⭐"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-background p-3">
            <p className="text-xs text-muted mb-1">Numerología</p>
            <div className={`inline-block px-2 py-1 rounded-sm text-xs font-bold ${getScoreColor(result.scores.numerology)}`}>
              {result.scores.numerology}%
            </div>
          </div>
          <div className="rounded-md bg-background p-3">
            <p className="text-xs text-muted mb-1">Astrología occidental</p>
            <div className={`inline-block px-2 py-1 rounded-sm text-xs font-bold ${getScoreColor(result.scores.westernAstrology)}`}>
              {result.scores.westernAstrology}%
            </div>
          </div>
          <div className="rounded-md bg-background p-3">
            <p className="text-xs text-muted mb-1">Zodiaco chino</p>
            <div className={`inline-block px-2 py-1 rounded-sm text-xs font-bold ${getScoreColor(result.scores.chineseAstrology)}`}>
              {result.scores.chineseAstrology}%
            </div>
          </div>
          <div className="rounded-md bg-background p-3">
            <p className="text-xs text-muted mb-1">Elementos</p>
            <div className={`inline-block px-2 py-1 rounded-sm text-xs font-bold ${getScoreColor(result.scores.element)}`}>
              {result.scores.element}%
            </div>
          </div>
        </div>
      </motion.div>

      <Suspense fallback={<div className="animate-pulse h-32 bg-background rounded-md" />}>
        <AIInterpretation user={user} target={entity} result={result} template={template} />
      </Suspense>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-md p-6 border border-border shadow-sm"
      >
        <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Fortalezas</h3>
        <div className="flex flex-wrap gap-2">
          {result.strengths.map((strength, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-sm text-xs font-medium bg-green-50 text-green-700"
            >
              {strength}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card rounded-md p-6 border border-border shadow-sm"
      >
        <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Desafíos</h3>
        <div className="flex flex-wrap gap-2">
          {result.challenges.map((challenge, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-sm text-xs font-medium bg-yellow-50 text-yellow-700"
            >
              {challenge}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
