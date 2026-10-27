import { initLocale } from "@/lib/i18n/server";
import { redirect } from "@/lib/i18n/navigation";

export default async function ConocimientoPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  redirect({ href: "/explore", locale });
}
