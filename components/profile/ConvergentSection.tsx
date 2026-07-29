"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { buildConvergence, type Convergence } from "@/lib/engines/convergentEngine";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface ConvergentSectionProps {
  profile: UserProfile;
}

const LEVEL_STYLES: Record<string, { color: string; icon: string }> = {
  strong: { color: "#2D5A3D", icon: "🔥" },
  moderate: { color: "#4A6FA5", icon: "🌊" },
  low: { color: "#D4A843", icon: "🌿" },
};

export default function ConvergentSection({ profile }: ConvergentSectionProps) {
  const convergence = useMemo(() => buildConvergence(profile), [profile]);
  const levelStyle = LEVEL_STYLES[convergence.convergenceLevel];

  return (
    <section className="py-12 sm:py-16 border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Cuando todos tus patrones se encuentran</h2>
          </div>
        </motion.div>

        {/* Convergence level card */}
        <motion.div {...staggerApple} className="mt-6 space-y-4">
          {/* Main convergence card */}
          <motion.div
            {...staggerItemSmooth}
            className="p-6 rounded-none border border-ink/10 bg-background"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{levelStyle.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: levelStyle.color }}>
                  {convergence.message}
                </p>
                <p className="text-xs text-muted">
                  {convergence.convergentCount} de {convergence.totalLayers} capas convergentes
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {convergence.insight}
            </p>
          </motion.div>

          {/* Layer cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {convergence.layers.map((layer, i) => (
              <motion.div
                key={layer.id}
                {...staggerItemSmooth}
                transition={{ delay: staggerDelay(i, 0.08), duration: 0.3 }}
                className="p-4 rounded-none border border-ink/10 bg-background/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{layer.emoji}</span>
                  <span className="text-xs font-medium text-foreground">{layer.name}</span>
                </div>
                <p className="font-display text-xl font-bold text-foreground">{layer.value}</p>
                <p className="text-[10px] text-muted mt-1">{layer.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
