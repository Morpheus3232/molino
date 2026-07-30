import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
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
    return { title: "No encontrada" };
  }
  const entity = getEntityById(slug);
  if (!entity) {
    return { title: "Entidad no encontrada" };
  }
  const meta = ENTITY_TYPES[type as EntityType];

  return {
    title: `Mi afinidad simbólica con ${entity.name}`,
    description: `Mi afinidad simbólica con ${entity.name}: ${entity.emoji} según el zodíaco chino. Descubrí tu mapa de afinidades en Molino.`,
    alternates: {
      canonical: siteUrl(`/affinity/${type}/${slug}`),
    },
    openGraph: {
      title: `Mi afinidad simbólica con ${entity.name} | Molino`,
      description: `Afinidad simbólica con ${entity.name} según el zodíaco chino. Descubrí la tuya en Molino.`,
      type: "website",
      url: siteUrl(`/affinity/${type}/${slug}`),
      // Sin `images`: hereda el opengraph-image.tsx dinámico de la raíz
      // (PNG 1200x630 real). El og-image.svg viejo no renderiza en la
      // mayoría de los previews (WhatsApp, Twitter/X, LinkedIn no leen SVG).
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
