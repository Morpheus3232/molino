import type { Metadata } from "next";
import NumerologiaContent from "./NumerologiaContent";

export const metadata: Metadata = {
  title: "Numerología — El lenguaje simbólico de los números",
  description: "Aprendé sobre numerología: Camino de Vida, Expresión, Alma, Personalidad, números maestros y el sistema pitagórico. Una guía completa para entender tu mapa numérico.",
  openGraph: {
    title: "Numerología — Molino",
    description: "Aprendé sobre numerología: Camino de Vida, Expression, Soul, Personality y números maestros.",
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Numerología — El lenguaje simbólico de los números",
    description: "Aprendé sobre numerología: Camino de Vida, Expression, Soul, Personality, números maestros y el sistema pitagórico.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: "https://molino-alpha.vercel.app/conocimiento/numerologia",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://molino-alpha.vercel.app/conocimiento/numerologia" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://molino-alpha.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Conocimiento", item: "https://molino-alpha.vercel.app/explore" },
      { "@type": "ListItem", position: 3, name: "Numerología" },
    ],
  },
];

export default function NumerologiaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NumerologiaContent />
    </>
  );
}
