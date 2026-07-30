import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guía",
  description: "Artículos, tutoriales y guías completas sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.",
  alternates: {
    canonical: siteUrl("/guia"),
  },
  openGraph: {
    title: "Guía — Molino",
    description: "Artículos y guías sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.",
    type: "website",
    url: siteUrl("/guia"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Guía — Molino",
    description: "Artículos y guías sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.",
  },
};

const articles = [
  { slug: "camino-de-vida-7", title: "Camino de Vida 7", subtitle: "El buscador de la verdad", description: "Todo sobre el número 7: su significado, personalidad, desafíos y caminos de crecimiento.", icon: "7" },
  { slug: "numeros-maestros", title: "Números Maestros", subtitle: "11, 22, 33", description: "Las frecuencias elevadas de la numerología. Qué significan y cómo identificarlos en tu mapa.", icon: "∞" },
  { slug: "compatibilidad-astrologica", title: "Compatibilidad Astrológica", subtitle: "Elementos y modalidades", description: "Cómo se relacionan los signos según sus elementos y modalidades. Fuego, Tierra, Aire y Agua en acción.", icon: "☉" },
];

export default function GuiaPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-28" id="main-content">
        <div className="border-t border-ink/10 py-10 sm:py-16">
          <p className="eyebrow-brutalist mb-6">Guía</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            Artículos y guías
          </h1>
          <p className="text-sm text-muted mt-4 max-w-xl">
            Contenido editorial sobre sistemas simbólicos, arquetipos y lectura de patrones.
          </p>
        </div>

        <div className="space-y-0 border-t border-ink/10">
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/guia/${article.slug}`}
              className="group block py-8 border-b border-ink/10 last:border-b-0 hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-start gap-6">
                <span className="font-mono text-3xl sm:text-4xl text-accent font-bold mt-1 w-12 shrink-0">
                  {article.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="label-micro mb-2">
                    {article.subtitle}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl text-foreground group-hover:text-accent transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted mt-2 leading-relaxed max-w-lg">
                    {article.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Leer artículo →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
