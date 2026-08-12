import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import BibliotecaContent from "./BibliotecaContent";

export const metadata: Metadata = {
  title: "Biblioteca — Fuentes y referencias",
  description: "Colección curada de libros, artículos y recursos sobre numerología, astrología, zodiaco chino, kabbalah y más sistemas simbólicos.",
  alternates: {
    canonical: siteUrl("/biblioteca"),
  },
  openGraph: {
    title: "Biblioteca — Molino",
    description: "Fuentes y referencias sobre numerología, astrología, zodiaco chino y otros sistemas simbólicos.",
    type: "article",
    url: siteUrl("/biblioteca"),
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
    url: siteUrl("/biblioteca"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/biblioteca") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
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
