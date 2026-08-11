import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // See REVIEW note in app/layout.tsx — title.template doesn't reach this depth.
  title: "Compatibilidad zodiacal | Molino",
  description:
    "Calculá la compatibilidad entre dos personas según su numerología y zodíaco chino. Sin registro, gratis y auditable.",
  alternates: { canonical: siteUrl("/herramientas/compatibilidad") },
  openGraph: {
    type: "website",
    url: siteUrl("/herramientas/compatibilidad"),
    title: "Compatibilidad — Molino",
    description: "Calculá la compatibilidad entre dos personas según numerología y zodiaco chino.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compatibilidad — Molino",
    description: "Calculá la compatibilidad entre dos personas según numerología y zodiaco chino.",
  },
};

export default function CompatibilidadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
