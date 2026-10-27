import { createRouteMetadata, siteUrl } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Zodiaco Chino",
  description:
    "Calculá tu animal del zodíaco chino con tu fecha de nacimiento. Conocé los 12 animales, los 5 elementos y las compatibilidades.",
  path: "/herramientas/zodiaco-chino",
  ogTitle: "Calculá tu animal del Zodiaco Chino",
  ogDescription: "Animal del zodíaco chino a partir de tu fecha de nacimiento.",
  image: "/opengraph-image",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Zodiaco Chino",
  description:
    "Calculá tu animal del zodíaco chino con tu fecha de nacimiento. Conocé los 12 animales, los 5 elementos y las compatibilidades.",
  url: siteUrl("/herramientas/zodiaco-chino"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function ZodiacoChinoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
