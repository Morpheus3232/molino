import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seo";
import { getAllCountryISOs, getCategoriesByCountry, getCountryName, getEntitiesByTaxonomy } from "@/lib/data/atlas-queries";
import type { EntityType } from "@/lib/data/symbolic-entities";
import EntityCard from "@/components/atlas/EntityCard";
import AtlasBreadcrumbs from "@/components/atlas/AtlasBreadcrumbs";

const VALID_CATEGORIES: EntityType[] = ["brand", "city", "team", "university", "artist", "movie"];

interface Props {
  params: Promise<{ countryISO: string; category: string }>;
}

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
  if (!name || !catLabel) return { title: "No encontrado | Molino" };
  return {
    title: `${catLabel} de ${name} — Atlas | Molino`,
    description: `Descubrí ${catLabel.toLowerCase()} de ${name} y su afinidad simbólica según el zodíaco chino.`,
    alternates: { canonical: siteUrl(`/atlas/${countryISO.toUpperCase()}/${category}`) },
  };
}

function categoryLabel(category: string): string | null {
  const meta: Record<string, { plural: string; label: string }> = {
    brand: { plural: "Marcas", label: "Marcas" },
    city: { plural: "Ciudades", label: "Ciudades" },
    team: { plural: "Equipos", label: "Equipos" },
    university: { plural: "Universidades", label: "Universidades" },
    artist: { plural: "Artistas", label: "Artistas" },
    movie: { plural: "Películas", label: "Películas" },
  };
  return meta[category]?.plural ?? null;
}

export default async function CategoryPage({ params }: Props) {
  const { countryISO, category } = await params;
  const iso = countryISO.toUpperCase();
  const name = getCountryName(iso);
  const catLabel = categoryLabel(category);

  if (!name || !catLabel || !VALID_CATEGORIES.includes(category as EntityType)) notFound();

  const entities = getEntitiesByTaxonomy(iso, category as EntityType);
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
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase leading-[0.95]">
            {catLabel} de {name}
          </h1>
          <p className="text-sm text-muted mt-2">
            {entities.length} {entities.length === 1 ? "entidad verificada" : "entidades verificadas"}.
          </p>
        </header>

        <section aria-label={`Lista de ${catLabel.toLowerCase()}`} className="space-y-3">
          {entities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} countryISO={iso} category={category} />
          ))}
        </section>
      </div>
    </main>
  );
}
