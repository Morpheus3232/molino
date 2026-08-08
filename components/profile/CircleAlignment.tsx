"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import type { UserProfile } from "@/types/user";

interface CircleAlignmentProps {
  profile: UserProfile;
}

export default function CircleAlignment({ profile }: CircleAlignmentProps) {
  const reduceMotion = useSafeReducedMotion();
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const relationMap = getRelationshipMap(userAnimal);
  const display = getZodiacDisplay(userAnimal);

  const allies = [
    ...relationMap.friends.filter((f) => f.type === "triad"),
    ...relationMap.friends.filter((f) => f.type === "harmonious"),
  ].map((f) => f.animal);
  const challenges = relationMap.challenging.map((c) => c.animal);

  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" } as const,
    transition: { duration: reduceMotion ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <section className="py-16 sm:py-24" aria-labelledby="circle-heading">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div {...reveal}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
            03 · Tu círculo
          </p>
          <h2 id="circle-heading" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[1.05] max-w-2xl mb-8">
            Tu energía no llega sola
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 border border-ink/10 rounded-lg bg-background"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-accent)" }} />
                <h3 className="font-medium text-foreground">ALIADOS — Energías que amplifican</h3>
              </div>
              <p className="text-sm text-muted mb-4">
                Tu {display.name} de {profile.chineseZodiacInfo?.element} forma tríada armónica con estos animales. Juntos crean un ciclo de apoyo mutuo.
              </p>
              <div className="flex flex-wrap gap-3">
                {allies.map((ally, i) => {
                  const allyDisplay = getZodiacDisplay(ally);
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-ink/10 rounded-full bg-background text-sm"
                    >
                      <span role="img" aria-label={allyDisplay.name}>{allyDisplay.emoji}</span>
                      <span className="font-medium">{allyDisplay.name}</span>
                    </span>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 border border-ink/10 rounded-lg bg-background"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-muted)" }} />
                <h3 className="font-medium text-foreground">CONTRASTE — Energía que desafía</h3>
              </div>
              <p className="text-sm text-muted mb-4">
                El animal opuesto en el ciclo muestra dónde aparece fricción natural. No es &ldquo;malo&rdquo;: es donde más aprendés.
              </p>
              {challenges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {challenges.map((ch, i) => {
                    const chDisplay = getZodiacDisplay(ch);
                    return (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-ink/10 rounded-full bg-background text-sm"
                      >
                        <span role="img" aria-label={chDisplay.name}>{chDisplay.emoji}</span>
                        <span className="font-medium">{chDisplay.name}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted">Sin contraste directo en este ciclo.</p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
