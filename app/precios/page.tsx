import Link from "next/link";
import { siteUrl, createRouteMetadata } from "@/lib/seo";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import { PLANS, PRICING_FAQS } from "@/components/pricing/pricing-data";

export const metadata = createRouteMetadata({
  title: "Precios — Gratis y Premium",
  description:
    "Tu mapa básico es gratuito siempre. Premium suma síntesis estructurada, análisis de dinámicas, ciclos personales e informe con narrativa de IA por $8 USD, pago único. Sin registro, sin permanencia.",
  path: "/precios",
  ogTitle: "Precios — Molino",
  ogDescription: "Tu mapa básico es gratuito. Premium: síntesis estructurada de arquetipos, ciclos y dinámicas por $8 USD, pago único. Herramientas de reflexión, no oráculos.",
  image: "/opengraph-image",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRICING_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Molino Premium",
  description:
    "Mapa personal completo con síntesis cruzada, narrativa de IA, ciclos personales 2026–2030 y chat interactivo.",
  brand: { "@type": "Organization", name: "Molino" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: 0,
    highPrice: 8,
    offerCount: 2,
    offers: [
      { "@type": "Offer", name: "Gratis", price: 0, priceCurrency: "USD", url: siteUrl("/precios") },
      { "@type": "Offer", name: "Premium", price: 8, priceCurrency: "USD", url: siteUrl("/premium") },
    ],
  },
};

export default function PreciosPage() {
  const gratis = PLANS.find((p) => p.id === "gratis");

  return (
    <main id="main-content" className="bg-background pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-ink/10 py-16 sm:py-24 text-center px-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-5">
          Planes simples · Sin permanencia · Sin registro
        </p>
        <h1 className="mx-auto max-w-3xl font-display text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-tight text-foreground leading-[1.05]">
          Tu mapa básico es gratuito.
          <br className="hidden sm:block" />
          <span className="text-accent">La claridad profunda tiene un valor.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted/70 leading-relaxed">
          Empezá gratis y subí de plan cuando quieras. El mapa esencial es y será tuyo sin pagar nada.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={gratis?.cta.href ?? "/onboarding"}
            className="inline-flex items-center justify-center rounded-md bg-gold px-8 py-3.5 text-sm font-heading font-semibold uppercase tracking-[0.1em] text-gold-foreground transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Empezar gratis →
          </Link>
          <Link
            href="/premium"
            className="inline-flex items-center justify-center rounded-md border border-accent/40 bg-accent/10 px-8 py-3.5 text-sm font-heading font-semibold uppercase tracking-[0.1em] text-accent transition-colors hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Ver Detalle Premium ($8 USD)
          </Link>
        </div>
      </section>

      <PricingFAQ
        items={PRICING_FAQS.filter((f) => !/pro|familiar|descuento anual/i.test(f.question))}
      />

      {/* Final CTA */}
      <section className="bg-accent/[0.05] border-t border-ink/10 py-16 sm:py-24 text-center px-4">
        <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] tracking-tight text-foreground leading-[1.05] mb-3">
          Tu claridad está a un clic.
        </h2>
        <p className="mx-auto max-w-md text-base text-muted/70 leading-relaxed mb-8">
          Generá tu mapa personal gratis hoy. Sin registro, sin tarjeta, sin compromiso.
        </p>
        <Link
          href={gratis?.cta.href ?? "/onboarding"}
          className="inline-flex items-center justify-center rounded-md bg-gold px-10 py-4 text-base font-heading font-semibold uppercase tracking-[0.1em] text-gold-foreground transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Empezar gratis →
        </Link>
      </section>
    </main>
  );
}
