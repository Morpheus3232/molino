"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import EditorialSection from "@/components/ui/EditorialSection";
import { getScoreLabel } from "@/lib/utils/score";

interface PersonalScoreCardProps {
  profile: UserProfile;
}

interface ScoreIndicator {
  label: string;
  value: number;
  color: string;
  description: string;
}

export default function PersonalScoreCard({ profile }: PersonalScoreCardProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const lifePath = profile.lifePath;

  const indicators = useMemo(() => {
    const yangAnimals = ["Rata", "Tigre", "Dragón", "Caballo", "Mono", "Perro"];
    const isYang = yangAnimals.includes(userAnimal);

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
  }, [userAnimal, lifePath]);

  return (
    <EditorialSection
      tone="paperAlt"
      eyebrow="INDICADORES SIMBÓLICOS"
      title={<>CÓMO SE EXPRESA<br />TU ENERGÍA.</>}
    >
      <div className="pt-4">
        {indicators.map((ind, i) => (
          <motion.div
            key={ind.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="py-6 border-b border-ink/10 last:border-b-0"
          >
            <div className="flex items-baseline justify-between gap-6 mb-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted font-semibold">
                {ind.label}
              </span>
              <span className="font-display text-2xl sm:text-3xl leading-none tracking-tight uppercase" style={{ color: ind.color }}>
                {getScoreLabel(ind.value)}
              </span>
            </div>
            <p className="text-sm text-muted">{ind.description}</p>
          </motion.div>
        ))}

        <p className="mt-8 text-xs text-muted italic">
          Indicadores simbólicos basados en tradiciones culturales. No constituyen medición científica.
        </p>
      </div>
    </EditorialSection>
  );
}
