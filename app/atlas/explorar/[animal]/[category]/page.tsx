import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seo";
import { buildEntityListJsonLd } from "@/lib/seo-jsonld";
import { getAllAnimalNames, getEntitiesByAnimalAndCategory } from "@/lib/data/atlas-queries";
import { getAnimalProfile } from "@/lib/data/animalRelations";
import { ENTITY_TYPES } from "@/lib/data/symbolic-entities";
import type { EntityType } from "@/lib/data/symbolic-entities";
import type { Animal } from "@/lib/data/animalRelations";
import AnimalCategoryListing from "@/components/atlas/AnimalCategoryListing";

const VALID_CATEGORIES: EntityType[] = ["brand", "city", "team", "university", "artist", "movie", "country"];

interface Props {
  params: Promise<{ animal: string; category: string }>;
}

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
  const { animal: rawAnimal, category } = await params;
  const animal = decodeURIComponent(rawAnimal);
  if (!getAllAnimalNames().includes(animal) || !VALID_CATEGORIES.includes(category as EntityType)) {
    return { title: "No encontrado" };
  }
  const meta = ENTITY_TYPES[category as EntityType];
  const profile = getAnimalProfile(animal as Animal);
  const canonical = siteUrl(`/atlas/explorar/${animal}/${category}`);
  return {
    title: `${meta.plural} de ${animal} — Atlas`,
    description: profile
      ? `Explorá ${meta.plural.toLowerCase()} asociadas a ${animal} ${profile.emoji} según el Zodiaco Chino.`
      : `Explorá ${meta.plural.toLowerCase()} asociadas a ${animal} según el Zodiaco Chino.`,
    alternates: { canonical },
    openGraph: {
      title: `${meta.plural} de ${animal} — Atlas`,
      description: `Explorá ${meta.plural.toLowerCase()} del Zodiaco Chino en el Atlas de Molino.`,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.plural} de ${animal} — Atlas`,
      description: `Explorá ${meta.plural.toLowerCase()} asociadas a ${animal} según el Zodiaco Chino.`,
    },
  };
}

export default async function AnimalCategoryPage({ params }: Props) {
  const { animal: rawAnimal, category } = await params;
  const animal = decodeURIComponent(rawAnimal);

  if (!getAllAnimalNames().includes(animal) || !VALID_CATEGORIES.includes(category as EntityType)) notFound();

  const entities = getEntitiesByAnimalAndCategory(animal, category as EntityType);
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
