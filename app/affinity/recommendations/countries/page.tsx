import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import RecommendationContent from "@/components/affinity/RecommendationContent";

const catalog: LightweightEntity[] = SYMBOLIC_ENTITIES
  .filter(e => e.type === "country")
  .map(toLightweightEntity);

export const metadata: Metadata = {
  // See REVIEW note in app/layout.tsx — title.template doesn't reach this depth.
  title: "Destinos para priorizar este ciclo | Molino",
  description: "Prioridad del ciclo actual: qué destinos explorar ahora según tu perfil simbólico.",
  alternates: {
    canonical: siteUrl("/affinity/recommendations/countries"),
  },
  openGraph: {
    title: "Destinos para priorizar este ciclo | Molino",
    description: "Prioridad del ciclo actual: qué destinos explorar ahora según tu perfil simbólico.",
    type: "website",
    url: siteUrl("/affinity/recommendations/countries"),
  },
};

export default function CountriesRecommendationPage() {
  return (
    <RecommendationContent
      entityType="country"
      catalog={catalog}
      title="Destinos con mayor presencia en tu mapa"
      subtitle="Qué destinos priorizar en el ciclo actual, según tu perfil simbólico."
    />
  );
}
