import { initLocale, metaL } from "@/lib/i18n/server";
import type { Pick2 } from "@/lib/i18n/useL";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { localeAlternates, localeUrl } from "@/lib/seo";
import { buildEntityJsonLd } from "@/lib/seo-jsonld";
import { ENTITY_TYPES, getEntityById, getEntitiesByType, resolveEntityAnimalData, type EntityType } from "@/lib/data/symbolic-entities";
import { amigosDe, enemigoDe } from "@/lib/engines/personalMapEngine";
import type { Animal } from "@/lib/data/animalRelations";
import { getPrimaryEvent } from "@/lib/data/entity-events";
import { BRAND_LISTINGS, brandListingOf } from "@/lib/data/brand-kinds";
import AffinityEditorialContent from "@/components/affinity/AffinityEditorialContent";
import AffinityDetailContent from "./AffinityDetailContent";

const VALID_TYPES: EntityType[] = ["brand", "city", "country", "university", "movie", "artist", "football_player"];

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string; slug: string }> }): Promise<Metadata> {
  const L = await metaL(params);
  const { type, slug: rawSlug } = await params;
  // Los ids con tilde/ñ (david-lebón) llegan percent-encoded al render.
  const slug = decodeURIComponent(rawSlug);
  if (!VALID_TYPES.includes(type as EntityType)) {
    return { title: L("No encontrada", "Not found") };
  }
  const entity = getEntityById(slug);
  if (!entity) {
    return { title: L("Entidad no encontrada", "Entity not found") };
  }
  const { title, description } = entitySeo(entity, type as EntityType, L);
  const path = `/affinity/${type}/${slug}`;
  const url = localeUrl(path, L.locale);

  return {
    title,
    description,
    alternates: localeAlternates(path, L.locale),
    // Sin fecha exacta el signo no es afirmable (CLAUDE.md) y la ficha queda
    // sin su sección de signo: no se ofrece a Google. Sigue enlazando.
    ...(getPrimaryEvent(entity)?.date ? {} : { robots: { index: false, follow: true } }),
    openGraph: { title, description, type: "website", url },
    twitter: { card: "summary_large_image", title, description },
  };
}

const PERSON_TYPES = new Set<EntityType>(["artist", "football_player"]);

/**
 * El título responde lo que se busca ("¿qué signo es Gavi?", "Argentina
 * zodíaco chino") con el dato que la ficha afirma: signo y año. El año además
 * separa homónimos (Claudio Bravo pintor y arquero; Universidad de Chile club
 * y universidad). Sin fecha exacta no se afirma signo: la ficha va noindex.
 */
function entitySeo(entity: NonNullable<ReturnType<typeof getEntityById>>, type: EntityType, L: Pick2) {
  const primary = getPrimaryEvent(entity);
  if (!primary?.date) {
    return {
      title: `${L.t(entity.name)} · ${L.t(ENTITY_TYPES[type].label)}`,
      description: L(
        `${entity.name} en el Atlas de Molino: su origen documentado y su lugar en el zodíaco chino.`,
        `${L.t(entity.name)} in Molino's Atlas: its documented origin and its place in the Chinese zodiac.`,
      ),
    };
  }
  const { animal: animalEs, year } = resolveEntityAnimalData(entity);
  const animal = L.t(animalEs);
  const name = L.t(entity.name);
  const fecha = new Date(`${primary.date}T12:00:00Z`).toLocaleDateString(L("es-AR", "en-US"), {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
  const amigos = amigosDe(animalEs as Animal).map((a) => L.t(a));
  const enemigoEs = enemigoDe(animalEs as Animal);
  const enemigo = enemigoEs ? L.t(enemigoEs) : null;
  const relaciones = L(
    `Sus dos signos amigos son ${amigos.join(" y ")}${enemigo ? `; su opuesto, ${enemigo}` : ""}.`,
    `Its two friend signs are ${amigos.join(" and ")}${enemigo ? `; its opposite, ${enemigo}` : ""}.`,
  );
  if (PERSON_TYPES.has(type)) {
    return {
      title: L(`¿Qué signo chino es ${name}? ${animal} (${year})`, `What Chinese sign is ${name}? ${animal} (${year})`),
      description: L(
        `${name} nació el ${fecha}: en el zodíaco chino es ${animal}. ${relaciones}`,
        `${name} was born on ${fecha}: in the Chinese zodiac they are a ${animal}. ${relaciones}`,
      ),
    };
  }
  return {
    title: L(`${name} en el zodíaco chino: signo ${animal} (${year})`, `${name} in the Chinese zodiac: ${animal} sign (${year})`),
    // La etiqueta del evento viene de muchas formas ("Fundación", "Revolución
    // Francesa", "Independencia de Mongolia"): entre paréntesis lee bien con todas.
    description: L(
      `${primary.label} (${fecha}): ${name} es ${animal} en el zodíaco chino. ${relaciones}`,
      `${L.t(primary.label)} (${fecha}): ${name} is a ${animal} in the Chinese zodiac. ${relaciones}`,
    ),
  };
}

export default async function AffinityDetailPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  await initLocale(params);
  const { type, slug: rawSlug } = await params;
  // Los ids con tilde/ñ (david-lebón) llegan percent-encoded al render.
  const slug = decodeURIComponent(rawSlug);
  if (!VALID_TYPES.includes(type as EntityType)) notFound();

  const entity = getEntityById(slug);
  if (!entity) notFound();
  if (entity.type !== type) notFound();

  // Una marca vuelve a su listado (autos, ropa u otras), no a un "Marcas" genérico.
  const meta = entity.type === "brand" ? BRAND_LISTINGS[brandListingOf(entity.category)] : ENTITY_TYPES[type as EntityType];
  const jsonLd = buildEntityJsonLd(entity, type as EntityType, `/affinity/${type}/${slug}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <main id="main-content">
          <AffinityEditorialContent entity={entity} meta={meta} type={type as EntityType}>
            <AffinityDetailContent entity={entity} meta={meta} type={type as EntityType} />
          </AffinityEditorialContent>
        </main>
      </div>
    </>
  );
}
