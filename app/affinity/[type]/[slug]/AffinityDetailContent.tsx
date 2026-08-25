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
import { formatViewAll } from "@/lib/utils/plural";
import AffinityQuickEntryForm from "@/components/affinity/AffinityQuickEntryForm";

interface AffinityDetailContentProps {
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
  /** Lightweight projections of ALL entities (for the discovery loop). */
  catalog: LightweightEntity[];
}

export default function AffinityDetailContent({ entity, meta, type, catalog }: AffinityDetailContentProps) {
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const [showOtherEvents, setShowOtherEvents] = useState(false);

  const { result } = useAffinityResult(profile, entity);

  if (!mounted) {
    return (
      <div role="status" aria-label="Cargando lectura personalizada..." className="animate-pulse">
        <p className="sr-only">Cargando lectura personalizada...</p>
        <div className="h-64 bg-[var(--skeleton)] border border-ink/10 rounded-md mb-6" />
        <div className="space-y-px bg-ink/10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-[var(--skeleton)] border-b border-ink/10" />
          ))}
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
    <>
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

      {/* CTAs */}
      <motion.section {...fadeUp}>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/affinity/${type}`)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all px-6 py-3 text-sm border border-border bg-transparent text-muted hover:border-accent hover:text-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {formatViewAll(type, meta.plural)}
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
    </>
  );
}

