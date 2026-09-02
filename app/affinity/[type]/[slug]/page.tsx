import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { buildEntityJsonLd } from "@/lib/seo-jsonld";
import { ENTITY_TYPES, getEntityById, getEntitiesByType, SYMBOLIC_ENTITIES, toLightweightEntity, type EntityType } from "@/lib/data/symbolic-entities";
import AffinityEditorialContent from "@/components/affinity/AffinityEditorialContent";
import AffinityDetailContent from "./AffinityDetailContent";

const VALID_TYPES: EntityType[] = ["brand", "city", "country", "university", "team", "movie", "artist"];

// Todos los pares {type, slug} válidos se pre-generan; cualquier combinación
// no listada (type inválido, slug inexistente o entidad fuera de su type)
// resuelve a 404 real en el router.
export const dynamicParams = false;

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
      title: `Mi afinidad simbólica con ${entity.name}`,
      description: `Afinidad simbólica con ${entity.name} según el zodíaco chino. Descubrí la tuya en Molino.`,
      type: "website",
      url: siteUrl(`/affinity/${type}/${slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title: `Mi afinidad simbólica con ${entity.name}`,
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
  // Client needs the full entity (for the affinity explanation) plus the
  // lightweight projections of ALL entities (for the discovery loop across
  // types) and same-type entities (for the quick selector). The rich data
  // layer never reaches the client bundle — only these props do.
  const catalog = SYMBOLIC_ENTITIES.map(toLightweightEntity);
  // Capa 1 (editorial): otras entidades del mismo tipo ya existentes en el
  // dataset, sin calcular afinidad — solo un listado, no un descubrimiento.
  const jsonLd = buildEntityJsonLd(entity, type as EntityType, `/affinity/${type}/${slug}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[800px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
          <AffinityEditorialContent entity={entity} meta={meta} type={type as EntityType} />
          <AffinityDetailContent entity={entity} meta={meta} type={type as EntityType} catalog={catalog} />
        </main>
      </div>
    </>
  );
}
