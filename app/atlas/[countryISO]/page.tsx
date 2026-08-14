import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seo";
import { getAllCountryISOs, getCategoriesByCountry, getCountryName, isoToFlagEmoji } from "@/lib/data/atlas-queries";
import CategoryGrid from "@/components/atlas/CategoryGrid";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";

interface Props {
  params: Promise<{ countryISO: string }>;
}

export async function generateStaticParams() {
  return getAllCountryISOs().map((countryISO) => ({ countryISO }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryISO } = await params;
  const name = getCountryName(countryISO.toUpperCase());
  if (!name) return { title: "País no encontrado | Molino" };
  const canonical = siteUrl(`/atlas/${countryISO.toUpperCase()}`);
  return {
    title: `Atlas de ${name} — Afinidades | Molino`,
    description: `Explorá las afinidades simbólicas de ${name}: ciudades, clubes, universidades, marcas y artistas según el zodíaco chino.`,
    alternates: { canonical },
    openGraph: {
      title: `Atlas de ${name} — Afinidades | Molino`,
      description: `Explorá las afinidades simbólicas de ${name} según el zodíaco chino.`,
      type: "website",
      url: canonical,
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { countryISO } = await params;
  const valid = getAllCountryISOs().includes(countryISO.toUpperCase());
  if (!valid) notFound();

  const iso = countryISO.toUpperCase();
  const name = getCountryName(iso);
  const categories = getCategoriesByCountry(iso);

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <AtlasBreadcrumbs
          crumbs={[{ href: "/atlas", label: "Atlas" }, { label: name }]}
        />

        <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl leading-none" role="img" aria-label={name}>
              {isoToFlagEmoji(iso)}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground uppercase leading-[0.95]">
              {name}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            Categorías de {name} con entidades verificadas. Explorá cada una para descubrir su resonancia
            simbólica con tu mapa.
          </p>
        </header>

        {categories.length === 0 ? (
          <p className="text-muted">Todavía no hay categorías con entidades registradas para {name}.</p>
        ) : (
          <section aria-label="Categorías del país">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Categorías</h2>
            </div>
            <CategoryGrid countryISO={iso} categories={categories} />
          </section>
        )}
      </div>
    </main>
  );
}
