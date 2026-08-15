import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getAtlasCountries, topCountriesByCount, getAllAtlasEntities } from "@/lib/data/atlas-queries";
import { getCuratedGlobalEntities } from "@/lib/data/atlas-curation";
import AtlasHub from "@/components/atlas/AtlasHub";

export const metadata: Metadata = {
  title: "Atlas — Tu mundo según el Zodiaco Chino | Molino",
  description:
    "Explorá el Atlas de Molino: navegá lugares, marcas y entidades que comparten tu animal del zodíaco chino, organizados por categoría y país.",
  alternates: { canonical: siteUrl("/atlas") },
  openGraph: {
    title: "Atlas — Tu mundo según el Zodiaco Chino | Molino",
    description: "El Atlas de Molino: exploración personal por animal del zodíaco chino.",
    type: "website",
    url: siteUrl("/atlas"),
  },
};

/**
 * Atlas hub — personalized affinity recommendations + curated global + local browsing.
 * Server Component; entity catalogs reach the client. AtlasHub resolves the user's
 * animal and renders the sections.
 */
export default function AtlasPage() {
  const countries = getAtlasCountries();
  const topCountries = topCountriesByCount(countries);
  const allEntities = getAllAtlasEntities();
  const globalCurated = getCuratedGlobalEntities();

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
      <header className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-3">
          Atlas
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground uppercase leading-[0.95]">
          Tu mapa, tu animal
        </h1>
        <p className="text-sm sm:text-base text-muted mt-4 max-w-2xl leading-relaxed">
          Descubrí países, ciudades, marcas y entidades que comparten tu mismo animal del zodíaco chino.
          Más abajo podés explorar la energía opuesta y el catálogo completo por país.
        </p>
      </header>

        <AtlasHub
          countries={countries}
          topCountries={topCountries}
          allEntities={allEntities}
          globalCurated={globalCurated}
        />
      </div>
    </main>
  );
}
