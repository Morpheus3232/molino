import { permanentRedirect, notFound } from "next/navigation";
import { getEntityById } from "@/lib/data/symbolic-entities";

/** Mismo motivo que en /compatibility/[entity]: prerenderizado, este redirect
 *  salía como meta-refresh dentro de un 200 en vez de un 308 real. */
export const dynamic = "force-dynamic";

export default async function EntityRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entity = getEntityById(id);
  if (!entity) notFound();
  permanentRedirect(`/affinity/${entity.type}/${entity.id}`);
}
