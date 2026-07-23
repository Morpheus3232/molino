import type { Metadata } from "next";
import ZodiacoChinoExplorer from "./ZodiacoChinoExplorer";

export const metadata: Metadata = {
  title: "Zodiaco Chino — Un sistema de ciclos, animales y elementos",
  description: "Explorá el zodiaco chino: 12 animales, 5 elementos, ciclo sexagenario de 60 años. Un sistema milenario con una profundidad que va mucho más allá de tu animal.",
  openGraph: {
    title: "Zodiaco Chino — Molino",
    description: "Explorá el zodiaco chino: 12 animales, 5 elementos, ciclo sexagenario de 60 años.",
    type: "article",
  },
};

export default function ZodiacoChinoPage() {
  return <ZodiacoChinoExplorer />;
}
