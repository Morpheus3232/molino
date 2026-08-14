/**
 * Server-only affinity highlights — the one engine helper that needs the
 * full catalog. Kept out of affinityEngine.ts so the engine (and its math)
 * can be used by client-safe code without dragging SYMBOLIC_ENTITIES in.
 */

import "server-only";

import type { UserProfile } from "@/types/user";
import { SYMBOLIC_ENTITIES, focusEntitiesByCountry } from "@/lib/data/symbolic-entities";
import { calculateAllAffinity, type AffinityResult } from "@/lib/engines/affinityEngine";

/** The three categories surfaced in the profile summary highlights. */
export type AffinityHighlightType = "brand" | "city" | "country";

/**
 * Get top affinity highlight per category for the profile summary.
 *
 * userCountry acota "city" a las ciudades del propio país cuando hay
 * cobertura local (ver focusEntitiesByCountry) — el highlight de un
 * visitante de Chile debería poder ser una ciudad chilena, no siempre la
 * ciudad global con mejor puntaje.
 */
export function getTopAffinityHighlights(profile: UserProfile, userCountry?: string): AffinityResult[] {
  const highlightTypes: AffinityHighlightType[] = ["brand", "city", "country"];
  return highlightTypes
    .map((type) => {
      const entities = focusEntitiesByCountry(SYMBOLIC_ENTITIES.filter((e) => e.type === type), type, userCountry);
      if (entities.length === 0) return null;
      return calculateAllAffinity(profile, entities)[0];
    })
    .filter((r): r is AffinityResult => r !== null);
}
