import type { Metadata } from "next";
import BibliotecaContent from "./BibliotecaContent";

export const metadata: Metadata = {
  title: "Biblioteca — Fuentes y referencias",
  description: "Colección curada de libros, artículos y recursos sobre numerología, astrología, zodiaco chino, tarot, kabbalah y más sistemas simbólicos.",
  openGraph: {
    title: "Biblioteca — Molino",
    description: "Fuentes y referencias sobre numerología, astrología, zodiaco chino y otros sistemas simbólicos.",
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    headline: "Biblioteca — Fuentes y referencias",
    description: "Colección curada de libros, artículos y recursos sobre sistemas simbólicos de autoconocimiento.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: "https://molino-alpha.vercel.app/biblioteca",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://molino-alpha.vercel.app/biblioteca" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://molino-alpha.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Biblioteca" },
    ],
  },
];

export default function BibliotecaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BibliotecaContent />
    </>
  );
}
