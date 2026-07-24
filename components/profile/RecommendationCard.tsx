"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatAnimalEmoji, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import type { PersonalRecommendation } from "@/lib/engines/personalRecommendationEngine";
import PriorityBadge from "./PriorityBadge";

export default function RecommendationCard({
  rec,
  index,
}: {
  rec: PersonalRecommendation;
  index: number;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const typeMeta = ENTITY_TYPES[rec.entity.type];

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-accent/50 transition-all group"
    >
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <span className="text-2xl shrink-0">{rec.entity.emoji}</span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
              {rec.entity.name}
            </h4>
            <span className="text-[10px] text-muted shrink-0">{typeMeta?.label}</span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted">{formatAnimalSimple(rec.entityAnimal)}</span>
          </div>

          <p className="text-xs text-muted/70 leading-relaxed line-clamp-2">{rec.explanation}</p>
        </div>

        {/* Score + Priority */}
        <div className="text-right shrink-0">
          <p className="font-serif text-lg font-bold text-foreground">{rec.totalScore}</p>
          <PriorityBadge priority={rec.priority} showLabel={false} />
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border">
              {/* Scoring breakdown */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <ScoreMini label="Natal" score={rec.natalScore} color="#4A6FA5" />
                <ScoreMini label="Temporal" score={rec.temporalScore} color="#D4A843" />
                <ScoreMini label="Elemento" score={rec.elementScore} color="#2D5A3D" />
                <ScoreMini label="Numerología" score={rec.numerologyScore} color="#B45309" />
              </div>

              <p className="text-[9px] text-muted/60 text-center mb-3">
                Fórmula: natal 40% + temporal 30% + elemento 20% + numerología 10%
              </p>

              {/* Action */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/affinity/${rec.entity.type}/${rec.entity.id}`);
                }}
                className="w-full text-center text-xs text-accent hover:underline font-medium"
              >
                Ver detalle de {rec.entity.name} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function ScoreMini({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="p-2 rounded-lg bg-background/50 text-center">
      <p className="font-serif text-sm font-bold" style={{ color }}>{score}</p>
      <p className="text-[8px] text-muted">{label}</p>
    </div>
  );
}
