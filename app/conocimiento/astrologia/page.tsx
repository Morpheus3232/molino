import { SITE_URL, siteUrl, createRouteMetadata } from "@/lib/seo";
import AstrologiaContent from "./AstrologiaContent";

export const metadata = createRouteMetadata({
  title: "Astrología — El lenguaje de los astros",
  description: "Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía. Un sistema simbólico con 4000 años de historia.",
  path: "/conocimiento/astrologia",
  ogTitle: "Astrología — Molino",
  ogDescription: "Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía.",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Astrología — El lenguaje de los astros",
    description: "Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/conocimiento/astrologia"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/conocimiento/astrologia") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Conocimiento", item: siteUrl("/explore") },
      { "@type": "ListItem", position: 3, name: "Astrología" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es la astrología?",
        acceptedAnswer: { "@type": "Answer", text: "La astrología es un sistema simbólico que estudia la relación entre la posición de los astros y los rasgos de personalidad. Sus orígenes se remontan a la antigua Babilonia, hace más de 4000 años." },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la diferencia entre astrología y astronomía?",
        acceptedAnswer: { "@type": "Answer", text: "La astronomía es una ciencia que estudia los cuerpos celestes desde un enfoque físico y matemático. La astrología es un sistema simbólico que interpreta las posiciones planetarias como arquetipos de personalidad." },
      },
      {
        "@type": "Question",
        name: "¿Qué son los signos zodiacales?",
        acceptedAnswer: { "@type": "Answer", text: "Los signos zodiacales son 12 divisiones del cielo de 30 grados cada una, basadas en la posición del Sol en el momento del nacimiento. Cada signo tiene un elemento y una modalidad que definen sus características." },
      },
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
