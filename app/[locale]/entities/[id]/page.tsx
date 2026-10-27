import { initLocale } from "@/lib/i18n/server";
import { notFound } from "next/navigation";
import { permanentRedirect } from "@/lib/i18n/navigation";
import { getEntityById } from "@/lib/data/symbolic-entities";

export default async function EntityRedirect({ params }: { params: Promise<{ id: string }> }) {
  const locale = await initLocale(params);
  const { id } = await params;
  const entity = getEntityById(id);
  if (!entity) notFound();
  permanentRedirect({ href: `/affinity/${entity.type}/${entity.id}`, locale });
}
