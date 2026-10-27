import { initLocale } from "@/lib/i18n/server";
import { permanentRedirect } from "@/lib/i18n/navigation";

export default async function ZodiacoChinoPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initLocale(params);
  permanentRedirect({ href: "/conocimiento/zodiaco-chino", locale });
}
