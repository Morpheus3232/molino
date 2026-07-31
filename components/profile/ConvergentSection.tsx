"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { buildConvergence } from "@/lib/engines/convergentEngine";
import EditorialSection from "@/components/ui/EditorialSection";

interface ConvergentSectionProps {
  profile: UserProfile;
}

export default function ConvergentSection({ profile }: ConvergentSectionProps) {
  const convergence = useMemo(() => buildConvergence(profile), [profile]);

  return (
    <EditorialSection
      tone="paperAlt"
      eyebrow="CONVERGENCIA"
      title={<>CUANDO TODOS TUS<br />PATRONES SE ENCUENTRAN.</>}
    >
      <div className="pt-4">
        {/* El número — evidencia principal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="flex items-baseline gap-3 mb-6"
        >
          <span className="font-display text-[clamp(5rem,18vw,10rem)] leading-[0.85] tracking-tight text-accent">
            {convergence.convergentCount}
          </span>
          <span className="font-display text-2xl sm:text-3xl text-ink/30 leading-none">
            / {convergence.totalLayers}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="label-micro text-muted mb-5"
        >
          Capas alineadas
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-foreground leading-relaxed max-w-2xl"
        >
          {convergence.insight}
        </motion.p>

        {/* Capas como evidencia — filas, sin tarjetas */}
        <div className="mt-12">
          {convergence.layers.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-baseline justify-between gap-4 py-4 border-b border-ink/10 last:border-b-0"
            >
              <span className="text-sm text-muted">{layer.name}</span>
              <span className="font-display text-lg text-foreground">{layer.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </EditorialSection>
  );
}
