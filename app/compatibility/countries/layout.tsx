import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // See REVIEW note in app/layout.tsx — title.template doesn't reach this depth.
  title: "Compatibilidad con países | Molino",
  description:
    "Descubrí la compatibilidad entre tu energía y la de los países del mundo, usando numerología y zodíaco chino.",
  alternates: { canonical: siteUrl("/compatibility/countries") },
  openGraph: {
    type: "website",
    url: siteUrl("/compatibility/countries"),
    title: "Compatibilidad con países — Molino",
    description: "Compatibilidad entre tu energía y la de los países del mundo.",
    images: [siteUrl("/opengraph-image")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compatibilidad con países — Molino",
    description: "Compatibilidad entre tu energía y la de los países del mundo.",
  },
};

export default function CountriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
