import { SITE_URL, siteUrl, createRouteMetadata, OG_IMAGE } from "@/lib/seo";
import GuiaContent from "./GuiaContent";

export const metadata = createRouteMetadata({
  title: "Camino de Vida 7 — El buscador de la verdad",
  description: "Guía completa del Camino de Vida 7 en numerología: significado, personalidad, fortalezas, desafíos, relaciones y crecimiento personal.",
  path: "/guia/camino-de-vida-7",
  ogTitle: "Camino de Vida 7 — El buscador de la verdad | Guía",
  ogDescription: "Significado, personalidad y camino de crecimiento del número 7 en numerología.",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Camino de Vida 7 — El buscador de la verdad",
    description: "Guía completa del Camino de Vida 7 en numerología: significado, personalidad, fortalezas y desafíos.",
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guía", item: siteUrl("/guia") },
      { "@type": "ListItem", position: 3, name: "Camino de Vida 7" },
    ],
  },
];

export default function CaminoDeVida7Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuiaContent />
    </>
  );
}
