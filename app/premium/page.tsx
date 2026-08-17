import PremiumClient from "./PremiumClient";
import { createRouteMetadata, siteUrl } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Premium — Tu Síntesis Completa de Autoconocimiento",
  description:
    "Conectá los 3 sistemas en una lectura única: numerología, astrología y zodíaco chino. Explorá tus ciclos, rituales y decisiones sin sesgos. $8 USD de acceso permanente.",
  path: "/premium",
  ogTitle: "Molino Premium — Síntesis Rigurosa de Arquetipos",
  ogDescription: "Entendé tu mapa completo: arquetipos, ciclos de vida y dinámicas ocultas. Herramienta de reflexión honesta, no oráculo.",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Molino Premium",
  description:
    "Acceso completo a interpretaciones numerológicas, astrológicas y de zodíaco chino personalizadas, de por vida, con un pago único.",
  brand: { "@type": "Brand", name: "Molino" },
  offers: {
    "@type": "Offer",
    price: "8",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: siteUrl("/premium"),
  },
};

export default function PremiumPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PremiumClient />
    </>
  );
}
