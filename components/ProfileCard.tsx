"use client";

import { motion } from "framer-motion";
import { Archetype } from "@/lib/data";
import EnergyBars from "./EnergyBars";
import NumberBadge from "./NumberBadge";

interface ProfileCardProps {
  archetype: Archetype;
  energyBars: Record<string, number>;
  name?: string;
}

export default function ProfileCard({ archetype, energyBars, name }: ProfileCardProps) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-lg border border-border">
      <div className="mb-4 flex items-start justify-between">
        <div>
          {name && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">
              Tu perfil
            </p>
          )}
          <h2 className="font-serif text-2xl font-bold text-foreground">{archetype.name}</h2>
          <p className="mt-1 text-sm text-muted">{archetype.keywords.join(" · ")}</p>
        </div>
        <NumberBadge number={archetype.number} color={archetype.color} size="md" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-5 text-sm leading-relaxed text-muted"
      >
        {archetype.description.slice(0, 160)}...
      </motion.p>

      <div className="mb-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
          Tu energía
        </p>
        <EnergyBars bars={energyBars} color={archetype.color} />
      </div>

      <blockquote
        className="mt-4 border-l-2 pl-3 text-sm italic text-muted"
        style={{ borderColor: archetype.color }}
      >
        &ldquo;{archetype.quote}&rdquo;
      </blockquote>
    </div>
  );
}
