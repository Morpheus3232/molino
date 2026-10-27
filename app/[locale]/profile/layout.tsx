import { initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const L = await metaL(params);
  return {
    // { default, template } — ver nota en app/herramientas/layout.tsx.
    title: { default: L("Mi Mapa Personal", "My Personal Map"), template: "%s" },
    description:
      L("Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos. Explorá tu mapa en Molino.", "Your personal self-knowledge map: identity, connections and symbolic patterns. Explore your map on Molino."),
    openGraph: {
      title: L("Mi Mapa Personal", "My Personal Map"),
      description:
        L("Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos.", "Your personal self-knowledge map: identity, connections and symbolic patterns."),
      type: "website",
      siteName: "Molino",
    },
    twitter: {
      card: "summary_large_image",
      title: L("Mi Mapa Personal", "My Personal Map"),
      description:
        L("Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos.", "Your personal self-knowledge map: identity, connections and symbolic patterns."),
    },
  };
}

export default async function ProfileLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
