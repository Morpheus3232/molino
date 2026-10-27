import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { siteUrl, metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Signo Solar", "Sun Sign"],
  description:
    ["Calculá tu signo solar con tu fecha de nacimiento. Conocé los 12 signos del zodíaco occidental, sus elementos y modalidades.", "Calculate your sun sign from your date of birth. Get to know the 12 signs of the Western zodiac, their elements and modalities."],
  path: "/herramientas/signo-solar",
  ogTitle: ["Calculá tu Signo Solar", "Calculate your Sun Sign"],
  ogDescription: ["Signo zodiacal occidental a partir de tu fecha de nacimiento.", "Your Western zodiac sign from your date of birth."],
  image: "/opengraph-image",
});

const jsonLd = (L: Pick2) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: L("Calculadora de Signo Solar", "Sun Sign Calculator"),
  description:
    L("Calculá tu signo solar con tu fecha de nacimiento. Conocé los 12 signos del zodíaco occidental, sus elementos y modalidades.", "Calculate your sun sign from your date of birth. Get to know the 12 signs of the Western zodiac, their elements and modalities."),
  url: siteUrl("/herramientas/signo-solar"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

export default async function SignoSolarLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      {children}
    </>
  );
}