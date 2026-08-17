import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "AI",
  description: "Síntesis e interpretaciones asistidas por IA de tu mapa.",
  noIndex: true,
  noFollow: true,
});

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
