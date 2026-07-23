import type { Metadata } from "next";
import ZodiacoChinoContent from "./ZodiacoChinoContent";

export const metadata: Metadata = {
  title: "Zodiaco Chino — El ciclo de los 12 animales",
  description:
    "Aprendé sobre el zodiaco chino: los 12 animales, los 5 elementos y las compatibilidades. Un sistema milenario que revela patrones de personalidad.",
  openGraph: {
    title: "Zodiaco Chino — Molino",
    description:
      "Aprendé sobre el zodiaco chino: los 12 animales, los 5 elementos y las compatibilidades.",
    type: "article",
  },
};

export default function ZodiacoChinoPage() {
  return <ZodiacoChinoContent />;
}
