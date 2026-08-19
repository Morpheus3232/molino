"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import type { ProfileTab } from "./ProfileTabs";

interface MapaMundoProps {
  profile: UserProfile;
  worldCount: number;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function MapaMundo({ profile, worldCount, onNavigate }: MapaMundoProps) {
  const reduceMotion = useSafeReducedMotion();

  const reveal = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" } as const,
    transition: { duration: reduceMotion ? 0.1 : 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[860px] px-5 sm:px-8 lg:px-12">
        <motion.div {...reveal}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-10">
            02 · Tu mundo
          </p>

          <h2 className="font-display text-[clamp(1.5rem,4.5vw,3rem)] tracking-tight text-foreground leading-[1.05] max-w-[620px]">
            Hay lugares, marcas e historias
            que comparten ciertos patrones contigo
          </h2>

          <div className="mt-14 flex items-end gap-4 sm:gap-6">
            <span className="font-display text-[clamp(4rem,16vw,8rem)] leading-none tracking-tight text-accent">
              {worldCount}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted pb-2 sm:pb-3">
              conexiones<br />descubiertas
            </span>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate("world")}
              className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors"
            >
              Explorar tu mundo →
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
