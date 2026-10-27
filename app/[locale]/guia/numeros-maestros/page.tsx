import { useL, type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import GuiaContent from "./GuiaContent";

export const generateMetadata = metadataFor({
  title: ["Números Maestros 11, 22, 33 — Significado en numerología", "Master Numbers 11, 22, 33 — Meaning in Numerology"],
  description: ["Qué son los números maestros 11, 22 y 33, por qué no se reducen como el resto y cómo identificarlos en tu Camino de Vida, Expresión o Personalidad.", "What the master numbers 11, 22 and 33 are, why they aren't reduced like the rest, and how to spot them in your Life Path, Expression or Personality."],
  path: "/guia/numeros-maestros",
  ogTitle: ["Números Maestros 11, 22, 33 | Guía", "Master Numbers 11, 22, 33 | Guide"],
  ogDescription: ["Las frecuencias que no se reducen: qué significan el 11, el 22 y el 33 en numerología y cómo identificarlos en tu mapa.", "The frequencies that don't reduce: what 11, 22 and 33 mean in numerology and how to spot them in your map."],
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: L("Números Maestros 11, 22, 33 — Significado en numerología", "Master Numbers 11, 22, 33 — Meaning in Numerology"),
    description: L("Qué son los números maestros y cómo identificarlos en tu mapa personal.", "What master numbers are and how to spot them in your personal map."),
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    datePublished: "2026-08-11",
    dateModified: "2026-08-11",
    url: siteUrl("/guia/numeros-maestros"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/guia/numeros-maestros") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Guía", "Guide"), item: siteUrl("/guia") },
      { "@type": "ListItem", position: 3, name: L("Números Maestros", "Master Numbers") },
    ],
  },
]);

export default function NumerosMaestrosPage() {
  const L = useL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <GuiaContent />
    </>
  );
}
