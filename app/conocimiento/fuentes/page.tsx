import type { Metadata } from "next";
import FuentesContent from "./FuentesContent";

export const metadata: Metadata = {
  title: "Fuentes y metodolog&iacute;a",
  description: "Conocé las fuentes y la metodología que Molino utiliza para numerología, astrología y zodiaco chino. Transparencia académica y rigor.",
  openGraph: {
    title: "Fuentes y metodolog&iacute;a — Molino",
    description: "Conocé las fuentes y la metodología que Molino utiliza para numerología, astrología y zodiaco chino.",
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Fuentes y metodología",
    description: "Conocé las fuentes y la metodología que Molino utiliza para numerología, astrología y zodiaco chino.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: "https://molino-alpha.vercel.app/conocimiento/fuentes",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://molino-alpha.vercel.app/conocimiento/fuentes" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://molino-alpha.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Conocimiento", item: "https://molino-alpha.vercel.app/explore" },
      { "@type": "ListItem", position: 3, name: "Fuentes" },
    ],
  },
];

export default function FuentesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FuentesContent />
    </>
  );
}
