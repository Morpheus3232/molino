import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import NosotrosContent from "./NosotrosContent";

export const generateMetadata = metadataFor({
  title: ["Quiénes somos", "About us"],
  description: ["Por qué existe Molino: autoconocimiento sin sensacionalismo, cruzando numerología, astrología y zodíaco chino en una sola herramienta honesta.", "Why Molino exists: self-knowledge without sensationalism, crossing numerology, astrology and the Chinese zodiac in a single honest tool."],
  path: "/nosotros",
  ogTitle: ["Quiénes somos", "About us"],
  ogDescription: ["La historia y los valores detrás de Molino: por qué lo construimos y en qué creemos.", "The story and values behind Molino: why we built it and what we believe in."],
  image: "/opengraph-image",
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: L("Quiénes somos", "About us"),
    description: L("Por qué existe Molino: autoconocimiento sin sensacionalismo, cruzando numerología, astrología y zodíaco chino en una sola herramienta honesta.", "Why Molino exists: self-knowledge without sensationalism, crossing numerology, astrology and the Chinese zodiac in a single honest tool."),
    url: siteUrl("/nosotros"),
  },
  {
    // Nombre del proyecto, no de una persona — coherente con la narrativa
    // de la página (misión, no biografía del fundador).
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Molino",
    url: SITE_URL,
    email: "versionlimitada@proton.me",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Quiénes somos", "About us") },
    ],
  },
]);

export default async function NosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <NosotrosContent />
    </>
  );
}
