import Link from "next/link";
import { createRouteMetadata } from "@/lib/seo";
import { PageHero, CONTAINER } from "@/components/knowledge/Kit";

export const metadata = createRouteMetadata({
  title: "Guía",
  description: "Artículos, tutoriales y guías completas sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.",
  path: "/guia",
  ogTitle: "Guía",
  ogDescription: "Artículos y guías sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.",
});

const articles = [
  { slug: "camino-de-vida-7", title: "Camino de Vida 7", subtitle: "El buscador de la verdad", description: "Todo sobre el número 7: su significado, personalidad, desafíos y caminos de crecimiento.", icon: "7" },
  { slug: "numeros-maestros", title: "Números Maestros", subtitle: "11, 22, 33", description: "Las frecuencias elevadas de la numerología. Qué significan y cómo identificarlos en tu mapa.", icon: "∞" },
  { slug: "compatibilidad-astrologica", title: "Compatibilidad Astrológica", subtitle: "Elementos y modalidades", description: "Cómo se relacionan los signos según sus elementos y modalidades. Fuego, Tierra, Aire y Agua en acción.", icon: "☉" },
];

export default function GuiaPage() {
  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Guía" }]}
        eyebrow={`Guía · ${articles.length} lecturas largas`}
        title="Para entrar en profundidad"
        lead="Guías completas sobre un número, una familia de números o una forma de cruzar signos. Para leer de punta a punta."
        imageKey="guia/hub"
      />
      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-24`}>
          <ol className="border-t-2 border-ink">
            {articles.map((article) => (
              <li key={article.slug} className="border-b border-ink/15">
                <Link
                  href={`/guia/${article.slug}`}
                  className="group grid grid-cols-[4.5rem_1fr] sm:grid-cols-[8rem_1fr_auto] gap-x-6 sm:gap-x-10 items-baseline py-10 hover:bg-paper-alt/60 transition-colors"
                >
                  <span className="font-display text-5xl sm:text-7xl leading-none text-foreground text-center" aria-hidden="true">
                    {article.icon}
                  </span>
                  <span>
                    <span className="block text-base text-muted">{article.subtitle}</span>
                    <span className="mt-1 block font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-foreground group-hover:underline underline-offset-[6px]">
                      {article.title}
                    </span>
                    <span className="mt-3 block text-lg text-foreground/80 leading-relaxed max-w-2xl">{article.description}</span>
                  </span>
                  <span className="hidden sm:block text-base underline underline-offset-4 pr-2">Leer la guía</span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-lg text-muted max-w-2xl">
            ¿Buscás algo más corto? En el <Link href="/blog" className="underline underline-offset-4 hover:no-underline text-foreground">blog</Link> hay
            artículos de cinco minutos, y en <Link href="/conocimiento" className="underline underline-offset-4 hover:no-underline text-foreground">Conocimiento</Link> la
            ficha de cada número, signo y animal.
          </p>
        </div>
      </section>
    </main>
  );
}
