import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // Hardcoded suffix: at this nesting depth Next's title.template from the
  // root layout stops applying (reproduced across several routes — see
  // REVIEW note in app/layout.tsx). Verified via curl against rendered <title>.
  title: "Compatibilidad con marcas | Molino",
  description:
    "Descubrí la compatibilidad entre tu energía y la de las marcas más importantes del mundo, usando numerología y zodíaco chino.",
  alternates: { canonical: siteUrl("/compatibility/brands") },
  openGraph: {
    type: "website",
    url: siteUrl("/compatibility/brands"),
    title: "Compatibilidad con marcas — Molino",
    description: "Compatibilidad entre tu energía y la de las marcas del mundo.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compatibilidad con marcas — Molino",
    description: "Compatibilidad entre tu energía y la de las marcas del mundo.",
  },
};

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
