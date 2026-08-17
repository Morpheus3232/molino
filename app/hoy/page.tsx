import HoyClient from "./HoyClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Hoy — Tu Energía y Foco Diario",
  description:
    "Descubrí tu vibración diaria, fase lunar, foco de acción y consejo del momento en Molino. 100% calculado en tu navegador.",
  path: "/hoy",
  ogTitle: "Tu Energía de Hoy — Molino",
  ogDescription: "Vibración diaria, vista de 3 días y foco de acción según tu numerología y astrología.",
});

export default function HoyPage() {
  return <HoyClient />;
}
