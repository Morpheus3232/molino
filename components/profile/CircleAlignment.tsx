"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { useRevealFallback } from "@/lib/hooks/useRevealFallback";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { getAnimalBirthYears, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import type { UserProfile } from "@/types/user";

interface CircleAlignmentProps {
  profile: UserProfile;
}

export default function CircleAlignment({ profile }: CircleAlignmentProps) {
  const reduceMotion = useSafeReducedMotion();
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const relationMap = getRelationshipMap(userAnimal);
  const display = getZodiacDisplay(userAnimal);

  const allies = relationMap.friends
    .filter((f) => f.type === "triad")
    .map((f) => f.animal);
  const challenges = relationMap.challenging.map((c) => c.animal);

  // Failsafe anti-blanco: si whileInView no dispara Y la sección ya está
  // cerca del viewport, animate fuerza visible tras 1.5s — ver
  // useRevealFallback. Below-the-fold sigue dependiendo de whileInView.
  const { ref, forceVisible } = useRevealFallback<HTMLDivElement>();
  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    ...(forceVisible
      ? { animate: { opacity: 1, y: 0 } }
      : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" } as const }),
    transition: { duration: reduceMotion ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <section className="py-16 sm:py-24" aria-labelledby="circle-heading">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div ref={ref} {...reveal}>
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
                {allies.map((ally, i) => (
                  <AnimalCard key={i} animal={ally} />
                ))}
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
                  {challenges.map((ch, i) => (
                    <AnimalCard key={i} animal={ch} />
                  ))}
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

function AnimalCard({ animal }: { animal: Animal }) {
  const display = getZodiacDisplay(animal);
  const years = getAnimalBirthYears(animal);
  return (
    <div className="min-w-[150px] px-4 py-3 border border-ink/10 rounded-lg bg-background">
      <div className="flex items-center gap-2 mb-2">
        <span role="img" aria-label={display.name}>{display.emoji}</span>
        <span className="font-medium">{display.name}</span>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1.5">
        Años de nacimiento
      </p>
      <p className="font-mono text-xs text-muted leading-relaxed">{years.join(" · ")}</p>
    </div>
  );
}
