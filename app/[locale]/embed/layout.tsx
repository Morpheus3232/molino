import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Widget embebible",
  description: "Widget de Molino para insertar en otros sitios.",
  path: "/embed",
  noIndex: true,
});

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
