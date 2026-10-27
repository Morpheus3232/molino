import { initLocale } from "@/lib/i18n/server";
import { permanentRedirect } from "next/navigation";

export default async function ZodiacoChinoPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  permanentRedirect("/conocimiento/zodiaco-chino");
}
