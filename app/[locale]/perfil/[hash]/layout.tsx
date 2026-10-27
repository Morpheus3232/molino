import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Mi mapa",
  description: "Tu mapa personal de autoconocimiento.",
  noIndex: true,
  noFollow: true,
});

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
