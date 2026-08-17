import { createRouteMetadata, siteUrl } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Compatibilidad zodiacal",
  description:
    "Calculá la compatibilidad entre dos personas según su numerología y zodíaco chino. Sin registro, gratis y auditable.",
  path: "/herramientas/compatibilidad",
  ogTitle: "Compatibilidad — Molino",
  ogDescription: "Calculá la compatibilidad entre dos personas según numerología y zodiaco chino.",
  image: "/opengraph-image",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Molino — Calculadora de Compatibilidad",
  description:
    "Calculá la compatibilidad entre dos personas según su numerología y zodíaco chino. Sin registro, gratis y auditable.",
  url: siteUrl("/herramientas/compatibilidad"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CompatibilidadLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
