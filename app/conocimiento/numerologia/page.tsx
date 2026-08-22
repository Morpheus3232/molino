import { SITE_URL, siteUrl, createRouteMetadata } from "@/lib/seo";
import NumerologiaContent from "./NumerologiaContent";

export const metadata = createRouteMetadata({
  title: "Numerología — El lenguaje simbólico de los números",
  description: "Aprendé sobre numerología: Camino de Vida, Expresión, Alma, Personalidad, números maestros y el sistema pitagórico. Una guía completa para entender tu mapa numérico.",
  path: "/conocimiento/numerologia",
  ogTitle: "Numerología",
  ogDescription: "Aprendé sobre numerología: Camino de Vida, Expression, Soul, Personality y números maestros.",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Numerología — El lenguaje simbólico de los números",
    description: "Aprendé sobre numerología: Camino de Vida, Expression, Soul, Personality, números maestros y el sistema pitagórico.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/conocimiento/numerologia"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/conocimiento/numerologia") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Conocimiento", item: siteUrl("/explore") },
      { "@type": "ListItem", position: 3, name: "Numerología" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es la numerología?",
        acceptedAnswer: { "@type": "Answer", text: "La numerología es un sistema simbólico que estudia la relación entre los números y los eventos de la vida. Se basa en la idea de que los números tienen un significado vibracional que puede ofrecer una perspectiva simbólica sobre la personalidad y los ciclos de vida." },
      },
      {
        "@type": "Question",
        name: "¿Cómo se calcula el Camino de Vida?",
        acceptedAnswer: { "@type": "Answer", text: "El Camino de Vida se calcula sumando todos los dígitos de tu fecha de nacimiento hasta reducirlos a un solo dígito (o a un número maestro 11, 22, 33). Por ejemplo, 15/08/1990 → 1+5+0+8+1+9+9+0 = 33 → número maestro." },
      },
      {
        "@type": "Question",
        name: "¿La numerología tiene base científica?",
        acceptedAnswer: { "@type": "Answer", text: "No, la numerología no está respaldada por el método científico. Es un sistema simbólico y de autoconocimiento, no una ciencia. Su valor está en la reflexión personal y la exploración de patrones." },
      },
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
