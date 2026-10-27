import { initLocale } from "@/lib/i18n/server";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Mi Evolución", "My Evolution"],
  noIndex: true,
});

export default async function EvolutionLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
