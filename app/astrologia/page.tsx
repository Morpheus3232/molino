import type { Metadata } from "next";
import AstrologiaContent from "./AstrologiaContent";

export const metadata: Metadata = {
  title: "Astrología — El lenguaje de los astros",
  description:
    "Aprendé sobre astrología: signos zodiacales, planetas, casas y aspectos. Un sistema simbólico que explora arquetipos, ciclos y patrones de personalidad.",
  openGraph: {
    title: "Astrología — Molino",
    description:
      "Aprendé sobre astrología: signos zodiacales, planetas, casas y aspectos.",
    type: "article",
  },
};

export default function AstrologiaPage() {
  return <AstrologiaContent />;
}
