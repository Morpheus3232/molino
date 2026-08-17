import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Signo Solar",
  description:
    "Calculá tu signo solar con tu fecha de nacimiento. Conocé los 12 signos del zodíaco occidental, sus elementos y modalidades.",
  path: "/herramientas/signo-solar",
  ogTitle: "Calculá tu Signo Solar — Molino",
  ogDescription: "Signo zodiacal occidental a partir de tu fecha de nacimiento.",
  image: "/opengraph-image",
});

export default function SignoSolarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}