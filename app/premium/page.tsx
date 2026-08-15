import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import PremiumClient from "./PremiumClient";

export const metadata: Metadata = {
  title: "Premium — Tu Síntesis Completa de Autoconocimiento",
  description:
    "Conectá los 3 sistemas en una lectura única: numerología, astrología y zodíaco chino. Explorá tus ciclos, rituales y decisiones sin sesgos. $8 USD de acceso permanente.",
  alternates: {
    canonical: siteUrl("/premium"),
  },
  openGraph: {
    title: "Molino Premium — Síntesis Rigurosa de Arquetipos",
    description:
      "Entendé tu mapa completo: arquetipos, ciclos de vida y dinámicas ocultas. Herramienta de reflexión honesta, no oráculo.",
    type: "website",
    url: siteUrl("/premium"),
  },
};

export default function PremiumPage() {
  return <PremiumClient />;
}
