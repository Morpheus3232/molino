import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Explorá el conocimiento",
  description:
    "Explorá numerología, astrología, zodiaco chino y compatibilidad. Todo el conocimiento de Molino, con sus fuentes y metodología, abierto y auditable.",
  alternates: { canonical: siteUrl("/explore") },
  openGraph: {
    type: "website",
    url: siteUrl("/explore"),
    title: "Explorá el conocimiento — Molino",
    description:
      "Numerología, astrología, zodiaco chino y compatibilidad. Conocimiento abierto y auditable.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explorá el conocimiento — Molino",
    description: "Numerología, astrología, zodiaco chino y compatibilidad.",
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
