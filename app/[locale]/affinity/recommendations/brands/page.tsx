import { initLocale, getL } from "@/lib/i18n/server";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import RecommendationContent from "@/components/affinity/RecommendationContent";
import { metadataFor } from "@/lib/seo";

const catalog: LightweightEntity[] = SYMBOLIC_ENTITIES
  .filter(e => e.type === "brand")
  .map(toLightweightEntity);

export const generateMetadata = metadataFor({
  title: ["Marcas para priorizar este ciclo", "Brands to prioritize this cycle"],
  description: ["Prioridad del ciclo actual: qué marcas explorar ahora según tu perfil simbólico.", "Priority for the current cycle: which brands to explore now according to your symbolic profile."],
  path: "/affinity/recommendations/brands",
  // Sin perfil no hay nada que mostrar (pide crear el mapa): fuera del índice,
  // pero los enlaces se siguen. Las listas por categoría sí se indexan.
  noIndex: true,
});

export default async function BrandsRecommendationPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <RecommendationContent
      entityType="brand"
      catalog={catalog}
      title={L("Marcas alineadas contigo", "Brands aligned with you")}
      subtitle={L("Qué marcas priorizar en el ciclo actual, según tu perfil simbólico.", "Which brands to prioritize in the current cycle, according to your symbolic profile.")}
    />
  );
}
