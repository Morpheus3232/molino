import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { siteUrl, metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Calculadora del Número de Vida (Camino de Vida)", "Life Path Number Calculator"],
  description:
    ["Poné tu fecha de nacimiento y sabé cuál es tu Número de Vida, con la cuenta paso a paso y su significado. Del 1 al 9 y los números maestros 11, 22 y 33.", "Enter your date of birth and find out your Life Path Number, with the step-by-step math and its meaning. From 1 to 9 and the master numbers 11, 22 and 33."],
  path: "/herramientas/camino-de-vida",
  ogTitle: ["Calculá tu Camino de Vida", "Calculate your Life Path"],
  ogDescription: ["Número de Camino de Vida a partir de tu fecha de nacimiento.", "Your Life Path Number from your date of birth."],
  image: "/opengraph-image",
});

const jsonLd = (L: Pick2) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: L("Calculadora de Camino de Vida", "Life Path Calculator"),
  description:
    L("Calculá tu número de Camino de Vida con la fecha de nacimiento. Significado del 1 al 9 y números maestros 11, 22, 33.", "Calculate your Life Path number from your date of birth. Meaning from 1 to 9 and the master numbers 11, 22, 33."),
  url: siteUrl("/herramientas/camino-de-vida"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

export default async function CaminoDeVidaLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      {children}
    </>
  );
}