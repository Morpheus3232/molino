"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { calculateAllAffinity } from "@/lib/engines/affinityEngine";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import MapVisualization from "@/components/profile/MapVisualization";
import SpaceIndex from "@/components/profile/SpaceIndex";
import LecturaProfunda from "@/components/profile/LecturaProfunda";
import DecisionMapSection from "@/components/profile/DecisionMapSection";
import CalculationDetails from "@/components/profile/CalculationDetails";
import ActionButtons from "@/components/profile/ActionButtons";
import { getYearTheme } from "@/lib/engines/dailyEnergyEngine";

export default function ProfileHub({ profile }: { profile: UserProfile }) {
  const reduceMotion = useSafeReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const chineseElement =
    typeof profile.chineseZodiacInfo?.element === "string"
      ? profile.chineseZodiacInfo.element
      : "";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetype.name;

  const worldCount = useMemo(() => {
    const results = calculateAllAffinity(profile, SYMBOLIC_ENTITIES);
    return results.filter((r) => r.score >= 60).length;
  }, [profile]);

  const relationMap = useMemo(
    () => getRelationshipMap(userAnimal),
    [userAnimal]
  );
  const allies = relationMap.friends
    .filter((f) => f.type === "triad")
    .map((f) => f.animal);
  const personalYear = profile.cycles?.personalYear;
  const yearTheme =
    typeof personalYear === "number" ? getYearTheme(personalYear) : null;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  const heroItem = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0.1 : 0.45,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════════
          HERO — El instrumento. Silencioso, poderoso.
          Una sola idea visual dominante: tu identidad.
          ═══════════════════════════════════════════════ */}
      <header
        ref={heroRef}
        className="relative overflow-hidden border-b border-ink/10"
      >
        <motion.div
          style={{
            scale: reduceMotion ? 1 : heroScale,
            opacity: reduceMotion ? 1 : heroOpacity,
          }}
        >
          <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-16 sm:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
              {/* Identity — núcleo emocional */}
              <div className="text-center lg:text-left">
                <motion.div {...heroItem(0.15)}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    CAMINO DE VIDA {lifePath}
                  </span>
                </motion.div>

                <motion.div {...heroItem(0.3)} className="mt-2">
                  <h1 className="font-display text-[clamp(3rem,10vw,6rem)] tracking-tight text-foreground leading-[0.85] uppercase">
                    {archetypeName}
                  </h1>
                </motion.div>

                <motion.p
                  {...heroItem(0.5)}
                  className="mt-4 text-sm sm:text-base text-muted leading-relaxed max-w-md italic"
                >
                  {archetype.description}
                </motion.p>

                {/* Compact identity strip */}
                <motion.div
                  {...heroItem(0.7)}
                  className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm"
                >
                  <span className="font-mono text-muted tracking-wide">
                    {profile.sunSign}
                    {profile.sunSignInfo?.element
                      ? ` · ${profile.sunSignInfo.element}`
                      : ""}
                  </span>
                  <span className="w-px h-4 bg-ink/10" aria-hidden="true" />
                  <span className="font-mono text-muted tracking-wide">
                    {display.name} de {chineseElement}
                  </span>
                  {yearTheme && (
                    <>
                      <span
                        className="w-px h-4 bg-ink/10"
                        aria-hidden="true"
                      />
                      <span className="font-mono text-accent tracking-wide">
                        Año {personalYear} · {yearTheme}
                      </span>
                    </>
                  )}
                </motion.div>
              </div>

              {/* MapVisualization — el mapa visual */}
              <motion.div
                {...heroItem(0.2)}
                className="flex justify-center lg:justify-end"
              >
                <MapVisualization
                  profile={profile}
                  className="w-72 h-72 sm:w-80 sm:h-80"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ═══════════════════════════════════════════════
          CÁLCULO — Cómo se calculó esto (colapsable)
          ═══════════════════════════════════════════════ */}
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-6">
        <CalculationDetails profile={profile} />
        <ActionButtons profile={profile} />
      </div>

      {/* ═══════════════════════════════════════════════
          LECTURA — Patrones + Principios + Momento
          primero la señal, después la interpretación.
          ═══════════════════════════════════════════════ */}
      <LecturaProfunda profile={profile} />

      {/* ═══════════════════════════════════════════════
          TU PREGUNTA — Decisiones personales
          ═══════════════════════════════════════════════ */}
      <DecisionMapSection profile={profile} />

      {/* ═══════════════════════════════════════════════
          NAV — Dimensiones del mapa en una línea.
          Exploración (Círculo/Mundo/Evolución): no interrumpe
          la lectura, se ofrece después de la señal.
          ═══════════════════════════════════════════════ */}
      <SpaceIndex
        profile={profile}
        circleName={`${display.name} de ${chineseElement}`}
        allyName={allies[0] ?? null}
        worldCount={worldCount}
      />
    </div>
  );
}
