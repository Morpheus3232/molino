import { useL } from "@/lib/i18n/useL";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import RecommendationContent from "@/components/affinity/RecommendationContent";
import { metadataFor } from "@/lib/seo";

const catalog: LightweightEntity[] = SYMBOLIC_ENTITIES
  .filter(e => e.type === "country")
  .map(toLightweightEntity);

export const generateMetadata = metadataFor({
  title: ["Destinos para priorizar este ciclo", "Destinations to prioritize this cycle"],
  description: ["Prioridad del ciclo actual: qué destinos explorar ahora según tu perfil simbólico.", "Priority for the current cycle: which destinations to explore now according to your symbolic profile."],
  path: "/affinity/recommendations/countries",
  // Sin perfil no hay nada que mostrar (pide crear el mapa): fuera del índice,
  // pero los enlaces se siguen. Las listas por categoría sí se indexan.
  noIndex: true,
});

export default function CountriesRecommendationPage() {
  const L = useL();
  return (
    <RecommendationContent
      entityType="country"
      catalog={catalog}
      title={L("Destinos con mayor presencia en tu mapa", "Destinations with the strongest presence in your map")}
      subtitle={L("Qué destinos priorizar en el ciclo actual, según tu perfil simbólico.", "Which destinations to prioritize in the current cycle, according to your symbolic profile.")}
    />
  );
}
