import { SITE_URL, siteUrl, createRouteMetadata } from "@/lib/seo";
import ZodiacoChinoContent from "./ZodiacoChinoContent";

export const metadata = createRouteMetadata({
  title: "Zodiaco Chino — Los 12 animales, los 5 elementos",
  description: "Explorá el zodiaco chino: 12 animales, 5 elementos, ciclo sexagenario de 60 años. Un sistema milenario con una profundidad que va mucho más allá de tu animal.",
  path: "/conocimiento/zodiaco-chino",
  ogTitle: "Zodiaco Chino — Molino",
  ogDescription: "Explorá el zodiaco chino: 12 animales, 5 elementos, ciclo sexagenario de 60 años.",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Zodiaco Chino — Los 12 animales, los 5 elementos",
    description: "Explorá el zodiaco chino: 12 animales, 5 elementos, ciclo sexagenario de 60 años.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/conocimiento/zodiaco-chino"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/conocimiento/zodiaco-chino") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Conocimiento", item: siteUrl("/explore") },
      { "@type": "ListItem", position: 3, name: "Zodiaco Chino" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es el zodiaco chino?",
        acceptedAnswer: { "@type": "Answer", text: "El zodiaco chino es un sistema milenario que clasifica a las personas en 12 animales según su año de nacimiento. Cada animal tiene características de personalidad específicas y se combina con 5 elementos." },
      },
      {
        "@type": "Question",
        name: "¿Cómo sé cuál es mi animal del zodiaco chino?",
        acceptedAnswer: { "@type": "Answer", text: "Tu animal del zodiaco chino se determina por tu año de nacimiento según el calendario lunar chino. A diferencia del zodiaco occidental, el ciclo es anual (12 animales × 5 elementos = ciclo de 60 años)." },
      },
      {
        "@type": "Question",
        name: "¿La compatibilidad del zodiaco chino es confiable?",
        acceptedAnswer: { "@type": "Answer", text: "La compatibilidad del zodiaco chino es un sistema simbólico tradicional, no una predicción científica. Se basa en la relación entre los 12 animales (por ejemplo, Rata y Dragón tienen alta afinidad). Su valor es orientativo y cultural." },
      },
    ],
  },
];

export default function ZodiacoChinoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ZodiacoChinoContent />
    </>
  );
}
