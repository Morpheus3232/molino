import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Zodiaco Chino",
  description:
    "Calculá tu animal del zodíaco chino con tu fecha de nacimiento. Conocé los 12 animales, los 5 elementos y las compatibilidades.",
  path: "/herramientas/zodiaco-chino",
  ogTitle: "Calculá tu animal del Zodiaco Chino — Molino",
  ogDescription: "Animal del zodíaco chino a partir de tu fecha de nacimiento.",
  image: "/opengraph-image",
});

export default function ZodiacoChinoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
