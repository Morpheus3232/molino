import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import RecommendationContent from "@/components/affinity/RecommendationContent";
import { createRouteMetadata } from "@/lib/seo";

const catalog: LightweightEntity[] = SYMBOLIC_ENTITIES
  .filter(e => e.type === "brand")
  .map(toLightweightEntity);

export const metadata = createRouteMetadata({
  title: "Marcas para priorizar este ciclo",
  description: "Prioridad del ciclo actual: qué marcas explorar ahora según tu perfil simbólico.",
  path: "/affinity/recommendations/brands",
  // Sin perfil no hay nada que mostrar (pide crear el mapa): fuera del índice,
  // pero los enlaces se siguen. Las listas por categoría sí se indexan.
  noIndex: true,
});

export default function BrandsRecommendationPage() {
  return (
    <RecommendationContent
      entityType="brand"
      catalog={catalog}
      title="Marcas alineadas contigo"
      subtitle="Qué marcas priorizar en el ciclo actual, según tu perfil simbólico."
    />
  );
}
