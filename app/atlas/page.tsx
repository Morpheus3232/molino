import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { getAtlasCountries, topCountriesByCount } from "@/lib/data/atlas-queries";
import AtlasHub from "@/components/atlas/AtlasHub";

export const metadata: Metadata = {
  title: "Atlas — Explora Afinidades por País | Molino",
  description:
    "Explorá el Atlas Visual de Molino: países, ciudades, clubes, universidades, marcas y artistas, organizados geográficamente según el zodíaco chino.",
  alternates: { canonical: siteUrl("/atlas") },
  openGraph: {
    title: "Atlas — Explora Afinidades por País | Molino",
    description: "El Atlas Visual de Molino: exploración geográfica de afinidades simbólicas.",
    type: "website",
    url: siteUrl("/atlas"),
  },
};

/**
 * Atlas hub — global country grid. Server Component; only plain metadata
 * (iso/name/flag/count) reaches the client. The client AtlasHub resolves the
 * user's country and personalizes presentation.
 */
export default function AtlasPage() {
  const countries = getAtlasCountries();
  const topCountries = topCountriesByCount(countries);

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-3">
            Atlas Visual
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground uppercase leading-[0.95]">
            Explora el mundo según tu mapa
          </h1>
          <p className="text-sm sm:text-base text-muted mt-4 max-w-2xl leading-relaxed">
            Ciudades, clubes, universidades, marcas y artistas de cada país, organizados por su afinidad
            simbólica. Elegí un país para descubrir sus categorías.
          </p>
        </header>

        <section aria-label="Países del Atlas">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Países</h2>
          </div>
          <AtlasHub countries={countries} topCountries={topCountries} />
        </section>
      </div>
    </main>
  );
}
