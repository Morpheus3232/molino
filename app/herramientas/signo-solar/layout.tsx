import { createRouteMetadata, siteUrl } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Signo Solar",
  description:
    "Calculá tu signo solar con tu fecha de nacimiento. Conocé los 12 signos del zodíaco occidental, sus elementos y modalidades.",
  path: "/herramientas/signo-solar",
  ogTitle: "Calculá tu Signo Solar — Molino",
  ogDescription: "Signo zodiacal occidental a partir de tu fecha de nacimiento.",
  image: "/opengraph-image",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Molino — Calculadora de Signo Solar",
  description:
    "Calculá tu signo solar con tu fecha de nacimiento. Conocé los 12 signos del zodíaco occidental, sus elementos y modalidades.",
  url: siteUrl("/herramientas/signo-solar"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function SignoSolarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}