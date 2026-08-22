import { SITE_URL, siteUrl, createRouteMetadata } from "@/lib/seo";
import MotoresContent from "./MotoresContent";

export const metadata = createRouteMetadata({
  title: "Motores y fórmulas",
  description: "Documentación técnica de los motores de cálculo: fórmulas de numerología (Camino de Vida, Expresión), astronomía de precisión (Swiss Ephemeris) y calendario chino (ciclo sexagenario).",
  path: "/docs/motores",
  ogTitle: "Motores y fórmulas",
  ogDescription: "Fórmulas y algoritmos detrás de Molino: numerología, astrología de precisión, zodíaco chino. Código abierto y auditable.",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Motores y fórmulas",
    description: "Documentación técnica de los motores de cálculo de Molino.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/docs/motores"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/docs/motores") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Documentación" },
      { "@type": "ListItem", position: 3, name: "Motores" },
    ],
  },
];

export default function MotoresPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MotoresContent />
    </>
  );
}