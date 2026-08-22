import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { NUMBERS } from "@/lib/data/numerologia-content";
import NumeroContent from "./NumeroContent";

type Props = { params: Promise<{ numero: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { numero: numId } = await params;
  const num = NUMBERS.find(n => n.number === parseInt(numId));

  if (!num) {
    return { title: "Número no encontrado" };
  }

  return {
    title: `Número ${num.number} ${num.title} — Numerología`,
    description: `${num.meaning.slice(0, 155)}`,
    alternates: {
      canonical: siteUrl(`/conocimiento/numerologia/${num.number}`),
    },
    openGraph: {
      title: `Número ${num.number} ${num.title}`,
      description: `${num.meaning.slice(0, 155)}`,
      type: "article",
      url: siteUrl(`/conocimiento/numerologia/${num.number}`),
    },
  };
}

export default async function NumeroPage({ params }: Props) {
  const { numero: numId } = await params;
  const num = NUMBERS.find(n => n.number === parseInt(numId));

  const jsonLd = num ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Número ${num.number} ${num.title}`,
      description: num.meaning.slice(0, 200),
      author: { "@type": "Organization", name: "Molino" },
      publisher: { "@type": "Organization", name: "Molino" },
      url: siteUrl(`/conocimiento/numerologia/${num.number}`),
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/conocimiento/numerologia/${num.number}`) },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Conocimiento", item: siteUrl("/explore") },
        { "@type": "ListItem", position: 3, name: "Numerología", item: siteUrl("/conocimiento/numerologia") },
        { "@type": "ListItem", position: 4, name: `Número ${num.number}` },
      ],
    },
  ] : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <NumeroContent num={num} />
    </>
  );
}
