import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import InsightsContent from "./InsightsContent";
import { createRouteMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createRouteMetadata({
  title: "Mis patrones",
  description: "Tu exploración personal de patrones simbólicos. Conexiones, recomendaciones y descubrimientos según el zodíaco chino.",
  path: "/profile/insights",
  ogTitle: "Mis patrones",
  ogDescription: "Exploración personal basada en tradiciones culturales del zodíaco chino.",
});

export default function InsightsPage() {
  const catalog: LightweightEntity[] = SYMBOLIC_ENTITIES.map(toLightweightEntity);
  return <InsightsContent catalog={catalog} />;
}
