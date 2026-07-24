import type { Metadata } from "next";
import RecommendationContent from "@/components/affinity/RecommendationContent";

export const metadata: Metadata = {
  title: "Marcas alineadas | Afinidad Personal — Molino",
  description: "Descubrí qué marcas resuenan con tu perfil simbólico según el zodíaco chino.",
  openGraph: {
    title: "Marcas alineadas contigo | Molino",
    description: "Recomendaciones simbólicas de marcas según el zodíaco chino.",
    type: "website",
  },
};

export default function BrandsRecommendationPage() {
  return (
    <RecommendationContent
      entityType="brand"
      title="Marcas alineadas contigo"
      subtitle="Marcas que resuenan con tu perfil simbólico según el zodíaco chino."
    />
  );
}
