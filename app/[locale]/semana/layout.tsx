import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Tu semana",
  description: "Vibración numerológica de los próximos días para viajes y negocios — requiere tu mapa.",
  path: "/semana",
  noIndex: true,
});

export default async function SemanaLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
