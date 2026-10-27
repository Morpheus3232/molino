import { initLocale } from "@/lib/i18n/server";
import { redirect } from "next/navigation";

export default async function ConocimientoPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  redirect("/explore");
}
