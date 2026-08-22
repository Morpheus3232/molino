import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seo";
import { getEntitiesByAnimalWithCountries, getAllAnimalNames } from "@/lib/data/atlas-queries";
import { getAnimalProfile } from "@/lib/data/animalRelations";
import type { Animal } from "@/lib/data/animalRelations";
import AnimalExplorer from "@/components/atlas/AnimalExplorer";

interface Props {
  params: Promise<{ animal: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  return getAllAnimalNames().map((animal) => ({ animal }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { animal } = await params;
  const decoded = decodeURIComponent(animal);
  if (!getAllAnimalNames().includes(decoded)) {
    return { title: "Animal no encontrado" };
  }
  const profile = getAnimalProfile(decoded as Animal);
  return {
    title: `${decoded} — Explorar | Atlas`,
    description: profile
      ? `Explorá países, ciudades, marcas y entidades asociadas a ${decoded} ${profile.emoji} según el Zodiaco Chino.`
      : `Explorá entidades asociadas a ${decoded} según el Zodiaco Chino.`,
    alternates: { canonical: siteUrl(`/atlas/explorar/${decoded}`) },
    openGraph: {
      title: `${decoded} — Explorar | Atlas`,
      description: `Explorá el Atlas de Molino filtrado por ${decoded}.`,
      type: "website",
      url: siteUrl(`/atlas/explorar/${decoded}`),
    },
  };
}

export default async function AnimalExplorerPage({ params, searchParams }: Props) {
  const { animal } = await params;
  const decoded = decodeURIComponent(animal);
  const isEnemy = (await searchParams).enemy === "1";

  if (!getAllAnimalNames().includes(decoded)) notFound();

  const entities = getEntitiesByAnimalWithCountries(decoded);
  if (entities.length === 0) {
    return (
      <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center py-24">
          <p className="text-muted">
            No hay entidades registradas para {decoded} en este momento.
          </p>
        </div>
      </main>
    );
  }

  return <AnimalExplorer animal={decoded} entities={entities} isEnemy={isEnemy} />;
}
