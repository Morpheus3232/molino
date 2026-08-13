import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import BlogContent from "./BlogContent";

export const metadata: Metadata = {
  title: "Blog de Autoconocimiento",
  description:
    "Artículos sobre numerología, astrología y zodíaco chino para entender tu mapa personal de autoconocimiento: tu Número de Vida, tu animal y tu signo astral.",
  alternates: {
    canonical: siteUrl("/blog"),
  },
  openGraph: {
    title: "Blog — Molino",
    description:
      "Numerología, astrología y zodíaco chino explicados con claridad. Aprendé a leer tu mapa personal de autoconocimiento.",
    type: "website",
    url: siteUrl("/blog"),
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
