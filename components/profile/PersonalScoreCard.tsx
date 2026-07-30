"use client";

import { useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { UserProfile } from "@/types/user";
import { getAnimalProfile, type Animal } from "@/lib/data/animalRelations";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface PersonalScoreCardProps {
  profile: UserProfile;
}

interface ScoreIndicator {
  label: string;
  value: number;
  color: string;
  description: string;
}

function AnimatedBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="h-2 rounded-none bg-muted/20 overflow-hidden w-full">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-full rounded-none"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default function PersonalScoreCard({ profile }: PersonalScoreCardProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const lifePath = profile.lifePath;
  const element = profile.chineseZodiacInfo?.element ?? "Fuego";
  const animalProfile = useMemo(() => userAnimal ? getAnimalProfile(userAnimal) : null, [userAnimal]);

  const indicators = useMemo(() => {
    const yangAnimals = ["Rata", "Tigre", "Dragón", "Caballo", "Mono", "Perro"];
    const isYang = yangAnimals.includes(userAnimal);
    const elementScore = ELEMENT_SCORES[element] ?? 50;

    return [
      {
        label: "Movimiento",
        value: isYang ? 85 : 55,
        color: "#C49A2A",
        description: "Energía de acción y dinamismo",
      },
      {
        label: "Creatividad",
        value: [3, 7, 9].includes(lifePath) ? 85 : [1, 5].includes(lifePath) ? 70 : 50,
        color: "#4A6FA5",
        description: "Capacidad de expresión y creación",
      },
      {
        label: "Estabilidad",
        value: [2, 4, 6, 8].includes(lifePath) ? 80 : [1, 3].includes(lifePath) ? 55 : 65,
        color: "#2D5A3D",
        description: "Capacidad de construcción y consistencia",
      },
      {
        label: "Exploración",
        value: [5, 7, 9].includes(lifePath) ? 90 : [1, 3].includes(lifePath) ? 70 : 45,
        color: "#B45309",
        description: "Apertura a nuevas experiencias",
      },
    ];
  }, [userAnimal, lifePath, element]);

  return (
    <motion.section {...smoothReveal} className="mb-8">
      <div className="p-6 rounded-none border border-ink/10 bg-background">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Indicadores simbólicos</span>
        </div>

        <motion.div {...staggerApple} className="space-y-4">
          {indicators.map((ind, i) => (
            <motion.div key={ind.label} {...staggerItemSmooth} transition={{ delay: staggerDelay(i, 0.08) }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground">{ind.label}</span>
                <span className="text-xs text-muted">{ind.value}%</span>
              </div>
              <AnimatedBar value={ind.value} color={ind.color} delay={i * 0.1} />
              <p className="text-[10px] text-muted mt-1">{ind.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-4 pt-3 border-t border-ink/10">
          <p className="text-[10px] text-muted italic">
            Indicadores simbólicos basados en tradiciones culturales. No constituyen medición científica.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

const ELEMENT_SCORES: Record<string, number> = {
  Fuego: 75,
  Agua: 65,
  Tierra: 60,
  Madera: 70,
  Metal: 65,
};
