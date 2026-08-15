import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import { getPrimaryEvent } from "@/lib/data/entity-events";
import type { LightweightEntity } from "@/types/atlas";
import { siteUrl } from "@/lib/seo";

/** Schema.org @type per Atlas category. */
const SCHEMA_TYPE: Record<EntityType, string> = {
  city: "City",
  country: "Country",
  brand: "Organization",
  team: "SportsTeam",
  university: "CollegeOrUniversity",
  artist: "Person",
  movie: "Movie",
};

/** JSON-LD for a single entity's affinity detail page (/affinity/[type]/[slug]). */
export function buildEntityJsonLd(entity: SymbolicEntity, type: EntityType, path: string) {
  const primaryEvent = getPrimaryEvent(entity);
  const foundingDate = primaryEvent?.date ?? (primaryEvent ? String(primaryEvent.year) : undefined);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[type],
    name: entity.name,
    description: entity.description,
    url: siteUrl(path),
  };

  if (entity.imageUrl) jsonLd.image = entity.imageUrl;

  switch (type) {
    case "city":
      if (entity.country) jsonLd.containedInPlace = { "@type": "Country", name: entity.country };
      break;
    case "brand":
    case "team":
    case "university":
      if (foundingDate) jsonLd.foundingDate = foundingDate;
      if (entity.country) {
        jsonLd.location = {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressCountry: entity.country },
        };
      }
      break;
    case "movie":
      if (foundingDate) jsonLd.datePublished = foundingDate;
      break;
    case "country":
    case "artist":
      break;
  }

  return jsonLd;
}

/** JSON-LD ItemList for a category listing page (/atlas/explorar/[animal]/[category]). */
export function buildEntityListJsonLd(entities: LightweightEntity[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entities.map((entity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entity.name,
      url: siteUrl(`/affinity/${entity.type}/${entity.id}`),
    })),
  };
}
