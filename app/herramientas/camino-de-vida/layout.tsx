import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Camino de Vida",
  description:
    "Calculá tu número de Camino de Vida con la fecha de nacimiento. Significado del 1 al 9 y números maestros 11, 22, 33.",
  alternates: { canonical: siteUrl("/herramientas/camino-de-vida") },
  openGraph: {
    type: "website",
    url: siteUrl("/herramientas/camino-de-vida"),
    title: "Calculá tu Camino de Vida — Molino",
    description: "Número de Camino de Vida a partir de tu fecha de nacimiento.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculá tu Camino de Vida — Molino",
    description: "Número de Camino de Vida a partir de tu fecha de nacimiento.",
  },
};

export default function CaminoDeVidaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}