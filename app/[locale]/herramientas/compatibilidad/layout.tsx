import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { siteUrl, metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Compatibilidad zodiacal", "Zodiac compatibility"],
  description:
    ["Calculá la compatibilidad entre dos personas según su numerología y zodíaco chino. Sin registro, gratis y auditable.", "Calculate the compatibility between two people according to their numerology and Chinese zodiac. No sign-up, free and auditable."],
  path: "/herramientas/compatibilidad",
  ogTitle: ["Compatibilidad", "Compatibility"],
  ogDescription: ["Calculá la compatibilidad entre dos personas según numerología y zodiaco chino.", "Calculate the compatibility between two people according to numerology and the Chinese zodiac."],
  image: "/opengraph-image",
});

const jsonLd = (L: Pick2) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: L("Calculadora de Compatibilidad", "Compatibility Calculator"),
  description:
    L("Calculá la compatibilidad entre dos personas según su numerología y zodíaco chino. Sin registro, gratis y auditable.", "Calculate the compatibility between two people according to their numerology and Chinese zodiac. No sign-up, free and auditable."),
  url: siteUrl("/herramientas/compatibilidad"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

export default async function CompatibilidadLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      {children}
    </>
  );
}
