import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { siteUrl, metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: "Zodiaco Chino",
  description:
    ["Calculá tu animal del zodíaco chino con tu fecha de nacimiento. Conocé los 12 animales, los 5 elementos y las compatibilidades.", "Calculate your Chinese zodiac animal from your date of birth. Get to know the 12 animals, the 5 elements and the compatibilities."],
  path: "/herramientas/zodiaco-chino",
  ogTitle: ["Calculá tu animal del Zodiaco Chino", "Calculate your Chinese Zodiac animal"],
  ogDescription: ["Animal del zodíaco chino a partir de tu fecha de nacimiento.", "Your Chinese zodiac animal from your date of birth."],
  image: "/opengraph-image",
});

const jsonLd = (L: Pick2) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: L("Calculadora de Zodiaco Chino", "Chinese Zodiac Calculator"),
  description:
    L("Calculá tu animal del zodíaco chino con tu fecha de nacimiento. Conocé los 12 animales, los 5 elementos y las compatibilidades.", "Calculate your Chinese zodiac animal from your date of birth. Get to know the 12 animals, the 5 elements and the compatibilities."),
  url: siteUrl("/herramientas/zodiaco-chino"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

export default async function ZodiacoChinoLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      {children}
    </>
  );
}
