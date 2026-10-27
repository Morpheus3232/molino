import { initLocale } from "@/lib/i18n/server";
import { permanentRedirect } from "next/navigation";

export default async function AstrologiaPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  permanentRedirect("/conocimiento/astrologia");
}
