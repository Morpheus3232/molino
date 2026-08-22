import Link from "next/link";
import { ShieldCheck, Sparkles, Palette, Globe, Gift, ArrowRight } from "lucide-react";
import { SITE_URL, siteUrl, createRouteMetadata } from "@/lib/seo";
import Card from "@/components/ui/Card";
import CopyEmbedCode from "./CopyEmbedCode";

export const metadata = createRouteMetadata({
  title: "Widget de Numerología Gratis para Coaches",
  description:
    "Sumá una calculadora de Camino de Vida gratis a tu web o blog de bienestar. Sin registro, sin tracking, instalación en 2 minutos. Ideal para coaches.",
  path: "/widget",
});

const BENEFITS = [
  {
    icon: Gift,
    title: "Agregá valor a tus visitantes",
    desc: "Una herramienta interactiva real, no un banner — tus visitantes calculan su Camino de Vida sin salir de tu sitio.",
  },
  {
    icon: ShieldCheck,
    title: "Sin registro ni tracking",
    desc: "El cálculo corre en el navegador de tu visitante. No pedimos email, no ponemos cookies, no armamos perfiles.",
  },
  {
    icon: Sparkles,
    title: "Gratis, sin letra chica",
    desc: "No hay plan pago del widget ni límite de usos. Solo pedimos que mantengas la atribución a Molino.app en el pie.",
  },
];

const FAQ = [
  {
    q: "¿Puedo personalizar los colores?",
    a: "El widget acepta dos parámetros en la URL: theme=light (fondo claro; el default es oscuro) y compact=true (versión reducida). No hay theming de colores custom más allá de eso por ahora — el widget está pensado para insertarse tal cual dentro de un iframe, que ya aísla su estilo del resto de tu página.",
  },
  {
    q: "¿Funciona en WordPress, Webflow o HTML plano?",
    a: "Sí. Es un iframe estándar: en WordPress se pega en un bloque de HTML personalizado, en Webflow en un elemento Embed, y en HTML plano va directo en el body. No depende de ningún framework de tu sitio.",
  },
  {
    q: "¿Es realmente gratuito?",
    a: "Sí, sin costo y sin límite de instalaciones. Lo único que pedimos es no quitar el enlace a molino.app del pie del widget — es lo que mantiene la herramienta gratis para todos.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Widget de Numerología Molino",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web Browser",
    description: "Widget embebible gratuito de calculadora de Camino de Vida para sitios de coaches y bienestar.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: siteUrl("/widget"),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Widget" },
    ],
  },
];

export default function WidgetPage() {
  return (
    <main id="main-content" className="bg-background pt-20 sm:pt-24 pb-24 text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold">
              Widget gratuito para coaches y sitios de bienestar
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-foreground">
            Widget Gratuito de Numerología para tu Sitio Web
          </h1>
          <p className="text-base sm:text-lg text-muted mt-5 max-w-2xl mx-auto leading-relaxed">
            Insertá la calculadora de Camino de Vida de Molino en tu web, blog o página de coaching en menos de 2 minutos. Sin costo, sin registro de tus visitantes.
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.title} padding="lg" className="h-full border-ink/10 bg-card">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">{b.desc}</p>
              </Card>
            );
          })}
        </div>

        {/* Demo en vivo */}
        <div className="mb-16">
          <div className="mb-6 text-center">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">Demo en vivo</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Así se ve instalado
            </h2>
          </div>
          <div className="flex justify-center">
            <iframe
              src="https://www.molino.app/embed"
              width="100%"
              height="440"
              style={{ border: "none", borderRadius: 20, overflow: "hidden", maxWidth: 420 }}
              title="Calculadora de Mapa Personal (demo)"
              loading="lazy"
            />
          </div>
        </div>

        {/* Instalación */}
        <div className="mb-16">
          <div className="mb-6">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">Instalación</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
              3 pasos, 2 minutos
            </h2>
          </div>
          <ol className="space-y-4 text-sm text-muted leading-relaxed mb-6">
            <li className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-accent shrink-0 mt-0.5">1.</span>
              <span>Copiá el código del bloque de abajo.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-accent shrink-0 mt-0.5">2.</span>
              <span>
                Pegalo donde quieras que aparezca: en WordPress, un bloque &ldquo;HTML personalizado&rdquo;; en Webflow, un elemento &ldquo;Embed&rdquo;; en HTML plano, directo en el <code className="font-mono text-xs">&lt;body&gt;</code>.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-accent shrink-0 mt-0.5">3.</span>
              <span>
                Listo. Opcional: agregá <code className="font-mono text-xs">?theme=light</code> o <code className="font-mono text-xs">?compact=true</code> a la URL del <code className="font-mono text-xs">src</code> para personalizar tema y tamaño.
              </span>
            </li>
          </ol>
          <CopyEmbedCode />
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <div className="mb-8">
            <span className="font-mono text-xs text-accent font-bold uppercase tracking-wider">Preguntas frecuentes</span>
          </div>
          <div className="space-y-px bg-ink/10 rounded-2xl overflow-hidden">
            {FAQ.map((item) => (
              <div key={item.q} className="p-6 sm:p-8 bg-background">
                <h3 className="font-heading text-base text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="p-8 sm:p-12 rounded-3xl bg-accent/5 border border-accent/20 text-center">
          <p className="font-heading text-xl sm:text-2xl text-foreground mb-6">
            Instalá el widget en 2 minutos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#top"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-gold-foreground font-heading text-xs uppercase tracking-wider font-bold hover:bg-gold-hover transition-colors shadow-sm"
            >
              Copiar código del widget
            </a>
            <Link
              href="/profesionales"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent font-medium hover:text-accent/80 transition-colors"
            >
              Ver Molino para profesionales <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
