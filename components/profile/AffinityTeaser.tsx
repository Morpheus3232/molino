"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getTopAffinityHighlights, TIER_META } from "@/lib/engines/affinityEngine";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import { smoothReveal, staggerApple, staggerItemSmooth } from "@/lib/utils/premiumMotion";

interface AffinityTeaserProps {
  profile: UserProfile;
}

const MotionLink = motion.create(Link);

export default function AffinityTeaser({ profile }: AffinityTeaserProps) {
  const highlights = useMemo(() => getTopAffinityHighlights(profile), [profile]);

  if (highlights.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pb-16 sm:pb-20">
      <motion.div {...smoothReveal}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
          <h2 className="label-micro">Tus Afinidades</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-tight text-foreground">
              Hay lugares y marcas que resuenan con tu mapa
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Tu animal del zodíaco chino también conecta tu energía con marcas, ciudades y países
              que vibran en tu misma frecuencia. Estas son tus primeras afinidades.
            </p>
          </div>
          <Link
            href="/affinity"
            className="group inline-flex items-center gap-2 text-base font-medium text-accent shrink-0"
          >
            Explorar todas tus afinidades
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </motion.div>

      <motion.div {...staggerApple} className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/10">
        {highlights.map((result, i) => {
          const tierMeta = TIER_META[result.tier];
          const typeLabel = ENTITY_TYPES[result.entity.type]?.label ?? result.entity.type;
          return (
            <MotionLink
              key={result.entity.id}
              href={`/affinity/${result.entity.type}/${result.entity.id}`}
              {...staggerItemSmooth}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.08 }}
              className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-4xl sm:text-5xl leading-none" aria-hidden="true">
                  {result.entity.emoji}
                </span>
                <span className="font-display text-xl text-foreground tabular-nums">{result.score}</span>
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted font-medium">{typeLabel}</p>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl text-foreground leading-tight">
                {result.entity.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">
                {result.explanation || result.summary}
              </p>
              <div className="flex items-center gap-2 mt-5">
                <span
                  className="inline-block w-1.5 h-1.5 shrink-0"
                  style={{ backgroundColor: tierMeta.color }}
                />
                <span className="text-[11px] uppercase tracking-wider" style={{ color: tierMeta.color }}>
                  {tierMeta.label}
                </span>
              </div>
            </MotionLink>
          );
        })}
      </motion.div>
    </section>
  );
}
