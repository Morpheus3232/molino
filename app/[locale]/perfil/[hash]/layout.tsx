import { initLocale } from "@/lib/i18n/server";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Mi mapa", "My map"],
  description: ["Tu mapa personal de autoconocimiento.", "Your personal self-knowledge map."],
  noIndex: true,
  noFollow: true,
});

export default async function PerfilLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <>{children}</>;
}
