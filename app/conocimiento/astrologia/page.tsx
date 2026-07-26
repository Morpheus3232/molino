import type { Metadata } from "next";
import AstrologiaContent from "./AstrologiaContent";

export const metadata: Metadata = {
  title: "Astrología — El lenguaje de los astros",
  description: "Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía. Un sistema simbólico con 4000 años de historia.",
  openGraph: {
    title: "Astrología — Molino",
    description: "Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía.",
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Astrología — El lenguaje de los astros",
    description: "Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: "https://molino-alpha.vercel.app/conocimiento/astrologia",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://molino-alpha.vercel.app/conocimiento/astrologia" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://molino-alpha.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Conocimiento", item: "https://molino-alpha.vercel.app/explore" },
      { "@type": "ListItem", position: 3, name: "Astrología" },
    ],
  },
];

export default function AstrologiaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AstrologiaContent />
    </>
  );
}
