"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LightweightEntity } from "@/types/atlas";
import EntityVisual from "@/components/ui/EntityVisual";

interface EntityCardProps {
  entity: LightweightEntity;
  countryISO: string;
  category: string;
}

/**
 * A single entity card in the category listing. Uses EntityVisual for the
 * correct asset (flag/logo/portrait/album/fallback) and links to the entity's
 * affinity page. Receives only LightweightEntity.
 */
export default function EntityCard({ entity, countryISO, category }: EntityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Link
        href={`/affinity/${category}/${entity.id}`}
        className="group flex items-center gap-4 p-4 rounded-2xl border border-ink/10 bg-card hover:border-accent/40 hover:bg-ink/[0.02] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <EntityVisual
          visualType={entity.visualType}
          emoji={entity.emoji}
          imageUrl={entity.imageUrl}
          name={entity.name}
          countryISO={entity.countryISO}
          size={44}
        />
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-foreground group-hover:text-accent transition-colors truncate">
            {entity.name}
          </p>
          <p className="text-xs text-muted mt-0.5">{entity.animal}</p>
        </div>
        <span className="text-accent group-hover:translate-x-1 transition-transform shrink-0" aria-hidden="true">
          →
        </span>
      </Link>
    </motion.div>
  );
}
