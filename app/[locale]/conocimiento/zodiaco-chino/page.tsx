import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import ZodiacoChinoContent from "./ZodiacoChinoContent";

export const generateMetadata = metadataFor({
  title: ["Los 12 animales del zodíaco chino: años, elementos y compatibilidad", "The 12 Chinese zodiac animals: years, elements and compatibility"],
  description: ["Qué animal del horóscopo chino sos según tu año: tabla de 1924 a 2031 con el elemento y el día exacto en que empieza cada año chino. Los 12 animales y los 5 elementos.", "Which Chinese horoscope animal you are by year: a table from 1924 to 2031 with the element and the exact day each Chinese year starts. The 12 animals and the 5 elements."],
  path: "/conocimiento/zodiaco-chino",
  ogTitle: "Zodiaco Chino",
  ogDescription: ["Explorá el zodiaco chino: 12 animales, 5 elementos, ciclo sexagenario de 60 años.", "Explore the Chinese zodiac: 12 animals, 5 elements, the 60-year sexagenary cycle."],
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: L("Los 12 animales del zodíaco chino: años, elementos y compatibilidad", "The 12 Chinese zodiac animals: years, elements and compatibility"),
    description: L("Explorá el zodiaco chino: 12 animales, 5 elementos, ciclo sexagenario de 60 años.", "Explore the Chinese zodiac: 12 animals, 5 elements, the 60-year sexagenary cycle."),
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/conocimiento/zodiaco-chino"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/conocimiento/zodiaco-chino") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Conocimiento", "Knowledge"), item: siteUrl("/explore") },
      { "@type": "ListItem", position: 3, name: "Zodiaco Chino" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: L("¿Qué es el zodiaco chino?", "What is the Chinese zodiac?"),
        acceptedAnswer: { "@type": "Answer", text: L("El zodiaco chino es un sistema milenario que clasifica a las personas en 12 animales según su año de nacimiento. Cada animal tiene características de personalidad específicas y se combina con 5 elementos.", "The Chinese zodiac is an age-old system that classifies people into 12 animals according to their year of birth. Each animal has specific personality traits and is combined with 5 elements.") },
      },
      {
        "@type": "Question",
        name: L("¿Cómo sé cuál es mi animal del zodiaco chino?", "How do I know my Chinese zodiac animal?"),
        acceptedAnswer: { "@type": "Answer", text: L("Tu animal del zodiaco chino se determina por tu año de nacimiento según el calendario lunar chino. A diferencia del zodiaco occidental, el ciclo es anual (12 animales × 5 elementos = ciclo de 60 años).", "Your Chinese zodiac animal is determined by your year of birth according to the Chinese lunar calendar. Unlike the Western zodiac, the cycle is yearly (12 animals × 5 elements = a 60-year cycle).") },
      },
      {
        "@type": "Question",
        name: L("¿La compatibilidad del zodiaco chino es confiable?", "Is Chinese zodiac compatibility reliable?"),
        acceptedAnswer: { "@type": "Answer", text: L("La compatibilidad del zodiaco chino es un sistema simbólico tradicional, no una predicción científica. Se basa en la relación entre los 12 animales (por ejemplo, Rata y Dragón tienen alta afinidad). Su valor es orientativo y cultural.", "Chinese zodiac compatibility is a traditional symbolic system, not a scientific prediction. It's based on the relationships between the 12 animals (for example, Rat and Dragon have a high affinity). Its value is as cultural guidance.") },
      },
    ],
  },
]);

export default async function ZodiacoChinoPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <ZodiacoChinoContent />
    </>
  );
}
