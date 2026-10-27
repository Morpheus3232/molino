import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Tu Círculo", "Your Circle"],
  description: ["Las energías que amplifican tu naturaleza y las que la desafían, según tu zodíaco chino.", "The energies that amplify your nature and the ones that challenge it, according to your Chinese zodiac."],
  noIndex: true,
});

export default function CirculoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
