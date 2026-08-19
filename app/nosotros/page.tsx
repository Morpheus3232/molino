import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import NosotrosContent from "./NosotrosContent";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Por qué existe Molino: autoconocimiento sin sensacionalismo, cruzando numerología, astrología y zodíaco chino en una sola herramienta honesta.",
  alternates: {
    canonical: siteUrl("/nosotros"),
  },
  openGraph: {
    title: "Quiénes somos — Molino",
    description: "La historia y los valores detrás de Molino: por qué lo construimos y en qué creemos.",
    type: "article",
    url: siteUrl("/nosotros"),
    images: [siteUrl("/opengraph-image")],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Quiénes somos — Molino",
    description: "Por qué existe Molino: autoconocimiento sin sensacionalismo, cruzando numerología, astrología y zodíaco chino en una sola herramienta honesta.",
    url: siteUrl("/nosotros"),
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
