import type { LightweightEntity } from "@/types/atlas";
import { ENTITY_TYPES, getEntitiesByType, getAvailableTypes, toLightweightEntity, type EntityType } from "@/lib/data/symbolic-entities";
import AffinityClient from "./AffinityClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Afinidad",
  description: "Descubrí la afinidad simbólica entre vos y el mundo: marcas, países, ciudades y personas históricas.",
  path: "/affinity",
  ogTitle: "Afinidad — Molino",
  ogDescription: "Afinidad simbólica entre vos y el mundo.",
  image: "/opengraph-image",
});

/**
 * Server Component: builds the lightweight per-type projections (no events,
 * no prose) and passes them to the client hub. The rich data layer and the
 * engines never reach the client bundle — only the minimal payload does.
 */
export default function AffinityPage() {
  const types = getAvailableTypes();
  const byType: Record<string, LightweightEntity[]> = {};
  for (const type of types) {
    byType[type] = getEntitiesByType(type).map(toLightweightEntity);
  }
  const typeMeta = Object.fromEntries(types.map((t) => [t, ENTITY_TYPES[t as EntityType]]));

  return <AffinityClient byType={byType} typeMeta={typeMeta} />;
}
