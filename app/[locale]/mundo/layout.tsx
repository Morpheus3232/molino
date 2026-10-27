import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Tu Mundo",
  description: "Los países, ciudades y marcas que resuenan con tu mapa personal.",
  noIndex: true,
});

export default function MundoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
