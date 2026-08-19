import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Afinidad",
  description: "Descubrí la afinidad simbólica entre vos y el mundo: marcas, países, ciudades y personas históricas.",
  alternates: {
    canonical: siteUrl("/affinity"),
  },
  openGraph: {
    title: "Afinidad — Molino",
    description: "Afinidad simbólica entre vos y el mundo.",
    type: "website",
    url: siteUrl("/affinity"),
    images: [siteUrl("/opengraph-image")],
  },
};

export default function AffinityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
