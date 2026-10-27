import { getL, initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { SITE_URL, siteUrl, localeAlternates, localeUrl } from "@/lib/seo";
import { CHINESE_ANIMALS, delAnimal } from "@/lib/data/zodiaco-chino-content";
import { lunarYearsOf } from "@/components/affinity/EntitySignSection";
import { getChineseElement } from "@/lib/engines/chineseZodiacEngine";
import type { Animal } from "@/lib/data/animalRelations";
import AnimalContent, { type LunarYearRow } from "./AnimalContent";

/** Cada año del signo con su rango exacto y su elemento, 1924–2031. */
function yearsOf(animal: string): LunarYearRow[] {
  return lunarYearsOf(animal as Animal, 1924, 2031).map((y) => ({ ...y, element: getChineseElement(y.year) }));
}

type Props = { params: Promise<{ animal: string }> };

/**
 * El slug llega a veces codificado ("drag%C3%B3n") y a veces no ("dragón"),
 * según venga del prerender o de la URL pedida. Sin decodificar, la página
 * del Dragón respondía 200 con "Animal no encontrado" y Search Console la
 * marcaba como soft 404.
 */
function findAnimal(slug: string) {
  let key = slug;
  try {
    key = decodeURIComponent(slug);
  } catch {
    // slug con % suelto: se compara tal cual
  }
  key = key.normalize("NFC").toLowerCase();
  return CHINESE_ANIMALS.find((a) => a.name.normalize("NFC").toLowerCase() === key);
}

// Los 12 signos se pre-generan; cualquier otro slug es un 404 real del router.
// Antes respondía 200 con canónica a la home (soft 404 en Search Console).
export const dynamicParams = false;

export function generateStaticParams() {
  return CHINESE_ANIMALS.map((a) => ({ animal: a.name.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { animal: animalId } = await params;
  const animal = findAnimal(animalId);

  if (!animal) {
    return { title: L("Animal no encontrado", "Animal not found") };
  }

  const [amigoA, amigoB] = animal.compatibility.friendly;
  const opuesto = animal.compatibility.challenging[0];
  const recientes = yearsOf(animal.name).slice(-5).map((y) => y.year).join(", ");
  const A = L.t(animal.name);
  const title = L(
    `${animal.name} en el horóscopo chino: años, elemento y compatibilidad`,
    `The ${A} in the Chinese horoscope: years, element and compatibility`,
  );
  const description = L(
    `Años ${delAnimal(animal.name)}: ${recientes}… Con la fecha exacta en que empieza y termina cada uno, su elemento, sus dos signos amigos (${amigoA} y ${amigoB}) y su opuesto (${opuesto}).`,
    `Years of the ${A}: ${recientes}… With the exact date each one starts and ends, its element, its two friend signs (${L.t(amigoA)} and ${L.t(amigoB)}) and its opposite (${L.t(opuesto)}).`,
  );
  const path = `/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`;

  return {
    title,
    description,
    alternates: localeAlternates(path, L.locale),
    openGraph: { title, description, type: "article", url: localeUrl(path, L.locale) },
  };
}

export default async function AnimalPage({ params }: Props) {
  await initLocale(params);
  const L = await getL();
  const { animal: animalId } = await params;
  const animal = findAnimal(animalId);

  const jsonLd = animal ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: L(`${animal.name} en el horóscopo chino`, `${L.t(animal.name)} in the Chinese horoscope`),
      description: animal.meaning.slice(0, 200),
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino" },
      url: siteUrl(`/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`),
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`) },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
        { "@type": "ListItem", position: 2, name: L("Conocimiento", "Knowledge"), item: siteUrl("/explore") },
        { "@type": "ListItem", position: 3, name: "Zodiaco Chino", item: siteUrl("/conocimiento/zodiaco-chino") },
        { "@type": "ListItem", position: 4, name: animal.name },
      ],
    },
  ] : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <AnimalContent animal={animal} years={animal ? yearsOf(animal.name) : []} />
    </>
  );
}
