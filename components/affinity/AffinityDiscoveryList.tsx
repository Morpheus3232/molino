"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { TIER_META } from "@/lib/engines/affinityEngine";
import type { EntityType } from "@/lib/data/symbolic-entities";
import type { VisualType } from "@/types/atlas";
import type { LightAffinityResult } from "@/lib/affinity-light";
import EntityVisual from "@/components/ui/EntityVisual";
import { SectionHeader } from "@/components/affinity/AffinitySectionPrimitives";
import { analytics } from "@/lib/analytics/analytics";

const TYPE_LABEL: Record<string, string> = {
  brand: "Marca", city: "Ciudad", country: "País", university: "Universidad",
  team: "Equipo", movie: "Película", artist: "Famoso",
};

/**
 * "Related entities" discovery loop — identical in the with-profile flow and
 * the P0 quick-entry flow (only the section title differs), previously
 * duplicated verbatim in both places.
 */
export default function AffinityDiscoveryList({
  title,
  relatedEntities,
  entityId,
  type,
}: {
  title: string;
  relatedEntities: LightAffinityResult[];
  entityId: string;
  type: EntityType;
}) {
  if (relatedEntities.length === 0) return null;

  return (
    <motion.section {...fadeUp} className="mb-12">
      <SectionHeader title={title} />
      <div className="space-y-3">
        {relatedEntities.map((rel, idx) => {
          const relTier = TIER_META[rel.tier];
          const typeLabel = TYPE_LABEL[rel.type] ?? rel.type;
          return (
            <Link
              key={rel.id}
              href={`/affinity/${rel.type}/${rel.id}`}
              onClick={() => analytics.trackAffinityRecommendationClicked(type, entityId, rel.id, idx)}
              className="block w-full text-left p-4 border border-ink/10 bg-transparent hover:border-accent/40 transition-colors group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-3">
                <EntityVisual visualType={rel.visualType as VisualType} emoji={rel.emoji} name={rel.name} countryISO={rel.countryISO} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                    {rel.name}
                  </p>
                  <p className="text-xs text-muted">
                    {typeLabel}
                    <span aria-hidden="true"> · </span>
                    {rel.relationship}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-sm uppercase tracking-[0.05em]"
                    style={{ color: relTier.color, backgroundColor: `${relTier.color}12` }}
                  >
                    {relTier.label}
                  </span>
                  <span className="text-xs text-accent group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
