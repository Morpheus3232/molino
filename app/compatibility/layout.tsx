import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Compatibilidad",
  description:
    "Descubrí la compatibilidad entre tu energía y la de países, marcas y personas usando numerología y zodiaco chino.",
  alternates: { canonical: siteUrl("/compatibility") },
  openGraph: {
    type: "website",
    url: siteUrl("/compatibility"),
    title: "Compatibilidad — Molino",
    description: "Compatibilidad entre tu energía y la de países, marcas y personas.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compatibilidad — Molino",
    description: "Compatibilidad entre tu energía y la de países, marcas y personas.",
  },
};

export default function CompatibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}