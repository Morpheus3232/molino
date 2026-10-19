import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
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

// Los 12 signos se pre-generan; cualquier otro slug es un 404 real del router.
// Antes respondía 200 con canónica a la home (soft 404 en Search Console).
export const dynamicParams = false;

export function generateStaticParams() {
  return CHINESE_ANIMALS.map((a) => ({ animal: a.name.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { animal: animalId } = await params;
  const animal = CHINESE_ANIMALS.find(a => a.name.toLowerCase() === animalId.toLowerCase());

  if (!animal) {
    return { title: "Animal no encontrado" };
  }

  const [amigoA, amigoB] = animal.compatibility.friendly;
  const recientes = yearsOf(animal.name).slice(-5).map((y) => y.year).join(", ");
  const title = `${animal.name} en el horóscopo chino: años, elemento y compatibilidad`;
  const description = `Años ${delAnimal(animal.name)}: ${recientes}… Con la fecha exacta en que empieza y termina cada uno, su elemento, sus dos signos amigos (${amigoA} y ${amigoB}) y su opuesto (${animal.compatibility.challenging[0]}).`;
  const url = siteUrl(`/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "article", url },
  };
}

export default async function AnimalPage({ params }: Props) {
  const { animal: animalId } = await params;
  const animal = CHINESE_ANIMALS.find(a => a.name.toLowerCase() === animalId.toLowerCase());

  const jsonLd = animal ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${animal.name} en el horóscopo chino`,
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
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Conocimiento", item: siteUrl("/explore") },
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
