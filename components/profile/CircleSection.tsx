"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { formatAnimalEmoji, formatAnimalSimple, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface CircleSectionProps {
  profile: UserProfile;
}

export default function CircleSection({ profile }: CircleSectionProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const display = getZodiacDisplay(userAnimal);

  if (!userAnimal) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Mi círculo</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Estos símbolos aparecen frecuentemente asociados con tu perfil de{" "}
            <span className="font-medium text-foreground">{display.name}</span>.
          </p>
        </motion.div>

        {/* Center: user animal */}
        <motion.div {...staggerApple} className="mt-8">
          <div className="flex flex-col items-center">
            {/* User animal in center */}
            <motion.div
              {...staggerItemSmooth}
              className="w-24 h-24 rounded-full border-2 border-accent flex items-center justify-center mb-4"
            >
              <span className="text-4xl">{display.emoji}</span>
            </motion.div>
            <p className="font-serif text-lg font-semibold text-foreground mb-6">{display.name}</p>

            {/* Friends ring */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {relationMap.friends.map((rel, i) => {
                const relDisplay = getZodiacDisplay(rel.animal);
                return (
                  <motion.div
                    key={rel.animal}
                    {...staggerItemSmooth}
                    transition={{ delay: staggerDelay(i, 0.1), duration: 0.4 }}
                    className="flex flex-col items-center p-4 rounded-xl border border-border bg-background/50"
                  >
                    <span className="text-2xl mb-1">{relDisplay.emoji}</span>
                    <p className="text-xs font-medium text-foreground text-center">{relDisplay.name}</p>
                    <p className="text-[9px] text-muted text-center mt-0.5">
                      {rel.type === "triad" ? "Tríada" : "Armonía"}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Explanation */}
        <motion.div {...smoothReveal} className="mt-6 text-center">
          <p className="text-xs text-muted/60 italic">
            Signos tradicionalmente asociados con mayor armonía y sintonía.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
