import { initLocale } from "@/lib/i18n/server";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Tu Círculo", "Your Circle"],
  description: ["Las energías que amplifican tu naturaleza y las que la desafían, según tu zodíaco chino.", "The energies that amplify your nature and the ones that challenge it, according to your Chinese zodiac."],
  noIndex: true,
});

export default async function CirculoLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
