import type { Metadata } from "next";
import MotoresContent from "./MotoresContent";

export const metadata: Metadata = {
  title: "Motores y fórmulas — Molino",
  description: "Documentación técnica de los motores de cálculo: fórmulas de numerología (Camino de Vida, Expresión), astronomía de precisión (Swiss Ephemeris) y calendario chino (ciclo sexagenario).",
  openGraph: {
    title: "Motores y fórmulas — Molino",
    description: "Fórmulas y algoritmos detrás de Molino: numerología, astrología de precisión, zodíaco chino. Código abierto y auditable.",
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Motores y fórmulas — Molino",
    description: "Documentación técnica de los motores de cálculo de Molino.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: "https://molino-alpha.vercel.app/docs/motores",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://molino-alpha.vercel.app/docs/motores" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://molino-alpha.vercel.app" },
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