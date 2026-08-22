import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Explorá el conocimiento",
  description:
    "Explorá numerología, astrología, zodiaco chino y compatibilidad. Todo el conocimiento de Molino, con sus fuentes y metodología, abierto y auditable.",
  path: "/explore",
  ogTitle: "Explorá el conocimiento",
  ogDescription: "Numerología, astrología, zodiaco chino y compatibilidad. Conocimiento abierto y auditable.",
  image: "/opengraph-image",
});

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
