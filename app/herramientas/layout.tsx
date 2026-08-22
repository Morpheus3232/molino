import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // { default, template } (no un string plano) es lo que hace que el
  // template "%s" del root layout siga aplicando a las rutas
  // hijas — un `title` string en un layout intermedio corta la cadena
  // de herencia del template para todo lo que está debajo, sin importar
  // la profundidad (ver REVIEW note histórica en app/layout.tsx).
  title: { default: "Herramientas", template: "%s" },
  description:
    "Calculá tu Camino de Vida, signo solar, animal del zodiaco chino y compatibilidad. Herramientas abiertas, sin registro ni cookies.",
  alternates: { canonical: siteUrl("/herramientas") },
  openGraph: {
    type: "website",
    url: siteUrl("/herramientas"),
    title: "Herramientas",
    description: "Calculá tu Camino de Vida, signo solar, zodiaco chino y compatibilidad.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Herramientas",
    description: "Calculadora de Camino de Vida, signo solar y zodiaco chino.",
  },
};

export default function HerramientasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}