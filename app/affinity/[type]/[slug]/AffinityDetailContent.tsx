"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { useProfile } from "@/lib/hooks/useProfile";
import { useAffinityResult } from "@/lib/hooks/useAffinityResult";
import { TIER_META } from "@/lib/engines/affinityEngine";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import AffinityHero from "@/components/affinity/AffinityHero";
import AffinityDeepDive from "@/components/affinity/AffinityDeepDive";
import AffinityDiscoveryList from "@/components/affinity/AffinityDiscoveryList";
import AffinityQuickEntryForm from "@/components/affinity/AffinityQuickEntryForm";
import { SectionHeader } from "@/components/affinity/AffinitySectionPrimitives";
import AffinityShareableCard from "@/components/profile/AffinityShareableCard";
import AnimalQuickSelector from "@/components/affinity/AnimalQuickSelector";

interface AffinityDetailContentProps {
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
  /** Lightweight projections of ALL entities (for the discovery loop). */
  catalog: LightweightEntity[];
  /** Lightweight projections of same-type entities (for the quick selector). */
  sameType: LightweightEntity[];
}

export default function AffinityDetailContent({ entity, meta, type, catalog, sameType }: AffinityDetailContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const [showOtherEvents, setShowOtherEvents] = useState(false);

  const { result, relatedEntities } = useAffinityResult(profile, entity, catalog);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
          <p className="sr-only" role="status" aria-label="Cargando lectura...">
            Cargando lectura...
          </p>
          <div className="animate-pulse">
            <div className="h-3 bg-[var(--skeleton)] rounded w-10rem mb-6" />
            <div className="h-8 bg-[var(--skeleton)] rounded w-3/4 mb-4" />
            <div className="h-4 bg-[var(--skeleton)] rounded w-1/2 mb-8" />
            <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-md mb-6" />
            <div className="space-y-px bg-ink/10">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-[var(--skeleton)] border-b border-ink/10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <AffinityQuickEntryForm entity={entity} meta={meta} type={type} catalog={catalog} />
    );
  }

  const tierMeta = result ? TIER_META[result.tier] : null;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">

        {/* Back */}
        <motion.div {...fadeUp}>
          <button
            type="button"
            onClick={() => router.push(`/affinity/${type}`)}
            className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-flex items-center gap-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
          >
            &larr; {meta.plural}
          </button>
        </motion.div>

        {/* Hero — premium reveal */}
        {result && tierMeta && (
          <AffinityHero result={result} entity={entity} meta={meta} type={type} />
        )}

        {/* Quick selector — same type entities */}
        {result && profile && (
          <AnimalQuickSelector profile={profile} currentEntityId={entity.id} type={type} entities={sameType} />
        )}

         {/* Compartir esta afinidad — visible without scrolling */}
         {result && (
           <motion.section {...fadeUp} className="mb-12">
             <SectionHeader title="Compartí esta resonancia" />
             <AffinityShareableCard result={result} />
           </motion.section>
         )}

        {/* Deep-dive content — calc basis, relationship, why, other events, documented data, disclaimer, connection story */}
        {result && profile && (
          <AffinityDeepDive
            result={result}
            entity={entity}
            meta={meta}
            type={type}
            profile={profile}
            showOtherEvents={showOtherEvents}
            onToggleOtherEvents={() => setShowOtherEvents(v => !v)}
          />
        )}

        {/* Discovery loop — related entities across all types */}
        <AffinityDiscoveryList title="Explorá más" relatedEntities={relatedEntities} entityId={entity.id} type={type} />

        {/* CTAs */}
        <motion.section {...fadeUp}>
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/affinity/${type}`)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-3 text-sm border border-border bg-transparent text-muted hover:border-accent hover:text-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Ver todas las {meta.plural.toLowerCase()}
            </button>
            <button
              type="button"
              onClick={() => router.push("/conocimiento/zodiaco-chino")}
              className="text-sm text-accent hover:underline min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            >
              Conocé el zodíaco chino →
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

