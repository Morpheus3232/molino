import PremiumClient from "./PremiumClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Premium — Tu Síntesis Completa de Autoconocimiento",
  description:
    "Conectá los 3 sistemas en una lectura única: numerología, astrología y zodíaco chino. Explorá tus ciclos, rituales y decisiones sin sesgos. $8 USD de acceso permanente.",
  path: "/premium",
  ogTitle: "Molino Premium — Síntesis Rigurosa de Arquetipos",
  ogDescription: "Entendé tu mapa completo: arquetipos, ciclos de vida y dinámicas ocultas. Herramienta de reflexión honesta, no oráculo.",
});

export default function PremiumPage() {
  return <PremiumClient />;
}
