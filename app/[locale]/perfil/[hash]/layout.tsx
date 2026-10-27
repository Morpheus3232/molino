import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Mi mapa", "My map"],
  description: ["Tu mapa personal de autoconocimiento.", "Your personal self-knowledge map."],
  noIndex: true,
  noFollow: true,
});

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
