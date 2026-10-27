import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Analytics de Afinidad", "Affinity analytics"],
  description: ["Panel interno de eventos de afinidad.", "Internal panel of affinity events."],
  path: "/analytics/affinity",
  noIndex: true,
});

export default async function AnalyticsAffinityLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
