import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import RecommendationContent from "@/components/affinity/RecommendationContent";

export const metadata: Metadata = {
  title: "Marcas para priorizar este ciclo | Molino",
  description: "Prioridad del ciclo actual: qué marcas explorar ahora según tu perfil simbólico.",
  alternates: {
    canonical: siteUrl("/affinity/recommendations/brands"),
  },
  openGraph: {
    title: "Marcas para priorizar este ciclo | Molino",
    description: "Prioridad del ciclo actual: qué marcas explorar ahora según tu perfil simbólico.",
    type: "website",
    url: siteUrl("/affinity/recommendations/brands"),
  },
};

export default function BrandsRecommendationPage() {
  return (
    <RecommendationContent
      entityType="brand"
      title="Marcas alineadas contigo"
      subtitle="Qué marcas priorizar en el ciclo actual, según tu perfil simbólico."
    />
  );
}
