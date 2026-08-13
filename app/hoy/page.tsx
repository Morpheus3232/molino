import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import HoyClient from "./HoyClient";

export const metadata: Metadata = {
  title: "Hoy — Tu Energía y Foco Diario",
  description:
    "Descubrí tu vibración diaria, fase lunar, foco de acción y consejo del momento en Molino. 100% calculado en tu navegador.",
  alternates: {
    canonical: siteUrl("/hoy"),
  },
  openGraph: {
    title: "Tu Energía de Hoy — Molino",
    description:
      "Vibración diaria, pronóstico de 3 días y foco de acción según tu numerología y astrología.",
    type: "website",
    url: siteUrl("/hoy"),
  },
};

export default function HoyPage() {
  return <HoyClient />;
}
