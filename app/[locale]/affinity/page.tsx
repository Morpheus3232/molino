import type { LightweightEntity } from "@/types/atlas";
import { ENTITY_TYPES, getEntitiesByType, getAvailableTypes, toLightweightEntity, type EntityType } from "@/lib/data/symbolic-entities";
import { BRAND_LISTINGS, brandListingOf, type BrandListing } from "@/lib/data/brand-kinds";
import AffinityClient from "./AffinityClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Afinidad",
  description: "Descubrí la afinidad simbólica entre vos y el mundo: marcas, países, ciudades y personas históricas.",
  path: "/affinity",
  // Sin perfil no hay nada que mostrar (pide crear el mapa): fuera del índice,
  // pero los enlaces se siguen. Las listas por categoría sí se indexan.
  noIndex: true,
  ogTitle: "Afinidad",
  ogDescription: "Afinidad simbólica entre vos y el mundo.",
  image: "/opengraph-image",
});

/**
 * Server Component: builds the lightweight per-type projections (no events,
 * no prose) and passes them to the client hub. The rich data layer and the
 * engines never reach the client bundle — only the minimal payload does.
 */
export default function AffinityPage() {
  const byType: Record<string, LightweightEntity[]> = {};
  const typeMeta: Record<string, (typeof ENTITY_TYPES)[EntityType]> = {};
  for (const type of getAvailableTypes()) {
    if (type !== "brand") {
      byType[type] = getEntitiesByType(type).map(toLightweightEntity);
      typeMeta[type] = ENTITY_TYPES[type];
      continue;
    }
    // Las marcas se abren en tres listados: autos, ropa y el resto.
    const brands = getEntitiesByType("brand");
    for (const listing of ["autos", "ropa", "brand"] as BrandListing[]) {
      byType[listing] = brands.filter((e) => brandListingOf(e.category) === listing).map(toLightweightEntity);
      typeMeta[listing] = BRAND_LISTINGS[listing];
    }
  }

  return <AffinityClient byType={byType} typeMeta={typeMeta} />;
}
