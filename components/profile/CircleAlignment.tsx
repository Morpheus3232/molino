"use client";
import { useL } from "@/lib/i18n/useL";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import { useRevealFallback } from "@/lib/hooks/useRevealFallback";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { getAnimalBirthYears, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import ZodiacAnimalIcon from "@/components/ui/ZodiacAnimalIcon";
import type { UserProfile } from "@/types/user";

interface CircleAlignmentProps {
  profile: UserProfile;
}

export default function CircleAlignment({ profile }: CircleAlignmentProps) {
  const L = useL();
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
          <p className="text-sm text-muted mb-4 label-caps">{L("03 · Tu círculo", "03 · Your circle")}</p>
          <h2 id="circle-heading" className="font-display text-3xl sm:text-4xl tracking-tight text-foreground leading-[1.05] max-w-2xl mb-8">{L("Tu energía no llega sola", "Your energy doesn't come alone")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 border border-ink/10 rounded-lg bg-background"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-accent)" }} />
                <h3 className="font-medium text-foreground">{L("BUENA COMPATIBILIDAD — Animales aliados", "GOOD COMPATIBILITY — Allied animals")}</h3>
              </div>
              <p className="text-sm text-muted mb-4">{L(<>
                Tu {L.t(display.name)} de {L.t(profile.chineseZodiacInfo?.element)} tiene buena compatibilidad con estos animales aliados. Juntos crean un ciclo de apoyo mutuo.
              </>, <>Your {L.t(profile.chineseZodiacInfo?.element)} {L.t(display.name)} is highly compatible with these allied animals. Together they create a cycle of mutual support.</>)}</p>
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
                <h3 className="font-medium text-foreground">{L("ENERGÍA OPUESTA — Posición de contraste", "OPPOSITE ENERGY — Position of contrast")}</h3>
              </div>
              <p className="text-sm text-muted mb-4">{L(<>
                El animal que ocupa la posición opuesta a la tuya muestra dónde aparece fricción natural. No es &ldquo;malo&rdquo;: es donde más aprendés.
              </>, <>The animal in the position opposite yours shows where natural friction appears. It isn't &ldquo;bad&rdquo;: it's where you learn the most.</>)}</p>
              {challenges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {challenges.map((ch, i) => (
                    <AnimalCard key={i} animal={ch} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">{L("Sin contraste directo en este ciclo.", "No direct contrast in this cycle.")}</p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimalCard({ animal }: { animal: Animal }) {
  const L = useL();
  const display = getZodiacDisplay(animal);
  const years = getAnimalBirthYears(animal);
  return (
    <div className="min-w-[150px] px-4 py-3 border border-ink/10 rounded-lg bg-background">
      <div className="flex items-center gap-2 mb-2">
        <ZodiacAnimalIcon animal={animal} size={20} className="text-accent" />
        <span className="font-medium">{L.t(display.name)}</span>
      </div>
      <p className="text-sm text-muted mb-1.5 label-caps">{L("Años de nacimiento", "Birth years")}</p>
      <p className="font-mono text-xs text-muted leading-relaxed">{L.t(years.map(L.t).join(" · "))}</p>
    </div>
  );
}
