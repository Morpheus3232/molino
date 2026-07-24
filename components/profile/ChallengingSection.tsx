"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { SYMBOLIC_ENTITIES } from "@/lib/data/symbolic-entities";
import { getPrimaryEvent } from "@/lib/data/symbolic-entities";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { formatAnimalEmoji, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface ChallengingSectionProps {
  profile: UserProfile;
}

export default function ChallengingSection({ profile }: ChallengingSectionProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);

  // Find entities with challenging animals
  const challengingEntities = useMemo(() => {
    const challengingAnimals = new Set<string>(relationMap.challenging.map(r => r.animal));
    return SYMBOLIC_ENTITIES
      .filter(entity => {
        const event = getPrimaryEvent(entity);
        const { animal } = calculateAnimalFromDate(event?.date, event?.year);
        return challengingAnimals.has(animal as string);
      })
      .slice(0, 4);
  }, [relationMap]);

  if (!userAnimal || relationMap.challenging.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Lo que conviene observar</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            No significa prohibición. Son símbolos de menor armonía dentro del sistema.
            Podrías sentir menos resonancia simbólica con estos símbolos.
          </p>
        </motion.div>

        {/* Challenging animals */}
        <motion.div {...staggerApple} className="mt-6 flex flex-wrap gap-3">
          {relationMap.challenging.map((rel, i) => (
            <motion.div
              key={rel.animal}
              {...staggerItemSmooth}
              transition={{ delay: staggerDelay(i, 0.08), duration: 0.3 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card"
            >
              <span className="text-2xl">{formatAnimalEmoji(rel.animal)}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{rel.animal}</p>
                <p className="text-[10px] text-muted">
                  {rel.type === "clash" ? "Opuestos en el ciclo" : "Relación de atención"}
                </p>
              </div>
              <span className="text-xs font-medium text-[#B45309]">★★☆☆☆</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Challenging entities */}
        {challengingEntities.length > 0 && (
          <motion.div {...staggerApple} className="mt-6 space-y-3">
            {challengingEntities.map((entity, i) => {
              const event = getPrimaryEvent(entity);
              const { animal } = calculateAnimalFromDate(event?.date, event?.year);
              return (
                <motion.button
                  key={entity.id}
                  {...staggerItemSmooth}
                  transition={{ delay: staggerDelay(i, 0.08), duration: 0.3 }}
                  onClick={() => router.push(`/affinity/${entity.type}/${entity.id}`)}
                  className="w-full text-left p-4 rounded-xl border border-border bg-background/50 hover:border-accent/50 transition-colors group flex items-center gap-3"
                >
                  <span className="text-xl">{entity.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">{entity.name}</p>
                    <p className="text-[10px] text-muted">{formatAnimalSimple(animal)}</p>
                  </div>
                  <span className="text-[10px] text-[#B45309]">★★☆☆☆</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div {...smoothReveal} className="mt-6">
          <p className="text-[10px] text-muted/50 italic text-center">
            No es una recomendación de evitar. Son símbolos complementarios que requieren mayor consciencia.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
