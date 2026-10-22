import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seo";
import { DRILL_DOWN_LISTINGS, getAllCountryISOs, getCategoriesByCountry, getCountryName, getEntitiesByTaxonomy, listingMeta } from "@/lib/data/atlas-queries";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";
import AtlasCategoryListing from "@/components/atlas/AtlasCategoryListing";
import AtlasSharePanel from "@/components/atlas/AtlasSharePanel";

interface Props {
  params: Promise<{ countryISO: string; category: string }>;
}

// Solo las combinaciones país×categoría con entidades se pre-generan
// (getCategoriesByCountry devuelve solo categorías con count > 0). Cualquier
// otro combo resuelve a 404 real, coherente con el notFound() de la página.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { countryISO: string; category: string }[] = [];
  for (const countryISO of getAllCountryISOs()) {
    for (const category of getCategoriesByCountry(countryISO)) {
      params.push({ countryISO, category: category.type });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countryISO, category } = await params;
  const name = getCountryName(countryISO.toUpperCase());
  const catLabel = categoryLabel(category);
  if (!name || !catLabel) return { title: "No encontrado" };
  const canonical = siteUrl(`/atlas/${countryISO.toUpperCase()}/${category}`);
  return {
    title: `${catLabel} de ${name} — Atlas`,
    description: `Descubrí ${catLabel.toLowerCase()} de ${name} y su afinidad simbólica según el zodíaco chino.`,
    alternates: { canonical },
    openGraph: {
      title: `${catLabel} de ${name} — Atlas`,
      description: `Descubrí ${catLabel.toLowerCase()} de ${name} y su afinidad simbólica según el zodíaco chino.`,
      type: "website",
      url: canonical,
    },
  };
}

function categoryLabel(category: string): string | null {
  return DRILL_DOWN_LISTINGS.includes(category) ? listingMeta(category)!.plural : null;
}

export default async function CategoryPage({ params }: Props) {
  const { countryISO, category } = await params;
  const iso = countryISO.toUpperCase();
  const name = getCountryName(iso);
  const catLabel = categoryLabel(category);

  if (!name || !catLabel) notFound();

  const entities = getEntitiesByTaxonomy(iso, category);
  if (entities.length === 0) notFound();

  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <AtlasBreadcrumbs
          crumbs={[
            { href: "/atlas", label: "Atlas" },
            { href: `/atlas/${iso}`, label: name },
            { label: catLabel },
          ]}
        />

        <header className="mb-8">
          <h1 className="page-title text-foreground">
            {catLabel} de {name}
          </h1>
          <p className="text-sm text-muted mt-2">
            {entities.length} {entities.length === 1 ? "entidad" : "entidades"} — clasificadas por tu animal del zodíaco chino.
          </p>
        </header>

        <AtlasCategoryListing entities={entities} countryISO={iso} category={category} />

        <AtlasSharePanel entities={entities} category={category} />
      </div>
    </main>
  );
}
