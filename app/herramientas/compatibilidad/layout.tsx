import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Compatibilidad zodiacal",
  description:
    "Calculá la compatibilidad entre dos personas según su numerología y zodíaco chino. Sin registro, gratis y auditable.",
  path: "/herramientas/compatibilidad",
  ogTitle: "Compatibilidad — Molino",
  ogDescription: "Calculá la compatibilidad entre dos personas según numerología y zodiaco chino.",
  image: "/opengraph-image",
});

export default function CompatibilidadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
