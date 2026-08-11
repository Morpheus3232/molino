import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // See REVIEW note in app/layout.tsx — title.template doesn't reach this depth.
  title: "Signo Solar | Molino",
  description:
    "Calculá tu signo solar con tu fecha de nacimiento. Conocé los 12 signos del zodíaco occidental, sus elementos y modalidades.",
  alternates: { canonical: siteUrl("/herramientas/signo-solar") },
  openGraph: {
    type: "website",
    url: siteUrl("/herramientas/signo-solar"),
    title: "Calculá tu Signo Solar — Molino",
    description: "Signo zodiacal occidental a partir de tu fecha de nacimiento.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculá tu Signo Solar — Molino",
    description: "Signo zodiacal occidental a partir de tu fecha de nacimiento.",
  },
};

export default function SignoSolarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}