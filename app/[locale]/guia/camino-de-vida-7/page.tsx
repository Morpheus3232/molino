import { useL, type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, OG_IMAGE, metadataFor } from "@/lib/seo";
import GuiaContent from "./GuiaContent";

export const generateMetadata = metadataFor({
  title: ["Camino de Vida 7 — El buscador de la verdad", "Life Path 7 — The Seeker of Truth"],
  description: ["Guía completa del Camino de Vida 7 en numerología: significado, personalidad, fortalezas, desafíos, relaciones y crecimiento personal.", "Complete guide to Life Path 7 in numerology: meaning, personality, strengths, challenges, relationships and personal growth."],
  path: "/guia/camino-de-vida-7",
  ogTitle: ["Camino de Vida 7 — El buscador de la verdad | Guía", "Life Path 7 — The Seeker of Truth | Guide"],
  ogDescription: ["Significado, personalidad y camino de crecimiento del número 7 en numerología.", "Meaning, personality and path of growth of the number 7 in numerology."],
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: L("Camino de Vida 7 — El buscador de la verdad", "Life Path 7 — The Seeker of Truth"),
    description: L("Guía completa del Camino de Vida 7 en numerología: significado, personalidad, fortalezas y desafíos.", "Complete guide to Life Path 7 in numerology: meaning, personality, strengths and challenges."),
    image: siteUrl(OG_IMAGE),
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    datePublished: "2025-01-01",
    dateModified: "2025-07-28",
    url: siteUrl("/guia/camino-de-vida-7"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/guia/camino-de-vida-7") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Guía", "Guide"), item: siteUrl("/guia") },
      { "@type": "ListItem", position: 3, name: L("Camino de Vida 7", "Life Path 7") },
    ],
  },
]);

export default function CaminoDeVida7Page() {
  const L = useL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <GuiaContent />
    </>
  );
}
