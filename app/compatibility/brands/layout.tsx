import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Compatibilidad con marcas",
  description:
    "Descubrí la compatibilidad entre tu energía y la de las marcas más importantes del mundo, usando numerología y zodíaco chino.",
  path: "/compatibility/brands",
  ogTitle: "Compatibilidad con marcas — Molino",
  ogDescription: "Compatibilidad entre tu energía y la de las marcas del mundo.",
  image: "/opengraph-image",
});

export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
