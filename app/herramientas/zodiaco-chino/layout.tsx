import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculá tu Zodiaco Chino — Animal y Elemento",
  description:
    "Ingresá tu fecha de nacimiento y descubrí tu animal del zodiaco chino, elemento y polaridad. Basado en el calendario lunar y las fechas reales del Año Nuevo Chino.",
  openGraph: {
    title: "Zodiaco Chino — Molino",
    description:
      "Calculadora de zodiaco chino: tu animal, elemento y polaridad según el calendario lunar.",
    type: "website",
  },
};

export default function ZodiacoChinoCalcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
