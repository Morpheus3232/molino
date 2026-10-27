import { useL, type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import NumerologiaContent from "./NumerologiaContent";

export const generateMetadata = metadataFor({
  title: ["Numerología — El lenguaje simbólico de los números", "Numerology — The Symbolic Language of Numbers"],
  description: ["Aprendé sobre numerología: Camino de Vida, Expresión, Personalidad, números maestros y el sistema pitagórico. Una guía completa para entender tu mapa numérico.", "Learn about numerology: Life Path, Expression, Personality, master numbers and the Pythagorean system. A complete guide to understanding your numerical map."],
  path: "/conocimiento/numerologia",
  ogTitle: "Numerología",
  ogDescription: ["Aprendé sobre numerología: Camino de Vida, Expresión, Personalidad y números maestros.", "Learn about numerology: Life Path, Expression, Personality and master numbers."],
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: L("Numerología — El lenguaje simbólico de los números", "Numerology — The Symbolic Language of Numbers"),
    description: L("Aprendé sobre numerología: Camino de Vida, Expresión, Personalidad, números maestros y el sistema pitagórico.", "Learn about numerology: Life Path, Expression, Personality, master numbers and the Pythagorean system."),
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/conocimiento/numerologia"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/conocimiento/numerologia") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Conocimiento", "Knowledge"), item: siteUrl("/explore") },
      { "@type": "ListItem", position: 3, name: "Numerología" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: L("¿Qué es la numerología?", "What is numerology?"),
        acceptedAnswer: { "@type": "Answer", text: L("La numerología es un sistema simbólico que estudia la relación entre los números y los eventos de la vida. Se basa en la idea de que los números tienen un significado vibracional que puede ofrecer una perspectiva simbólica sobre la personalidad y los ciclos de vida.", "Numerology is a symbolic system that studies the relationship between numbers and life events. It's based on the idea that numbers have a vibrational meaning that can offer a symbolic perspective on personality and life cycles.") },
      },
      {
        "@type": "Question",
        name: L("¿Cómo se calcula el Camino de Vida?", "How is the Life Path calculated?"),
        acceptedAnswer: { "@type": "Answer", text: L("El Camino de Vida se calcula sumando todos los dígitos de tu fecha de nacimiento hasta reducirlos a un solo dígito (o a un número maestro 11, 22, 33). Por ejemplo, 15/08/1990 → 1+5+0+8+1+9+9+0 = 33 → número maestro.", "The Life Path is calculated by adding up all the digits of your date of birth until they reduce to a single digit (or to a master number 11, 22, 33). For example, 08/15/1990 → 1+5+0+8+1+9+9+0 = 33 → master number.") },
      },
      {
        "@type": "Question",
        name: L("¿La numerología tiene base científica?", "Does numerology have a scientific basis?"),
        acceptedAnswer: { "@type": "Answer", text: L("No, la numerología no está respaldada por el método científico. Es un sistema simbólico y de autoconocimiento, no una ciencia. Su valor está en la reflexión personal y la exploración de patrones.", "No, numerology isn't backed by the scientific method. It's a symbolic, self-knowledge system, not a science. Its value lies in personal reflection and exploring patterns.") },
      },
    ],
  },
]);

export default function NumerologiaPage() {
  const L = useL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <NumerologiaContent />
    </>
  );
}
