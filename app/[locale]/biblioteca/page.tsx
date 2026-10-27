import { useL, type Pick2 } from "@/lib/i18n/useL";
import { SITE_URL, siteUrl, metadataFor } from "@/lib/seo";
import BibliotecaContent from "./BibliotecaContent";

export const generateMetadata = metadataFor({
  title: ["Biblioteca — Fuentes y referencias", "Library — Sources and References"],
  description: ["Colección curada de libros, artículos y recursos sobre numerología, astrología, zodiaco chino, kabbalah y más sistemas simbólicos.", "A curated collection of books, articles and resources on numerology, astrology, the Chinese zodiac, Kabbalah and other symbolic systems."],
  path: "/biblioteca",
  ogTitle: ["Biblioteca", "Library"],
  ogDescription: ["Fuentes y referencias sobre numerología, astrología, zodiaco chino y otros sistemas simbólicos.", "Sources and references on numerology, astrology, the Chinese zodiac and other symbolic systems."],
});

const jsonLd = (L: Pick2) => ([
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    headline: L("Biblioteca — Fuentes y referencias", "Library — Sources and References"),
    description: L("Colección curada de libros, artículos y recursos sobre sistemas simbólicos de autoconocimiento.", "A curated collection of books, articles and resources on symbolic self-knowledge systems."),
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/biblioteca"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/biblioteca") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: L("Biblioteca", "Library") },
    ],
  },
]);

export default function BibliotecaPage() {
  const L = useL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <BibliotecaContent />
    </>
  );
}
