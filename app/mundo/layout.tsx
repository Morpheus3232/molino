import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tu Mundo",
  description: "Los países, ciudades y marcas que resuenan con tu mapa personal.",
  robots: { index: false },
  openGraph: {
    title: "Tu Mundo | Molino",
    description: "Los países, ciudades y marcas que resuenan con tu mapa personal.",
    type: "website",
    siteName: "Molino",
    url: siteUrl("/mundo"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu Mundo | Molino",
    description: "Los países, ciudades y marcas que resuenan con tu mapa personal.",
  },
};

export default function MundoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
