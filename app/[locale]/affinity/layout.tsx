import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  // { default, template } — ver nota en app/herramientas/layout.tsx.
  title: { default: "Afinidad", template: "%s" },
  description: "Descubrí la afinidad simbólica entre vos y el mundo: marcas, países, ciudades y personas históricas.",
  alternates: {
    canonical: siteUrl("/affinity"),
  },
  openGraph: {
    title: "Afinidad",
    description: "Afinidad simbólica entre vos y el mundo.",
    type: "website",
    url: siteUrl("/affinity"),
    images: [siteUrl("/opengraph-image")],
  },
};

export default async function AffinityLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
