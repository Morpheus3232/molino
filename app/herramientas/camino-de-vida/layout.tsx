import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Camino de Vida",
  description:
    "Calculá tu número de Camino de Vida con la fecha de nacimiento. Significado del 1 al 9 y números maestros 11, 22, 33.",
  path: "/herramientas/camino-de-vida",
  ogTitle: "Calculá tu Camino de Vida — Molino",
  ogDescription: "Número de Camino de Vida a partir de tu fecha de nacimiento.",
  image: "/opengraph-image",
});

export default function CaminoDeVidaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}