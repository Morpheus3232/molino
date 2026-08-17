import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Compatibilidad con países",
  description:
    "Descubrí la compatibilidad entre tu energía y la de los países del mundo, usando numerología y zodíaco chino.",
  path: "/compatibility/countries",
  ogTitle: "Compatibilidad con países — Molino",
  ogDescription: "Compatibilidad entre tu energía y la de los países del mundo.",
  image: "/opengraph-image",
});

export default function CountriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
