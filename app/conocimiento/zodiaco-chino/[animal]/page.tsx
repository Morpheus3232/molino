import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";
import AnimalContent from "./AnimalContent";

type Props = { params: Promise<{ animal: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { animal: animalId } = await params;
  const animal = CHINESE_ANIMALS.find(a => a.name.toLowerCase() === animalId.toLowerCase());

  if (!animal) {
    return { title: "Animal no encontrado" };
  }

  return {
    title: `${animal.emoji} ${animal.name} — Zodiaco Chino`,
    description: `${animal.meaning.slice(0, 155)}`,
    alternates: {
      canonical: siteUrl(`/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`),
    },
    openGraph: {
      title: `${animal.emoji} ${animal.name} — Molino`,
      description: `${animal.meaning.slice(0, 155)}`,
      type: "article",
      url: siteUrl(`/conocimiento/zodiaco-chino/${animal.name.toLowerCase()}`),
    },
  };
}

export default async function AnimalPage({ params }: Props) {
  const { animal: animalId } = await params;
  const animal = CHINESE_ANIMALS.find(a => a.name.toLowerCase() === animalId.toLowerCase());

  const jsonLd = animal ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${animal.emoji} ${animal.name}`,
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
      <AnimalContent />
    </>
  );
}
