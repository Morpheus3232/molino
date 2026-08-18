import { SITE_URL, siteUrl, createRouteMetadata } from "@/lib/seo";
import FilosofiaContent from "./FilosofiaContent";

export const metadata = createRouteMetadata({
  title: "Filosofía de Molino: Autoconocimiento Sin Dogmas",
  description:
    "Conocé la filosofía de Molino: autoconocimiento sin dogmas, código abierto y privacidad radical. 100% privado, cálculo local, sin registro. Descubrí más.",
  path: "/filosofia",
  ogDescription:
    "Conocé la filosofía de Molino: autoconocimiento sin dogmas, código abierto y privacidad radical. 100% privado, cálculo local, sin registro. Descubrí más.",
  image: "/opengraph-image",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Filosofía de Molino: Autoconocimiento Sin Dogmas",
    description:
      "Conocé la filosofía de Molino: autoconocimiento sin dogmas, código abierto y privacidad radical. 100% privado, cálculo local, sin registro. Descubrí más.",
    image: siteUrl("/opengraph-image"),
    // Fechas reales tomadas de `git log` sobre FilosofiaContent.tsx (no una
    // fecha "de hoy" inventada): creación 2026-07-28, última modificación
    // de contenido 2026-08-17.
    datePublished: "2026-07-28T00:00:00Z",
    dateModified: "2026-08-17T00:00:00Z",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/filosofia"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/filosofia") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Filosofía" },
    ],
  },
];

export default function FilosofiaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FilosofiaContent />
    </>
  );
}