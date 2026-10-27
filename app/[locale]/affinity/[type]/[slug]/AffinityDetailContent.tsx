"use client";
import { useL } from "@/lib/i18n/useL";

import { useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { useAffinityResult } from "@/lib/hooks/useAffinityResult";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import AffinityHero from "@/components/affinity/AffinityHero";
import AffinityDeepDive from "@/components/affinity/AffinityDeepDive";
import { formatViewAll } from "@/lib/utils/plural";
import { affinityListingOf } from "@/lib/data/brand-kinds";
import AffinityQuickEntryForm from "@/components/affinity/AffinityQuickEntryForm";

interface AffinityDetailContentProps {
  entity: SymbolicEntity;
  meta: { label: string; plural: string; icon: string; description: string };
  type: EntityType;
}

export default function AffinityDetailContent({ entity, meta, type }: AffinityDetailContentProps) {
  const L = useL();
  const router = useRouter();
  const { profile, mounted } = useProfile({ redirectIfNotFound: false });
  const [showOtherEvents, setShowOtherEvents] = useState(false);

  const { result } = useAffinityResult(profile, entity);

  if (!mounted) {
    return (
      <div role="status" aria-label={L("Cargando lectura personalizada...", "Loading personalized reading...")} className="animate-pulse">
        <p className="sr-only">{L("Cargando lectura personalizada...", "Loading personalized reading...")}</p>
        <div className="h-64 bg-[var(--skeleton)] border border-ink/10 mb-6" />
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
      <AffinityQuickEntryForm entity={entity} meta={meta} type={type} />
    );
  }

  return (
    <>
      {result && <AffinityHero result={result} entity={entity} meta={meta} type={type} />}
      {result && profile && (
        <AffinityDeepDive
          result={result}
          entity={entity}
          meta={meta}
          type={type}
          profile={profile}
          showOtherEvents={showOtherEvents}
          onToggleOtherEvents={() => setShowOtherEvents((v) => !v)}
        />
      )}
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-base">
        <button type="button" onClick={() => router.push(`/affinity/${affinityListingOf(entity)}`)} className="underline underline-offset-4 hover:no-underline">
          {L.t(formatViewAll(type, meta.plural))}
        </button>
        <button type="button" onClick={() => router.push("/conocimiento/zodiaco-chino")} className="underline underline-offset-4 hover:no-underline">{L("Conocé el zodíaco chino", "Get to know the Chinese zodiac")}</button>
      </div>
    </>
  );
}
