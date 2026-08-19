import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import FuentesContent from "./FuentesContent";

export const metadata: Metadata = {
  title: "Fuentes y metodología",
  description: "Conocé las fuentes y la metodología que Molino utiliza para numerología, astrología y zodiaco chino. Transparencia académica y rigor.",
  alternates: {
    canonical: siteUrl("/conocimiento/fuentes"),
  },
  openGraph: {
    title: "Fuentes y metodología — Molino",
    description: "Conocé las fuentes y la metodología que Molino utiliza para numerología, astrología y zodiaco chino.",
    type: "article",
    url: siteUrl("/conocimiento/fuentes"),
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
    url: siteUrl("/conocimiento/fuentes"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/conocimiento/fuentes") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Conocimiento", item: siteUrl("/explore") },
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
