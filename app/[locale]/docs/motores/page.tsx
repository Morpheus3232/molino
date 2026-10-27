import { useL, type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import MotoresContent from "./MotoresContent";

export const generateMetadata = metadataFor({
  title: ["Motores y fórmulas", "Engines and formulas"],
  description: ["Documentación técnica de los motores de cálculo: fórmulas de numerología (Camino de Vida, Expresión), astronomía de precisión (Swiss Ephemeris) y calendario chino (ciclo sexagenario).", "Technical documentation of the calculation engines: numerology formulas (Life Path, Expression), precision astronomy (Swiss Ephemeris) and the Chinese calendar (sexagenary cycle)."],
  path: "/docs/motores",
  ogTitle: ["Motores y fórmulas", "Engines and formulas"],
  ogDescription: ["Fórmulas y algoritmos detrás de Molino: numerología, astrología de precisión, zodíaco chino. Código abierto y auditable.", "The formulas and algorithms behind Molino: numerology, precision astrology, the Chinese zodiac. Open source and auditable."],
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: L("Motores y fórmulas", "Engines and formulas"),
    description: L("Documentación técnica de los motores de cálculo de Molino.", "Technical documentation of Molino's calculation engines."),
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/docs/motores"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/docs/motores") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Documentación", "Documentation") },
      { "@type": "ListItem", position: 3, name: L("Motores", "Engines") },
    ],
  },
]);

export default function MotoresPage() {
  const L = useL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <MotoresContent />
    </>
  );
}