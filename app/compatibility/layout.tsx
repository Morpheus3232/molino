import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // { default, template } — ver nota en app/herramientas/layout.tsx.
  title: { default: "Compatibilidad", template: "%s" },
  description:
    "Descubrí la compatibilidad entre tu energía y la de países, marcas y personas usando numerología y zodiaco chino.",
  alternates: { canonical: siteUrl("/compatibility") },
  openGraph: {
    type: "website",
    url: siteUrl("/compatibility"),
    title: "Compatibilidad",
    description: "Compatibilidad entre tu energía y la de países, marcas y personas.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compatibilidad",
    description: "Compatibilidad entre tu energía y la de países, marcas y personas.",
  },
};

export default function CompatibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}