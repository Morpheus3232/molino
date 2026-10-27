import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Tu semana", "Your week"],
  description: ["Vibración numerológica de los próximos días para viajes y negocios — requiere tu mapa.", "Numerological vibration of the coming days for travel and business — requires your map."],
  path: "/semana",
  noIndex: true,
});

export default async function SemanaLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
