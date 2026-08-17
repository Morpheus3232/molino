import type { Metadata } from "next";

export const metadata: Metadata = {
  // { default, template } — ver nota en app/herramientas/layout.tsx.
  title: { default: "Mi Mapa Personal", template: "%s | Molino" },
  description:
    "Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos. Explorá tu mapa en Molino.",
  openGraph: {
    title: "Mi Mapa Personal | Molino",
    description:
      "Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos.",
    type: "website",
    siteName: "Molino",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Mapa Personal | Molino",
    description:
      "Tu mapa personal de autoconocimiento: identidad, conexiones y patrones simbólicos.",
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
