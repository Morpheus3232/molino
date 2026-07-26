import type { Metadata } from "next";
import InsightsContent from "./InsightsContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi Inteligencia Personal | Molino",
  description: "Tu feed personalizado de exploración simbólica. Patrones, recomendaciones y descubrimientos según el zodíaco chino.",
  openGraph: {
    title: "Mi Inteligencia Personal — Molino",
    description: "Exploración personal basada en tradiciones culturales del zodíaco chino.",
    type: "website",
  },
};

export default function InsightsPage() {
  return <InsightsContent />;
}
