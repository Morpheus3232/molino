import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Analytics de Afinidad",
  description: "Panel interno de eventos de afinidad.",
  path: "/analytics/affinity",
  noIndex: true,
});

export default async function AnalyticsAffinityLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
