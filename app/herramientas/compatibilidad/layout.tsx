import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compatibilidad Simbólica — Persona con Persona",
  description:
    "Ingresá las fechas de nacimiento de dos personas y descubrí su compatibilidad según el zodiaco chino. Compará animales, elementos y relaciones tradicionales.",
  openGraph: {
    title: "Compatibilidad Simbólica — Molino",
    description:
      "Calculadora de compatibilidad persona↔persona según el zodíaco chino.",
    type: "website",
  },
};

export default function CompatibilidadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
