"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import {
  smoothReveal,
  cardReveal,
  staggerApple,
  staggerItemSmooth,
  staggerDelay,
} from "@/lib/utils/premiumMotion";
import type { UserProfile } from "@/types/user";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { formatAnimalEmoji, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";

interface ContrastSectionProps {
  profile: UserProfile;
}

export default function ContrastSection({ profile }: ContrastSectionProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);

  if (!userAnimal || relationMap.challenging.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Contrastes personales</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Algunas tradiciones consideran estos símbolos como energías opuestas o desafiantes para tu <span className="font-medium text-foreground">{formatAnimalSimple(userAnimal)}</span>.
          </p>
        </motion.div>

        <motion.div {...staggerApple} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relationMap.challenging.map((rel, i) => (
            <motion.div
              key={rel.animal}
              {...staggerItemSmooth}
              transition={{ duration: 0.4, delay: staggerDelay(i, 0.08) }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{formatAnimalEmoji(rel.animal)}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{rel.animal}</p>
                  <p className="text-[10px] text-muted">
                    {rel.type === "clash" ? "Opuestos en el ciclo" : "Relación de atención"}
                  </p>
                </div>
                <span className="ml-auto text-xs font-medium text-[#B45309]">★★☆☆☆</span>
              </div>
              <p className="text-xs text-muted/70 leading-relaxed">
                {rel.type === "clash"
                  ? `${userAnimal} y ${rel.animal} son opuestos directos en el ciclo (Liu Chong). Según esta tradición, requiere más consciencia y estrategia.`
                  : `${userAnimal} y ${rel.animal} tienen una relación de mayor atención (Liu Hai). La tradición sugiere actuar con cuidado y planificación.`}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...smoothReveal} className="mt-6">
          <p className="text-xs text-muted/50 italic text-center">
            Relaciones de adaptación según la tradición. No son negativas — son oportunidades de crecimiento y mayor consciencia.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
