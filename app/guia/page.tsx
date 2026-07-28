import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guía",
  description: "Artículos, tutoriales y guías completas sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.",
};

const articles = [
  { slug: "camino-de-vida-7", title: "Camino de Vida 7", subtitle: "El buscador de la verdad", description: "Todo sobre el número 7: su significado, personalidad, desafíos y caminos de crecimiento.", icon: "7" },
  { slug: "numeros-maestros", title: "Números Maestros", subtitle: "11, 22, 33", description: "Las frecuencias elevadas de la numerología. Qué significan y cómo identificarlos en tu mapa.", icon: "∞" },
  { slug: "compatibilidad-astrologica", title: "Compatibilidad Astrológica", subtitle: "Elementos y modalidades", description: "Cómo se relacionan los signos según sus elementos y modalidades. Fuego, Tierra, Aire y Agua en acción.", icon: "☉" },
];

export default function GuiaPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[900px] px-5 sm:px-8 py-20 sm:py-28" id="main-content">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-6">Guía</p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
          Artículos y guías
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed mb-16">
          Contenido editorial sobre sistemas simbólicos, arquetipos y lectura de patrones.
        </p>

        <div className="space-y-0">
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/guia/${article.slug}`}
              className="group block py-8 border-b border-neutral-200/60 last:border-b-0 hover:border-accent transition-colors"
            >
              <div className="flex items-start gap-6">
                <span className="font-mono text-3xl sm:text-4xl text-accent font-bold mt-1 w-12 shrink-0">
                  {article.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-1">
                    {article.subtitle}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground group-hover:text-accent transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-sm sm:text-base text-muted mt-2 leading-relaxed max-w-lg">
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
