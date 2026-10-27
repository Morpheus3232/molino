import { useL, type Pick2 } from "@/lib/i18n/useL";
import PremiumClient from "./PremiumClient";
import { siteUrl, metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Premium — Tu Síntesis Completa de Autoconocimiento", "Premium — Your Complete Self-Knowledge Synthesis"],
  description:
    ["Conectá los 3 sistemas en una lectura única: numerología, astrología y zodíaco chino. Explorá tus ciclos, rituales y decisiones sin sesgos. $8 USD de acceso permanente.", "Connect the 3 systems in a single reading: numerology, astrology and the Chinese zodiac. Explore your cycles, rituals and decisions without bias. $8 USD for permanent access."],
  path: "/premium",
  ogTitle: ["Molino Premium — Tu Mapa Completo de Arquetipos", "Molino Premium — Your Complete Map of Archetypes"],
  ogDescription: ["Entendé tu mapa completo: arquetipos, ciclos de vida y dinámicas entre tus energías. Herramienta de reflexión honesta, no oráculo.", "Understand your complete map: archetypes, life cycles and the dynamics between your energies. An honest tool for reflection, not an oracle."],
});

const jsonLd = (L: Pick2) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Molino Premium",
  description:
    L("Acceso completo a interpretaciones numerológicas, astrológicas y de zodíaco chino personalizadas, de por vida, con un pago único.", "Full access to personalized numerology, astrology and Chinese zodiac interpretations, for life, with a one-time payment."),
  brand: { "@type": "Brand", name: "Molino" },
  offers: {
    "@type": "Offer",
    price: "8",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: siteUrl("/premium"),
  },
});

export default function PremiumPage() {
  const L = useL();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(L)) }} />
      <PremiumClient />
    </>
  );
}
