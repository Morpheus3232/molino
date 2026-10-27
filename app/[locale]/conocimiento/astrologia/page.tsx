import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import AstrologiaContent from "./AstrologiaContent";

export const generateMetadata = metadataFor({
  title: ["Astrología — El lenguaje de los astros", "Astrology — The Language of the Stars"],
  description: ["Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía. Un sistema simbólico con 4000 años de historia.", "Learn about astrology: zodiac signs, elements, modalities and how it differs from astronomy. A symbolic system with 4,000 years of history."],
  path: "/conocimiento/astrologia",
  ogTitle: "Astrología",
  ogDescription: ["Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía.", "Learn about astrology: zodiac signs, elements, modalities and how it differs from astronomy."],
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: L("Astrología — El lenguaje de los astros", "Astrology — The Language of the Stars"),
    description: L("Aprendé sobre astrología: signos zodiacales, elementos, modalidades y la diferencia con la astronomía.", "Learn about astrology: zodiac signs, elements, modalities and how it differs from astronomy."),
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/conocimiento/astrologia"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/conocimiento/astrologia") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Conocimiento", "Knowledge"), item: siteUrl("/explore") },
      { "@type": "ListItem", position: 3, name: "Astrología" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: L("¿Qué es la astrología?", "What is astrology?"),
        acceptedAnswer: { "@type": "Answer", text: L("La astrología es un sistema simbólico que estudia la relación entre la posición de los astros y los rasgos de personalidad. Sus orígenes se remontan a la antigua Babilonia, hace más de 4000 años.", "Astrology is a symbolic system that studies the relationship between the position of the stars and personality traits. Its origins go back to ancient Babylon, more than 4,000 years ago.") },
      },
      {
        "@type": "Question",
        name: L("¿Cuál es la diferencia entre astrología y astronomía?", "What's the difference between astrology and astronomy?"),
        acceptedAnswer: { "@type": "Answer", text: L("La astronomía es una ciencia que estudia los cuerpos celestes desde un enfoque físico y matemático. La astrología es un sistema simbólico que interpreta las posiciones planetarias como arquetipos de personalidad.", "Astronomy is a science that studies celestial bodies from a physical and mathematical point of view. Astrology is a symbolic system that interprets planetary positions as personality archetypes.") },
      },
      {
        "@type": "Question",
        name: L("¿Qué son los signos zodiacales?", "What are the zodiac signs?"),
        acceptedAnswer: { "@type": "Answer", text: L("Los signos zodiacales son 12 divisiones del cielo de 30 grados cada una, basadas en la posición del Sol en el momento del nacimiento. Cada signo tiene un elemento y una modalidad que definen sus características.", "The zodiac signs are 12 divisions of the sky of 30 degrees each, based on the position of the Sun at the moment of birth. Each sign has an element and a modality that define its characteristics.") },
      },
    ],
  },
]);

export default async function AstrologiaPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <AstrologiaContent />
    </>
  );
}
