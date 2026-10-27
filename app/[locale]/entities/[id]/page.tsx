import { initLocale } from "@/lib/i18n/server";
import { permanentRedirect, notFound } from "next/navigation";
import { getEntityById } from "@/lib/data/symbolic-entities";

export default async function EntityRedirect({ params }: { params: Promise<{ id: string }> }) {
  await initLocale(params);
  const { id } = await params;
  const entity = getEntityById(id);
  if (!entity) notFound();
  permanentRedirect(`/affinity/${entity.type}/${entity.id}`);
}
