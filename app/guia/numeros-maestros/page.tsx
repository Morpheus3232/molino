import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import GuiaContent from "./GuiaContent";

export const metadata: Metadata = {
  title: "Números Maestros 11, 22, 33 — Significado en numerología",
  description: "Qué son los números maestros 11, 22 y 33, por qué no se reducen como el resto y cómo identificarlos en tu Camino de Vida, Expresión o número de Alma.",
  alternates: {
    canonical: siteUrl("/guia/numeros-maestros"),
  },
  openGraph: {
    title: "Números Maestros 11, 22, 33 | Guía | Molino",
    description: "Las frecuencias que no se reducen: qué significan el 11, el 22 y el 33 en numerología y cómo identificarlos en tu mapa.",
    type: "article",
    url: siteUrl("/guia/numeros-maestros"),
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Números Maestros 11, 22, 33 — Significado en numerología",
    description: "Qué son los números maestros y cómo identificarlos en tu mapa personal.",
    author: { "@type": "Organization", name: "Molino" },
    publisher: { "@type": "Organization", name: "Molino" },
    datePublished: "2026-08-11",
    dateModified: "2026-08-11",
    url: siteUrl("/guia/numeros-maestros"),
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl("/guia/numeros-maestros") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guía", item: siteUrl("/guia") },
      { "@type": "ListItem", position: 3, name: "Números Maestros" },
    ],
  },
];

export default function NumerosMaestrosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GuiaContent />
    </>
  );
}
