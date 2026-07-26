import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ENTITY_TYPES, getEntityById, getEntitiesByType, type EntityType } from "@/lib/data/symbolic-entities";
import AffinityDetailContent from "./AffinityDetailContent";

const VALID_TYPES: EntityType[] = ["brand", "city", "country", "university", "team", "movie", "artist"];

export async function generateStaticParams() {
  const params: { type: string; slug: string }[] = [];
  for (const type of VALID_TYPES) {
    for (const entity of getEntitiesByType(type)) {
      params.push({ type, slug: entity.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ type: string; slug: string }> }): Promise<Metadata> {
  const { type, slug } = await params;
  if (!VALID_TYPES.includes(type as EntityType)) {
    return { title: "No encontrada | Molino" };
  }
  const entity = getEntityById(slug);
  if (!entity) {
    return { title: "Entidad no encontrada | Molino" };
  }
  const meta = ENTITY_TYPES[type as EntityType];

  return {
    title: `Mi afinidad simbólica con ${entity.name} | Molino`,
    description: `Mi afinidad simbólica con ${entity.name}: ${entity.emoji} según el zodíaco chino. Descubrí tu mapa de afinidades en Molino.`,
    openGraph: {
      title: `Mi afinidad simbólica con ${entity.name} | Molino`,
      description: `Afinidad simbólica con ${entity.name} según el zodíaco chino. Descubrí la tuya en Molino.`,
      type: "website",
      images: [
        {
          url: "https://molino-alpha.vercel.app/og-image.svg",
          width: 1200,
          height: 630,
          alt: `Afinidad simbólica con ${entity.name} — Molino`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Mi afinidad simbólica con ${entity.name} | Molino`,
      description: `Afinidad simbólica con ${entity.name} según el zodíaco chino.`,
    },
  };
}

export default async function AffinityDetailPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params;
  if (!VALID_TYPES.includes(type as EntityType)) notFound();

  const entity = getEntityById(slug);
  if (!entity) notFound();
  if (entity.type !== type) notFound();

  const meta = ENTITY_TYPES[type as EntityType];

  return <AffinityDetailContent entity={entity} meta={meta} type={type as EntityType} />;
}
