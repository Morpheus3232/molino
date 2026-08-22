import { createRouteMetadata, siteUrl } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Camino de Vida",
  description:
    "Calculá tu número de Camino de Vida con la fecha de nacimiento. Significado del 1 al 9 y números maestros 11, 22, 33.",
  path: "/herramientas/camino-de-vida",
  ogTitle: "Calculá tu Camino de Vida",
  ogDescription: "Número de Camino de Vida a partir de tu fecha de nacimiento.",
  image: "/opengraph-image",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Camino de Vida",
  description:
    "Calculá tu número de Camino de Vida con la fecha de nacimiento. Significado del 1 al 9 y números maestros 11, 22, 33.",
  url: siteUrl("/herramientas/camino-de-vida"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CaminoDeVidaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}