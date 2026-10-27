import { getL, initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localeAlternates, localeUrl } from "@/lib/seo";
import { getEntitiesByAnimalWithCountries, getAllAnimalNames } from "@/lib/data/atlas-queries";
import { getAnimalProfile } from "@/lib/data/animalRelations";
import type { Animal } from "@/lib/data/animalRelations";
import AnimalExplorer from "@/components/atlas/AnimalExplorer";

interface Props {
  params: Promise<{ animal: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Todos los animales se pre-generan; cualquier otro animal resuelve a 404 real.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllAnimalNames().map((animal) => ({ animal }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { animal } = await params;
  const decoded = decodeURIComponent(animal);
  if (!getAllAnimalNames().includes(decoded)) {
    return { title: L("Animal no encontrado", "Animal not found") };
  }
  const profile = getAnimalProfile(decoded as Animal);
  const sign = L.t(decoded);
  const path = `/atlas/explorar/${decoded}`;
  const title = L(`${sign} — Explorar | Atlas`, `${sign} — Explore | Atlas`);
  return {
    title,
    description: profile
      ? L(`Explorá países, ciudades, marcas y entidades asociadas a ${sign} ${profile.emoji} según el Zodiaco Chino.`, `Explore countries, cities, brands and entities associated with the ${sign} ${profile.emoji} according to the Chinese Zodiac.`)
      : L(`Explorá entidades asociadas a ${sign} según el Zodiaco Chino.`, `Explore entities associated with the ${sign} according to the Chinese Zodiac.`),
    alternates: localeAlternates(path, L.locale),
    openGraph: {
      title,
      description: L(`Explorá el Atlas de Molino filtrado por ${sign}.`, `Explore Molino's Atlas filtered by ${sign}.`),
      type: "website",
      url: localeUrl(path, L.locale),
    },
  };
}

export default async function AnimalExplorerPage({ params, searchParams }: Props) {
  await initLocale(params);
  const L = await getL();
  const { animal } = await params;
  const decoded = decodeURIComponent(animal);
  const isEnemy = (await searchParams).enemy === "1";

  if (!getAllAnimalNames().includes(decoded)) notFound();

  const entities = getEntitiesByAnimalWithCountries(decoded);
  if (entities.length === 0) {
    return (
      <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 text-center py-24">
          <p className="text-muted">{L(<>
            No hay entidades registradas para {L.t(decoded)} en este momento.
          </>, <>There are no entities recorded for {L.t(decoded)} right now.</>)}</p>
        </div>
      </main>
    );
  }

  return <AnimalExplorer animal={decoded} entities={entities} isEnemy={isEnemy} />;
}
