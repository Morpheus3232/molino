import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "For you",
  description: "Contenido personalizado para tu mapa.",
  noIndex: true,
  noFollow: true,
});

export default function ForYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
