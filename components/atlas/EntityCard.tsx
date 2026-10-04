"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";
import type { ResonanceInfo } from "@/lib/resonance";

interface EntityCardProps {
  entity: LightweightEntity;
  countryISO: string;
  category: string;
  /** Optional resonance classification vs the active reference animal. */
  resonance?: ResonanceInfo;
  /** Optional Molino-voice reasoning for the resonance (refutable observation). */
  reasoning?: string;
}

// Sober, analytical tone — no cheap esotericism. Success for harmony,
// warning for tension, muted for neutral.
const RESONANCE_STYLE: Record<string, { label: string; className: string }> = {
  affine: { label: "Afinidad", className: "text-success bg-success/10 border-success/30" },
  tension: { label: "Tensión", className: "text-warning bg-warning/10 border-warning/30" },
  neutral: { label: "Neutro", className: "text-muted bg-ink/[0.04] border-ink/10" },
};

export default function EntityCard({ entity, countryISO, category, resonance, reasoning }: EntityCardProps) {
  const resonanceStyle = resonance ? RESONANCE_STYLE[resonance.bucket] : null;

  const content = (
    <>
      <EntityVisual
        visualType={entity.visualType}
        emoji={entity.emoji}
        imageUrl={entity.imageUrl}
        name={entity.name}
        countryISO={entity.countryISO}
        type={entity.type}
        category={entity.category}
        size={44}
      />
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-foreground group-hover:text-accent transition-colors truncate">
          {entity.name}
        </p>
        <p className="text-xs text-muted mt-0.5">
          {entity.animal}
          {entity.origin ? ` · ${entity.origin}` : ""}
        </p>
        {reasoning && (
          <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
            {reasoning}
          </p>
        )}
      </div>

      {resonanceStyle && resonance && (
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider border ${resonanceStyle.className}`}
          title={resonance.label}
        >
          {resonanceStyle.label}
        </span>
      )}

      <span className="text-accent group-hover:translate-x-1 transition-transform shrink-0" aria-hidden="true">
        →
      </span>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Link
        href={`/affinity/${category}/${entity.id}`}
        className="group flex items-center gap-4 p-4 rounded-lg border border-ink/10 bg-card hover:border-accent/40 hover:bg-ink/[0.02] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    </motion.div>
  );
}
