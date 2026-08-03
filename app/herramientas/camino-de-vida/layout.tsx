import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Calculá tu Camino de Vida — Numerología",
  description:
    "Ingresá tu fecha de nacimiento y calculá tu número de Camino de Vida. Descubrí qué energía central tenés según la tradición numerológica pitagórica.",
  alternates: { canonical: siteUrl("/herramientas/camino-de-vida") },
  openGraph: {
    title: "Camino de Vida — Molino",
    description:
      "Calculadora de Camino de Vida: descubrí tu número principal según la numerología.",
    type: "website",
  },
};

export default function CaminoDeVidaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
