import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import FilosofiaContent from "./FilosofiaContent";

export const metadata: Metadata = {
  title: "Filosofía",
  description: "La filosofía detrás de Molino: autoconocimiento sin dogmas, código abierto, privacidad radical y síntesis de tradiciones simbólicas milenarias.",
  alternates: {
    canonical: siteUrl("/filosofia"),
  },
  openGraph: {
    title: "Filosofía — Molino",
    description: "Autoconocimiento sin dogmas, código abierto, privacidad radical. La síntesis de tradiciones simbólicas milenarias en una herramienta moderna.",
    type: "article",
    url: siteUrl("/filosofia"),
    images: [siteUrl("/opengraph-image")],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Filosofía — Molino",
    description: "La filosofía detrás de Molino: autoconocimiento sin dogmas, código abierto, privacidad radical y síntesis de tradiciones simbólicas milenarias.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    url: siteUrl("/filosofia"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/filosofia") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Filosofía" },
    ],
  },
];

export default function FilosofiaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FilosofiaContent />
    </>
  );
}