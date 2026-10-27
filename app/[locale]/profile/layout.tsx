import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // { default, template } — ver nota en app/herramientas/layout.tsx.
  title: { default: "Mi Mapa Personal", template: "%s" },
  description:
    "Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos. Explorá tu mapa en Molino.",
  openGraph: {
    title: "Mi Mapa Personal",
    description:
      "Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos.",
    type: "website",
    siteName: "Molino",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Mapa Personal",
    description:
      "Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos.",
  },
};

export default async function ProfileLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
