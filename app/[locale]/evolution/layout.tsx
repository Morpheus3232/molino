import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Mi Evolución", "My Evolution"],
  noIndex: true,
});

export default function EvolutionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
