"use client";

import { useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { calculateCompatibility } from "@/lib/engines/compatibilityEngine";
import { CompatibilityResult, UserProfile } from "@/lib/engines/compatibilityEngine";
import { ENTITIES } from "@/lib/data/entities";
import { useAuthSession } from "@/hooks/useAuthSession";
import { saveComparison, removeComparison } from "@/lib/auth/userService";
import ScoreDisplay from "./ScoreDisplay";
import { getScoreColor, getScoreLabel, getScoreBgColor } from "@/lib/utils/score";

const AIInterpretation = lazy(() => import('./AIInterpretation'));

interface CompatibilityLabProps {
  user: UserProfile;
  entity: any;
  template?: string;
}

export default function CompatibilityLab({ user, entity, template }: CompatibilityLabProps) {
  const result = useMemo(() => calculateCompatibility(user, entity), [user, entity]);
  const { session, refreshSession } = useAuthSession();

  


  const isSaved = () => {
    return session?.user.savedComparisons?.includes(entity.id) || false;
  };

  const handleToggleSave = async () => {
    if (!session?.user.id) return;
    if (isSaved()) {
      await removeComparison(session.user.id, entity.id);
    } else {
      await saveComparison(session.user.id, entity.id);
    }
    refreshSession();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Compatibilidad con {entity.name}
        </h1>
        <p className="text-sm text-muted mt-1">
          Análisis integrado de numerología, astrología y zodiaco chino
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-lg p-5 border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Compatibilidad general</p>
            <ScoreDisplay score={result.scores.overall} label={getScoreLabel(result.scores.overall)} size="lg" />
            <p className="text-sm text-muted">{getScoreLabel(result.scores.overall)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl">
              {entity.emoji || entity.flag || "⭐"}
            </div>
            {session?.user.id && (
              <button
                onClick={handleToggleSave}
                className="text-2xl"
              >
                {isSaved() ? "❤️" : "🤍"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-background p-3">
            <p className="text-xs text-muted mb-1">Numerología</p>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(result.scores.numerology)}`}>
              {result.scores.numerology}%
            </div>
          </div>
          <div className="rounded-xl bg-background p-3">
            <p className="text-xs text-muted mb-1">Astrología occidental</p>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(result.scores.westernAstrology)}`}>
              {result.scores.westernAstrology}%
            </div>
          </div>
          <div className="rounded-xl bg-background p-3">
            <p className="text-xs text-muted mb-1">Zodiaco chino</p>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(result.scores.chineseAstrology)}`}>
              {result.scores.chineseAstrology}%
            </div>
          </div>
          <div className="rounded-xl bg-background p-3">
            <p className="text-xs text-muted mb-1">Elementos</p>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(result.scores.element)}`}>
              {result.scores.element}%
            </div>
          </div>
        </div>
      </motion.div>

      <Suspense fallback={<div className="animate-pulse h-32 bg-background rounded-xl" />}>
        <AIInterpretation user={user} target={entity} result={result} template={template} />
      </Suspense>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl shadow-lg p-5 border border-border"
      >
        <h3 className="font-serif text-lg font-semibold text-foreground mb-3">💪 Fortalezas</h3>
        <div className="flex flex-wrap gap-2">
          {result.strengths.map((strength, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
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
        className="bg-card rounded-2xl shadow-lg p-5 border border-border"
      >
        <h3 className="font-serif text-lg font-semibold text-foreground mb-3">⚠️ Desafíos</h3>
        <div className="flex flex-wrap gap-2">
          {result.challenges.map((challenge, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700"
            >
              {challenge}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
