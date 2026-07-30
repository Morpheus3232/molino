"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/lib/utils/motion";
import { motion } from "framer-motion";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { calculateAffinity, TIER_META } from "@/lib/engines/affinityEngine";
import type { UserProfile } from "@/types/user";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";

interface AnimalQuickSelectorProps {
  profile: UserProfile;
  currentEntity: SymbolicEntity;
  type: EntityType;
}

/**
 * Horizontal quick-selector showing entities of the same type.
 * Highlights current entity. Shows animal emoji + score chip.
 * Scrollable on mobile with snap.
 */
export default function AnimalQuickSelector({ profile, currentEntity, type }: AnimalQuickSelectorProps) {
  const reducedMotion = useReducedMotion();

  const siblings = useMemo(() => {
    return SYMBOLIC_ENTITIES
      .filter(e => e.type === type)
      .map(e => ({
        entity: e,
        result: calculateAffinity(profile, e),
      }))
      .sort((a, b) => b.result.score - a.result.score);
  }, [profile, type]);

  if (siblings.length <= 1) return null;

  return (
    <motion.nav
      aria-label="Otras entidades del mismo tipo"
      className="mb-12"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
    >
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
        {siblings.map(({ entity, result }) => {
          const isCurrent = entity.id === currentEntity.id;
          const tierMeta = TIER_META[result.tier];
          return (
            <Link
              key={entity.id}
              href={`/affinity/${entity.type}/${entity.id}`}
              className={`snap-start shrink-0 flex items-center gap-2 px-3 py-2 rounded-none border text-sm transition-all min-h-[40px] ${
                isCurrent
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
              }`}
              aria-current={isCurrent ? "page" : undefined}
            >
              <span className="text-base">{entity.emoji}</span>
              <span className="font-medium truncate max-w-[80px]">{entity.name}</span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                style={{ color: tierMeta.color, backgroundColor: `${tierMeta.color}12` }}
              >
                {result.score}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
