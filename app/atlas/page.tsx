import { getAtlasCountries, topCountriesByCount, getAllAtlasEntitiesWithCountries } from "@/lib/data/atlas-queries";
import { getCuratedGlobalEntities } from "@/lib/data/atlas-curation";
import AtlasHub from "@/components/atlas/AtlasHub";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Atlas — Tu mundo según el Zodiaco Chino",
  description:
    "Explorá el Atlas de Molino: navegá lugares, marcas y entidades que comparten tu signo del zodíaco chino, organizados por categoría y país.",
  path: "/atlas",
  ogDescription: "El Atlas de Molino: exploración personal por signo del zodíaco chino.",
});

/**
 * Atlas hub — personalized affinity recommendations + curated global + local browsing.
 * Server Component; entity catalogs reach the client. AtlasHub resolves the user's
 * animal and renders the sections.
 */
export default function AtlasPage() {
  const countries = getAtlasCountries();
  const topCountries = topCountriesByCount(countries);
  const allEntities = getAllAtlasEntitiesWithCountries();
  const globalCurated = getCuratedGlobalEntities();

  return (
    <main id="main-content" className="bg-background pt-12 sm:pt-16 pb-24 text-foreground">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
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
