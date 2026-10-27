import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Widget embebible",
  description: "Widget de Molino para insertar en otros sitios.",
  path: "/embed",
  noIndex: true,
});

export default async function EmbedLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
