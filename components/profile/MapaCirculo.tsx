"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import type { ProfileTab } from "./ProfileTabs";

interface MapaCirculoProps {
  profile: UserProfile;
  allies: string[];
  onNavigate?: (tab: ProfileTab) => void;
}

export default function MapaCirculo({ profile, allies, onNavigate }: MapaCirculoProps) {
  const reduceMotion = useSafeReducedMotion();
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;

  const relationMap = getRelationshipMap(userAnimal);
  const tension = relationMap.challenging[0]?.animal;

  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" } as const,
    transition: { duration: reduceMotion ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  const alliesLine = allies.length > 0 ? allies.join(" · ") : "tu mismo animal";

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[860px] px-5 sm:px-8 lg:px-12">
        <motion.div {...reveal}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-10">
            03 · Tu círculo
          </p>

          <h2 className="font-display text-[clamp(1.5rem,4.5vw,3rem)] tracking-tight text-foreground leading-[1.05] max-w-[620px]">
            No todas las energías llegan para acompañar
          </h2>

          <p className="mt-8 text-base sm:text-lg text-muted leading-relaxed max-w-[600px]">
            Algunas vienen a impulsarte. Otras a desafiarte. Tu mapa
            muestra quiénes son.
          </p>

          <div className="mt-14 flex flex-col gap-8 max-w-[520px]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-3">
                Aliados
              </p>
              <p className="font-display text-lg sm:text-xl text-foreground tracking-tight">
                {alliesLine}
              </p>
            </div>

            {tension && (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-3">
                  Contraste
                </p>
                <p className="font-display text-lg sm:text-xl text-foreground tracking-tight">
                  {tension}
                </p>
              </div>
            )}
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate("circle")}
              className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors"
            >
              Explorar tu círculo →
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
