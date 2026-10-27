import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Widget embebible", "Embeddable widget"],
  description: ["Widget de Molino para insertar en otros sitios.", "Molino widget to embed in other sites."],
  path: "/embed",
  noIndex: true,
});

export default async function EmbedLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
