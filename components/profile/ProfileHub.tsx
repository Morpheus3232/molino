"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { calculateAllAffinity, type AffinityResult } from "@/lib/engines/affinityEngine";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import ZodiacMark from "@/components/ui/ZodiacMark";
import type { ProfileTab } from "./ProfileTabs";
import { loadDiscoveryState } from "@/lib/session/discovery";

interface ProfileHubProps {
  profile: UserProfile;
  onEnter?: (tab: ProfileTab) => void;
}

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function ProfileHub({ profile, onEnter }: ProfileHubProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = typeof profile.archetype === "string" ? profile.archetype : "";
  const name = typeof profile.name === "string" ? profile.name : "";

  const affinityResults = useMemo(() => calculateAllAffinity(profile, SYMBOLIC_ENTITIES), [profile]);
  const positiveAffinities = useMemo(
    () => affinityResults.filter((r) => r.tier === "resonancia-alta" || r.tier === "afinidad-media"),
    [affinityResults]
  );

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const sameFriends = relationMap.friends.filter((f) => f.type === "triad").slice(0, 2);

  const hasCompletedOnboarding = useMemo(() => loadDiscoveryState().hasCompletedOnboarding, []);
  const topRec: AffinityResult | null = hasCompletedOnboarding ? positiveAffinities[0] ?? null : null;

  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile), [profile]);

  const worldCount = affinityResults.filter((r) => r.entityAnimal === userAnimal).length;
  const allies = sameFriends.map((f) => f.animal);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 70% 55% at 50% 20%, ${elementColor}14, transparent 72%)` }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-12 sm:pb-16">
          <motion.div {...fade} className="flex flex-col items-center text-center">
            <span className="label-micro mb-8">Mi mapa personal</span>

            <div className="relative mb-7">
              <div
                className="absolute inset-0 scale-[2.4] blur-3xl opacity-[0.16] rounded-full"
                style={{ backgroundColor: elementColor }}
                aria-hidden="true"
              />
              <ZodiacMark animal={userAnimal} color={elementColor} size="lg" className="relative" />
            </div>

            <h1 className="font-display text-[clamp(2.75rem,9vw,6.5rem)] tracking-tight text-foreground leading-[0.9] uppercase">
              {name || archetypeName || display.name}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              {archetypeName
                ? `Tu mapa: arquetipo ${archetypeName}, Camino de Vida ${lifePath}, ${display.name} de ${profile.chineseZodiacInfo?.element ?? element}.`
                : `Tu mapa: ${display.name} del zodíaco chino, Camino de Vida ${lifePath}.`}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 items-center">
              {[
                { label: "Elemento", value: profile.chineseZodiacInfo?.element ?? "" },
                { label: "Signo", value: profile.sunSign },
                { label: "Camino", value: String(lifePath) },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex items-center gap-3">
                  {i > 0 && <span className="w-px h-4 bg-border" aria-hidden="true" />}
                  <div className="flex items-center gap-2">
                    <span className="font-mono uppercase text-xs tracking-[0.15em] text-muted">{label}</span>
                    <span className="text-base text-foreground font-medium">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* ═══════════════════ SECCIONES ═══════════════════ */}
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 pb-24">
        {/* Identidad — protagonista */}
        <motion.div {...fade} transition={{ delay: 0.05, duration: 0.3 }}>
          <button
            type="button"
            onClick={() => onEnter?.("identity")}
            disabled={!onEnter}
            className="group w-full text-left border-t border-border py-8 lg:py-10 transition-colors hover:bg-ink/[0.02]"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-2xl">
                <p className="label-micro mb-3">01 · Tu Identidad</p>
                <h2 className="font-display uppercase text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] tracking-tight text-foreground group-hover:text-accent transition-colors">
                  Tu arquetipo es {archetype.name}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted max-w-xl">
                  Camino de Vida {lifePath} — {archetype.keywords.slice(0, 3).join(", ").toLowerCase()}.
                </p>
              </div>
              <span className="hidden sm:inline-flex mt-2 font-mono text-xs uppercase tracking-[0.15em] text-accent group-hover:translate-x-1 transition-transform">
                Explorar →
              </span>
            </div>
          </button>
        </motion.div>

        {/* Círculo + Mundo — par secundario */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border">
          <motion.div {...fade} transition={{ delay: 0.1, duration: 0.3 }}>
            <button
              type="button"
              onClick={() => onEnter?.("circle")}
              disabled={!onEnter}
              className="group w-full text-left md:border-r border-border py-8 lg:py-10 md:pr-8 transition-colors hover:bg-ink/[0.02]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-2">02 · Tu Círculo</p>
              <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-foreground leading-tight group-hover:text-accent transition-colors">
                {allies.length > 0 ? `Tus aliados: ${allies.join(" y ")}` : "Quién te rodea"}
              </h3>
              <p className="mt-2 text-sm text-muted">Armonía y tensión dentro del ciclo chino.</p>
            </button>
          </motion.div>

          <motion.div {...fade} transition={{ delay: 0.15, duration: 0.3 }}>
            <button
              type="button"
              onClick={() => onEnter?.("world")}
              disabled={!onEnter}
              className="group w-full text-left py-8 lg:py-10 md:pl-8 transition-colors hover:bg-ink/[0.02]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-2">03 · Tu Mundo</p>
              <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-foreground leading-tight group-hover:text-accent transition-colors">
                {worldCount} entidades resuenan con vos
              </h3>
              <p className="mt-2 text-sm text-muted">Marcas, historias y referentes que conectan.</p>
            </button>
          </motion.div>
        </div>

        {/* Inteligencia — cierre premium */}
        <motion.div {...fade} transition={{ delay: 0.2, duration: 0.3 }}>
          <button
            type="button"
            onClick={() => onEnter?.("intelligence")}
            disabled={!onEnter}
            className="group w-full text-left border-t border-border py-8 lg:py-10 transition-colors hover:bg-ink/[0.02]"
          >
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-3">04 · Tu Inteligencia</p>
              <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-foreground leading-[0.95] group-hover:text-accent transition-colors">
                Tu momento: {dailyEnergy.overallScore}/100 — {dailyEnergy.theme}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted">
                El mapa profundo que conecta tus sistemas. Versión completa premium.
              </p>
            </div>
          </button>
        </motion.div>

        {/* Próximo descubrimiento */}
        {topRec && (
          <motion.div {...fade} transition={{ delay: 0.25, duration: 0.3 }}>
            <Link
              href={`/affinity/${topRec.entity.type}/${topRec.entity.id}`}
              className="group block border-t border-border py-8"
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-2">Tu próximo descubrimiento</p>
              <p className="text-base sm:text-lg text-foreground group-hover:text-accent transition-colors max-w-2xl">
                {topRec.entity.name} resuena especialmente con tu energía de {display.name}.
              </p>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}