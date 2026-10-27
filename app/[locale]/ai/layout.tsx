import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Preguntale a tu Molino",
  description: "La capa de diálogo de Molino: una IA que ya conoce tu mapa, tu síntesis y tus tensiones antes de que escribas.",
  noIndex: true,
  noFollow: true,
});

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
