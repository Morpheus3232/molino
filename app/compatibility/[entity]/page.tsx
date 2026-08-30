import { permanentRedirect } from "next/navigation";
import { getEntityById } from "@/lib/data/symbolic-entities";

/**
 * Sin esto, Next prerenderiza la ruta y hornea el redirect como un
 * `<meta http-equiv="refresh">` dentro de un HTTP 200 — un redirect "blando",
 * que Google consolida más lento y con menos transferencia de autoridad que un
 * 301/308 real. Verificado en el preview de Fase 4: `/compatibility/argentina`
 * devolvía 200 + meta refresh. Renderizando por request sale el 308 de verdad.
 * El costo es una invocación por visita, aceptable en una familia de URLs
 * legacy cuyo tráfico solo baja.
 */
export const dynamic = "force-dynamic";

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
