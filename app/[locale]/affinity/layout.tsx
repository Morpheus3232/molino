import { initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { localeAlternates, localeUrl, siteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const L = await metaL(params);
  return {
    // { default, template } — ver nota en app/herramientas/layout.tsx.
    title: { default: L("Afinidad", "Affinity"), template: "%s" },
    description: L(
      "Descubrí la afinidad simbólica entre vos y el mundo: marcas, países, ciudades y personas históricas.",
      "Discover the symbolic affinity between you and the world: brands, countries, cities and historical figures.",
    ),
    alternates: localeAlternates("/affinity", L.locale),
    openGraph: {
      title: L("Afinidad", "Affinity"),
      description: L("Afinidad simbólica entre vos y el mundo.", "Symbolic affinity between you and the world."),
      type: "website",
      url: localeUrl("/affinity", L.locale),
      images: [siteUrl("/opengraph-image")],
    },
  };
}

export default async function AffinityLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
