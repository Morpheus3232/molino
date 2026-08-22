import { SITE_URL, siteUrl, createRouteMetadata } from "@/lib/seo";
import NosotrosContent from "./NosotrosContent";

export const metadata = createRouteMetadata({
  title: "Quiénes somos",
  description: "Por qué existe Molino: autoconocimiento sin sensacionalismo, cruzando numerología, astrología y zodíaco chino en una sola herramienta honesta.",
  path: "/nosotros",
  ogTitle: "Quiénes somos",
  ogDescription: "La historia y los valores detrás de Molino: por qué lo construimos y en qué creemos.",
  image: "/opengraph-image",
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Quiénes somos",
    description: "Por qué existe Molino: autoconocimiento sin sensacionalismo, cruzando numerología, astrología y zodíaco chino en una sola herramienta honesta.",
    url: siteUrl("/nosotros"),
  },
  {
    // Nombre del proyecto, no de una persona — coherente con la narrativa
    // de la página (misión, no biografía del fundador).
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Molino",
    url: SITE_URL,
    email: "hola@molino.app",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Quiénes somos" },
    ],
  },
];

export default function NosotrosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NosotrosContent />
    </>
  );
}
