import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // See REVIEW note in app/layout.tsx — title.template doesn't reach this depth.
  title: "Zodiaco Chino | Molino",
  description:
    "Calculá tu animal del zodíaco chino con tu fecha de nacimiento. Conocé los 12 animales, los 5 elementos y las compatibilidades.",
  alternates: { canonical: siteUrl("/herramientas/zodiaco-chino") },
  openGraph: {
    type: "website",
    url: siteUrl("/herramientas/zodiaco-chino"),
    title: "Calculá tu animal del Zodiaco Chino — Molino",
    description: "Animal del zodíaco chino a partir de tu fecha de nacimiento.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculá tu animal del Zodiaco Chino — Molino",
    description: "Animal del zodíaco chino a partir de tu fecha de nacimiento.",
  },
};

export default function ZodiacoChinoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
