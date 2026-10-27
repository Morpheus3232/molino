import { initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localeAlternates, localeUrl } from "@/lib/seo";
import { buildEntityListJsonLd } from "@/lib/seo-jsonld";
import { DRILL_DOWN_LISTINGS, getAllAnimalNames, getEntitiesByAnimalAndCategory, listingMeta } from "@/lib/data/atlas-queries";
import { getAnimalProfile } from "@/lib/data/animalRelations";
import type { Animal } from "@/lib/data/animalRelations";
import AnimalCategoryListing from "@/components/atlas/AnimalCategoryListing";

const VALID_CATEGORIES = [...DRILL_DOWN_LISTINGS, "country"];

interface Props {
  params: Promise<{ animal: string; category: string }>;
}

// Todas las combinaciones animal×categoría se pre-generan; cualquier otra
// resuelve a 404 real en el router.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { animal: string; category: string }[] = [];
  for (const animal of getAllAnimalNames()) {
    for (const category of VALID_CATEGORIES) {
      params.push({ animal, category });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { animal: rawAnimal, category } = await params;
  const animal = decodeURIComponent(rawAnimal);
  if (!getAllAnimalNames().includes(animal) || !VALID_CATEGORIES.includes(category)) {
    return { title: L("No encontrado", "Not found") };
  }
  const meta = listingMeta(category)!;
  const profile = getAnimalProfile(animal as Animal);
  const sign = L.t(animal);
  const plural = L.t(meta.plural);
  const path = `/atlas/explorar/${animal}/${category}`;
  const title = L(`${plural} de ${sign} — Atlas`, `${plural} of the ${sign} — Atlas`);
  const description = profile
    ? L(`Explorá ${plural.toLowerCase()} asociadas a ${sign} ${profile.emoji} según el Zodiaco Chino.`, `Explore ${plural.toLowerCase()} associated with the ${sign} ${profile.emoji} according to the Chinese Zodiac.`)
    : L(`Explorá ${plural.toLowerCase()} asociadas a ${sign} según el Zodiaco Chino.`, `Explore ${plural.toLowerCase()} associated with the ${sign} according to the Chinese Zodiac.`);
  return {
    title,
    description,
    alternates: localeAlternates(path, L.locale),
    openGraph: {
      title,
      description: L(`Explorá ${plural.toLowerCase()} del Zodiaco Chino en el Atlas de Molino.`, `Explore Chinese Zodiac ${plural.toLowerCase()} in Molino's Atlas.`),
      type: "website",
      url: localeUrl(path, L.locale),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AnimalCategoryPage({ params }: Props) {
  await initLocale(params);
  const { animal: rawAnimal, category } = await params;
  const animal = decodeURIComponent(rawAnimal);

  if (!getAllAnimalNames().includes(animal) || !VALID_CATEGORIES.includes(category)) notFound();

  const entities = getEntitiesByAnimalAndCategory(animal, category);
  const jsonLd = buildEntityListJsonLd(entities);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnimalCategoryListing animal={animal} category={category} entities={entities} />
    </>
  );
}
