import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import PremiumClient from "./PremiumClient";

export const metadata: Metadata = {
  title: "Premium — Tu Síntesis Completa de Autoconocimiento",
  description:
    "Desbloqueá la lectura cruzada completa de tus 3 sistemas: numerología, astrología y zodíaco chino. Pago único de $8 USD de por vida con garantía de devolución de 7 días.",
  alternates: {
    canonical: siteUrl("/premium"),
  },
  openGraph: {
    title: "Molino Premium — Claridad y Síntesis Sin Límites",
    description:
      "Descubrí qué significa la combinación exacta de tus arquetipos, ciclos de vida y tensiones ocultas por $8 USD de por vida.",
    type: "website",
    url: siteUrl("/premium"),
  },
};

export default function PremiumPage() {
  return <PremiumClient />;
}
