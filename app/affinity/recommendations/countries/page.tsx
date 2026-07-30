import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import RecommendationContent from "@/components/affinity/RecommendationContent";

export const metadata: Metadata = {
  title: "Destinos compatibles | Afinidad Personal — Molino",
  description: "Descubrí qué destinos resuenan con tu perfil simbólico según el zodíaco chino.",
  alternates: {
    canonical: siteUrl("/affinity/recommendations/countries"),
  },
  openGraph: {
    title: "Destinos compatibles contigo | Molino",
    description: "Recomendaciones simbólicas de destinos según el zodíaco chino.",
    type: "website",
    url: siteUrl("/affinity/recommendations/countries"),
  },
};

export default function CountriesRecommendationPage() {
  return (
    <RecommendationContent
      entityType="country"
      title="Destinos con resonancia"
      subtitle="Países y ciudades que pueden resonar con tu perfil simbólico según el zodíaco chino."
    />
  );
}
