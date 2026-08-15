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
