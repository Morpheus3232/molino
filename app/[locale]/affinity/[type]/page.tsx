import { getL, initLocale, metaL } from "@/lib/i18n/server";
import { Link } from "@/lib/i18n/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { localeAlternates, localeUrl } from "@/lib/seo";
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const L = await metaL(params);
  const { type } = await params;
  if (!VALID_TYPES.includes(type)) {
    return { title: L("Categoría no encontrada", "Category not found") };
  }
  const meta = listingMeta(type);
  const count = listingEntities(type).length;
  const plural = L.t(meta.plural);
  const desc = L.t(meta.description);
  const title = L(`Afinidad Personal · ${plural}`, `Personal Affinity · ${plural}`);
  const path = `/affinity/${type}`;

  return {
    title,
    description: L(
      `${desc}. ${count} ${plural.toLowerCase()} reales analizadas con el sistema de Afinidad Personal de Molino.`,
      `${desc}. ${count} real ${plural.toLowerCase()} analyzed with Molino's Personal Affinity system.`,
    ),
    alternates: localeAlternates(path, L.locale),
    openGraph: {
      title,
      description: desc,
      type: "website",
      url: localeUrl(path, L.locale),
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
  await initLocale(params);
  const L = await getL();
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
          <h2 id="indice-por-signo" className="font-heading text-xl font-semibold text-foreground mb-6">{L(<>
            {L.t(meta.plural)} por signo chino
          </>, <>{L.t(meta.plural)} by Chinese sign</>)}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bySign.map((g) => (
              <section key={g.animal}>
                <h3 className="text-sm font-semibold text-foreground mb-2">{L(<>
                  <Link href={`/conocimiento/zodiaco-chino/${g.animal.toLowerCase()}`} className="hover:text-accent">
                    Signo {L.t(g.animal)}
                  </Link>
                </>, <><Link href={`/conocimiento/zodiaco-chino/${g.animal.toLowerCase()}`} className="hover:text-accent">{L.t(g.animal)} sign</Link></>)}</h3>
                <ul className="text-sm text-muted space-y-1">
                  {g.items.map((e) => (
                    <li key={e.id}>
                      <Link href={`/affinity/${e.type}/${e.id}`} className="hover:text-accent">{L.t(e.name)}</Link>
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
