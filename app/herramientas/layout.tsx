import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Herramientas — Calculadoras Simbólicas",
  description:
    "Calculá tu Camino de Vida, signo solar y zodiaco chino. Herramientas interactivas basadas en numerología, astrología y tradiciones del zodíaco chino.",
  openGraph: {
    title: "Herramientas — Molino",
    description:
      "Calculadoras simbólicas: Camino de Vida, signo solar, zodiaco chino y compatibilidad.",
    type: "website",
  },
};

export default function HerramientasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
