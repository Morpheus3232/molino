"use client";

import { useMemo } from "react";
import { calculateAffinity, type AffinityResult } from "@/lib/engines/affinityEngine";
import { sortLightEntities, type LightAffinityResult } from "@/lib/affinity-light";
import type { SymbolicEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import type { UserProfile } from "@/types/user";

/**
 * Affinity result + top-3 discovery recommendations for a given profile and
 * entity. Shared by the with-profile flow (AffinityDetailContent) and the
 * P0 quick-entry flow (AffinityQuickEntryForm) — both used to run this same
 * pair of calculations independently.
 */
export function useAffinityResult(
  profile: UserProfile | null,
  entity: SymbolicEntity,
  catalog: LightweightEntity[],
): { result: AffinityResult | null; relatedEntities: LightAffinityResult[] } {
  const result = useMemo(() => {
    if (!profile) return null;
    return calculateAffinity(profile, entity);
  }, [profile, entity]);

  const relatedEntities = useMemo(() => {
    if (!profile || !result) return [];
    const userAnimal = profile.chineseZodiac || "";
    return sortLightEntities(userAnimal, catalog)
      .filter((r) => r.id !== entity.id)
      .slice(0, 3);
  }, [profile, entity, result, catalog]);

  return { result, relatedEntities };
}
