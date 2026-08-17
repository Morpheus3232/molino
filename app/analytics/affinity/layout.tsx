import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Analytics de Afinidad",
  description: "Panel interno de eventos de afinidad.",
  path: "/analytics/affinity",
  noIndex: true,
});

export default function AnalyticsAffinityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
