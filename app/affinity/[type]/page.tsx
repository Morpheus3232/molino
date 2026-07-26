import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ENTITY_TYPES, getEntitiesByType, type EntityType } from "@/lib/data/symbolic-entities";
import AffinityTypeContent from "./AffinityTypeContent";

const VALID_TYPES: EntityType[] = ["brand", "city", "country", "university", "team", "movie", "artist"];

export async function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as EntityType)) {
    return { title: "Categoría no encontrada | Molino" };
  }
  const meta = ENTITY_TYPES[type as EntityType];
  const count = getEntitiesByType(type as EntityType).length;

  return {
    title: `Afinidad Personal · ${meta.plural} | Molino`,
    description: `${meta.description}. ${count} ${meta.plural.toLowerCase()} reales analizadas con el sistema de Afinidad Personal de Molino.`,
    openGraph: {
      title: `Afinidad Personal · ${meta.plural} | Molino`,
      description: meta.description,
      type: "website",
    },
  };
}

export default async function AffinityTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as EntityType)) notFound();

  const entities = getEntitiesByType(type as EntityType);
  const meta = ENTITY_TYPES[type as EntityType];

  return <AffinityTypeContent type={type as EntityType} meta={meta} entities={entities} />;
}
