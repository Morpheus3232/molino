"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  getTopAffinityHighlights,
  TIER_META,
  type AffinityResult,
} from "@/lib/engines/affinityEngine";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import ReadingNumber from "@/components/ui/ReadingNumber";
import { formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { staggerContainer, staggerItem, useReducedMotion } from "@/lib/utils/motion";

interface AffinityPreviewProps {
  profile: UserProfile;
  onEnter: () => void;
}

export default function AffinityPreview({ profile, onEnter }: AffinityPreviewProps) {
  const reducedMotion = useReducedMotion();
  const highlights = useMemo(() => getTopAffinityHighlights(profile), [profile]);

  const main: AffinityResult | null = highlights[0] ?? null;
  const secondary = highlights.slice(1, 3);

  const userAnimal = formatAnimalSimple(profile.chineseZodiac);
  const element = profile.chineseZodiacInfo?.element ?? "";

  const sectionAnim = reducedMotion ? {} : staggerContainer;
  const itemAnim = reducedMotion ? {} : staggerItem;

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content">
        <motion.section
          {...sectionAnim}
          className="mx-auto max-w-[1100px] px-4 sm:px-8 lg:px-12 pt-16 sm:pt-28 pb-20 sm:pb-28"
        >
          {/* Eyebrow */}
          <motion.div {...itemAnim} className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <p className="label-micro text-accent">Afinidades</p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...itemAnim}
            className="font-display uppercase text-[clamp(2.5rem,9vw,6rem)] leading-[0.92] tracking-tight text-foreground max-w-3xl"
          >
            El mundo también se lee desde tu mapa
          </motion.h1>

          <motion.p {...itemAnim} className="mt-6 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            {userAnimal}
            {element && <> de {element}</>} · Tu animal del zodíaco chino conecta tu energía con
            marcas, ciudades y países según la fecha en que nacieron. Estas son tus primeras afinidades.
          </motion.p>

          {/* Main entity — dominant */}
          {main && (
            <motion.div {...itemAnim} className="mt-16 sm:mt-24 border-t border-ink/10 pt-10 sm:pt-14">
              <Link
                href={`/affinity/${main.entity.type}/${main.entity.id}`}
                className="group block focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-end gap-8">
                  <span className="text-7xl sm:text-8xl leading-none" aria-hidden="true">
                    {main.entity.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="label-micro mb-2">
                      {ENTITY_TYPES[main.entity.type]?.label ?? main.entity.type}
                    </p>
                    <h2 className="font-display uppercase text-4xl sm:text-6xl leading-[0.95] tracking-tight text-foreground">
                      {main.entity.name}
                    </h2>
                    <p className="mt-4 text-sm text-muted">
                      {formatAnimalSimple(main.userAnimal)} ↔ {formatAnimalSimple(main.entityAnimal)}
                    </p>
                    <p className="mt-2 text-sm text-foreground leading-relaxed max-w-md">
                      {main.explanation || main.summary}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <ReadingNumber
                      value={main.score}
                      label="Afinidad"
                      color={TIER_META[main.tier].color}
                      context={TIER_META[main.tier].label}
                      size="xl"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Secondary — two teases */}
          {secondary.length > 0 && (
            <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
              {secondary.map((result) => (
                <Link
                  key={result.entity.id}
                  href={`/affinity/${result.entity.type}/${result.entity.id}`}
                  className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-4xl sm:text-5xl leading-none" aria-hidden="true">
                      {result.entity.emoji}
                    </span>
                    <span className="font-display text-2xl text-foreground tabular-nums">
                      {result.score}
                    </span>
                  </div>
                  <p className="mt-4 label-micro">
                    {ENTITY_TYPES[result.entity.type]?.label ?? result.entity.type}
                  </p>
                  <h3 className="mt-1 font-display uppercase text-2xl sm:text-3xl text-foreground leading-tight">
                    {result.entity.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-4">
                    <span
                      className="inline-block w-1.5 h-1.5 shrink-0"
                      style={{ backgroundColor: TIER_META[result.tier].color }}
                    />
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: TIER_META[result.tier].color }}
                    >
                      {TIER_META[result.tier].label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTAs */}
          <motion.div
            {...itemAnim}
            className="mt-12 sm:mt-16 pt-10 border-t border-ink/10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
          >
            <Link
              href="/affinity"
              className="group inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 text-base bg-accent text-accent-foreground hover:bg-accent/90 transition-colors min-h-[52px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Explorar todas tus afinidades
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
            <button
              type="button"
              onClick={onEnter}
              className="inline-flex items-center justify-center gap-2 font-medium px-8 py-4 text-base text-muted hover:text-foreground transition-colors min-h-[52px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Ver mi mapa completo
            </button>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
