import { initLocale } from "@/lib/i18n/server";
import { notFound } from "next/navigation";
import { permanentRedirect } from "@/lib/i18n/navigation";
import { getEntityById } from "@/lib/data/symbolic-entities";

/**
 * Fase 3 — `/compatibility/*` se consolidó en `/affinity/*` (misma dirección
 * que `/entities/[id]`). Ver docs/ROUTE_CONSOLIDATION_PLAN.md.
 *
 * Un id que no resuelve a una entidad del Atlas (temas como "sushi" o
 * "basketball" de la versión vieja) responde 404. Antes caía al hub
 * /affinity, que Google trataba como "soft 404" y seguía reportando.
 */
export default async function CompatibilityRedirect({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const locale = await initLocale(params);
  const { entity: id } = await params;
  const entity = getEntityById(id);
  if (!entity) notFound();
  permanentRedirect({ href: `/affinity/${entity.type}/${entity.id}`, locale });
}
