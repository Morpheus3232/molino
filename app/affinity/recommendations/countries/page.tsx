import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import RecommendationContent from "@/components/affinity/RecommendationContent";
import { createRouteMetadata } from "@/lib/seo";

const catalog: LightweightEntity[] = SYMBOLIC_ENTITIES
  .filter(e => e.type === "country")
  .map(toLightweightEntity);

export const metadata = createRouteMetadata({
  title: "Destinos para priorizar este ciclo",
  description: "Prioridad del ciclo actual: qué destinos explorar ahora según tu perfil simbólico.",
  path: "/affinity/recommendations/countries",
});

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
