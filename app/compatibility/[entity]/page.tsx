import { permanentRedirect } from "next/navigation";
import { getEntityById } from "@/lib/data/symbolic-entities";

/**
 * Fase 3 — `/compatibility/*` se consolidó en `/affinity/*` (misma dirección
 * que `/entities/[id]`). Ver docs/ROUTE_CONSOLIDATION_PLAN.md.
 *
 * Un id que no resuelve a una entidad simbólica (raro: la familia
 * `/compatibility` usaba `lib/data/entities`, no `symbolic-entities`) cae al
 * hub `/affinity` en vez de 404 — no perdemos al visitante por un mismatch
 * de catálogo.
 */
export default async function CompatibilityRedirect({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity: id } = await params;
  const entity = getEntityById(id);
  permanentRedirect(entity ? `/affinity/${entity.type}/${entity.id}` : "/affinity");
}
