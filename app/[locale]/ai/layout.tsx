import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Preguntale a tu Molino", "Ask your Molino"],
  description: ["La capa de diálogo de Molino: una IA que ya conoce tu mapa, tu síntesis y tus tensiones antes de que escribas.", "Molino's dialogue layer: an AI that already knows your map, your synthesis and your tensions before you type."],
  noIndex: true,
  noFollow: true,
});

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
