import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Calculá tu Signo Solar — Astrología",
  description:
    "Ingresá tu fecha de nacimiento y descubrí tu signo zodiacal occidental. Astrología clásica: signos, elementos, modalidades y compatibilidades.",
  alternates: { canonical: siteUrl("/herramientas/signo-solar") },
  openGraph: {
    title: "Signo Solar — Molino",
    description:
      "Calculadora de signo solar: descubrí tu signo zodiacal occidental según tu fecha de nacimiento.",
    type: "website",
  },
};

export default function SignoSolarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
