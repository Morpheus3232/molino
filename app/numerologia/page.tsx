import type { Metadata } from "next";
import NumerologiaContent from "./NumerologiaContent";

export const metadata: Metadata = {
  title: "Numerología — El lenguaje de los números",
  description:
    "Aprendé sobre numerología: Camino de Vida, Expression, Soul, Personality, números maestros y el sistema pitagórico. Una guía completa para entender tu mapa numérico.",
  openGraph: {
    title: "Numerología — Molino",
    description:
      "Aprendé sobre numerología: Camino de Vida, Expression, Soul, Personality y números maestros.",
    type: "article",
  },
};

export default function NumerologiaPage() {
  return <NumerologiaContent />;
}
