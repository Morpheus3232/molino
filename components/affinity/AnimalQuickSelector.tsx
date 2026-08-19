"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/lib/utils/motion-hooks";
import { motion } from "framer-motion";
import { sortLightEntities } from "@/lib/affinity-light";
import type { LightweightEntity, VisualType } from "@/types/atlas";
import type { UserProfile } from "@/types/user";
import EntityVisual from "@/components/ui/EntityVisual";

interface AnimalQuickSelectorProps {
  profile: UserProfile;
  currentEntityId: string;
  type: string;
  entities: LightweightEntity[];
}

const TIER_COLOR: Record<string, string> = {
  "resonancia-alta": "#2D5A3A",
  "afinidad-media": "#4A6FA5",
  complementarios: "#D4A843",
  desafiante: "#B45309",
  distante: "#838C95",
};

/**
 * Horizontal quick-selector showing entities of the same type.
 * Highlights current entity. Shows animal emoji + score chip.
 * Scrollable on mobile with snap.
 */
export default function AnimalQuickSelector({ profile, currentEntityId, type, entities }: AnimalQuickSelectorProps) {
  const reducedMotion = useReducedMotion();

  const siblings = useMemo(() => {
    const userAnimal = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
    // `sm:flex-wrap` de acá abajo hace que en desktop esto deje de ser una
    // tira horizontal y se convierta en una grilla completa — sin este
    // límite mostraba las ~26+ entidades del catálogo de una sola vez,
    // apenas debajo del hero y antes de cualquier contenido de diagnóstico.
    return sortLightEntities(userAnimal, entities).slice(0, 12);
  }, [profile, entities]);

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
      <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-3 text-center sm:text-left">
        Otras entidades del mismo tipo
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
        {siblings.map((result) => {
          const isCurrent = result.id === currentEntityId;
          const tierColor = TIER_COLOR[result.tier];
          return (
            <Link
              key={result.id}
              href={`/affinity/${result.type}/${result.id}`}
              className={`snap-start shrink-0 flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-all min-h-[40px] ${
                isCurrent
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
              }`}
              aria-current={isCurrent ? "page" : undefined}
            >
              <EntityVisual visualType={result.visualType as VisualType} emoji={result.emoji} name={result.name} countryISO={result.countryISO} size={28} />
              <span className="font-medium truncate max-w-[80px]">{result.name}</span>
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded-sm shrink-0"
                style={{ color: tierColor, backgroundColor: `${tierColor}12` }}
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
