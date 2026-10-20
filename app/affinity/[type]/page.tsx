import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { ENTITY_TYPES, getEntitiesByType, toLightweightEntity, type EntityType } from "@/lib/data/symbolic-entities";
import { ANIMALS } from "@/lib/data/animalRelations";
import { BRAND_LISTINGS, brandListingOf, type BrandListing } from "@/lib/data/brand-kinds";
import AffinityTypeContent from "./AffinityTypeContent";

// Las marcas se listan en tres: autos, ropa y el resto (/affinity/brand). Las
// fichas siguen en /affinity/brand/[slug].
const VALID_TYPES = ["autos", "ropa", "brand", "city", "country", "university", "movie", "artist", "football_player"];

// Solo los listados pre-generados son válidos; cualquier otro resuelve a 404 real.
export const dynamicParams = false;

export async function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }));
}

function isBrandListing(listing: string): listing is BrandListing {
  return listing in BRAND_LISTINGS;
}

function listingMeta(listing: string) {
  return isBrandListing(listing) ? BRAND_LISTINGS[listing] : ENTITY_TYPES[listing as EntityType];
}

function listingEntities(listing: string) {
  if (!isBrandListing(listing)) return getEntitiesByType(listing as EntityType);
  return getEntitiesByType("brand").filter((e) => brandListingOf(e.category) === listing);
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  if (!VALID_TYPES.includes(type)) {
    return { title: "Categoría no encontrada" };
  }
  const meta = listingMeta(type);
  const count = listingEntities(type).length;

  return {
    title: `Afinidad Personal · ${meta.plural}`,
    description: `${meta.description}. ${count} ${meta.plural.toLowerCase()} reales analizadas con el sistema de Afinidad Personal de Molino.`,
    alternates: {
      canonical: siteUrl(`/affinity/${type}`),
    },
    openGraph: {
      title: `Afinidad Personal · ${meta.plural}`,
      description: meta.description,
      type: "website",
      url: siteUrl(`/affinity/${type}`),
    },
  };
}

export default async function AffinityTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ animal?: string }>;
}) {
  const { type } = await params;
  const { animal } = await searchParams;
  if (!VALID_TYPES.includes(type)) notFound();

  const meta = listingMeta(type);
  const entities = listingEntities(type).map(toLightweightEntity);

  // Índice por signo en el HTML del servidor: el listado de arriba se arma en
  // el cliente y Google no veía ningún enlace a las fichas. Solo fecha exacta,
  // como el resto del Atlas; cada fila está acá porque nació en ese signo.
  const bySign = ANIMALS.map((a) => ({
    animal: a,
    items: entities.filter((e) => e.originDate && e.animal === a).sort((x, y) => x.name.localeCompare(y.name, "es")),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <AffinityTypeContent meta={meta} entities={entities} initialAnimal={animal} />
      {bySign.length > 0 && (
        <nav aria-labelledby="indice-por-signo" className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pb-24">
          <h2 id="indice-por-signo" className="font-heading text-xl font-semibold text-foreground mb-6">
            {meta.plural} por signo chino
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bySign.map((g) => (
              <section key={g.animal}>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  <Link href={`/conocimiento/zodiaco-chino/${g.animal.toLowerCase()}`} className="hover:text-accent">
                    Signo {g.animal}
                  </Link>
                </h3>
                <ul className="text-sm text-muted space-y-1">
                  {g.items.map((e) => (
                    <li key={e.id}>
                      <Link href={`/affinity/${e.type}/${e.id}`} className="hover:text-accent">{e.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
