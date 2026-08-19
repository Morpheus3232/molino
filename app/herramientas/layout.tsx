import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Herramientas",
  description:
    "Calculá tu Camino de Vida, signo solar, animal del zodiaco chino y compatibilidad. Herramientas abiertas, sin registro ni cookies.",
  alternates: { canonical: siteUrl("/herramientas") },
  openGraph: {
    type: "website",
    url: siteUrl("/herramientas"),
    title: "Herramientas — Molino",
    description: "Calculá tu Camino de Vida, signo solar, zodiaco chino y compatibilidad.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Herramientas — Molino",
    description: "Calculadora de Camino de Vida, signo solar y zodiaco chino.",
  },
};

export default function HerramientasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}