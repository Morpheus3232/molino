import { initLocale, getL } from "@/lib/i18n/server";
import { type Pick2 } from "@/lib/i18n/useL";
import { Link } from "@/lib/i18n/navigation";
import { metadataFor } from "@/lib/seo";
import { PageHero, CONTAINER } from "@/components/knowledge/Kit";

export const generateMetadata = metadataFor({
  title: ["Guía", "Guide"],
  description: ["Artículos, tutoriales y guías completas sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.", "Articles, tutorials and complete guides on numerology, astrology, the Chinese zodiac and symbolic self-knowledge."],
  path: "/guia",
  ogTitle: ["Guía", "Guide"],
  ogDescription: ["Artículos y guías sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.", "Articles and guides on numerology, astrology, the Chinese zodiac and symbolic self-knowledge."],
});

const articles = (L: Pick2) => ([
  { slug: "camino-de-vida-7", title: L("Camino de Vida 7", "Life Path 7"), subtitle: L("El buscador de la verdad", "The seeker of truth"), description: L("Todo sobre el número 7: su significado, personalidad, desafíos y caminos de crecimiento.", "Everything about the number 7: its meaning, personality, challenges and paths of growth."), icon: "7" },
  { slug: "numeros-maestros", title: L("Números Maestros", "Master Numbers"), subtitle: "11, 22, 33", description: L("Las frecuencias elevadas de la numerología. Qué significan y cómo identificarlos en tu mapa.", "The high frequencies of numerology. What they mean and how to spot them in your map."), icon: "∞" },
  { slug: "compatibilidad-astrologica", title: L("Compatibilidad Astrológica", "Astrological Compatibility"), subtitle: L("Elementos y modalidades", "Elements and modalities"), description: L("Cómo se relacionan los signos según sus elementos y modalidades. Fuego, Tierra, Aire y Agua en acción.", "How the signs relate according to their elements and modalities. Fire, Earth, Air and Water in action."), icon: "☉" },
]);

export default async function GuiaPage({ params }: { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  const L = await getL();
  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Guía", "Guide") }]}
        eyebrow={L(`Guía · ${articles(L).length} lecturas largas`, `Guide · ${articles(L).length} long reads`)}
        title={L("Para entrar en profundidad", "To go in depth")}
        lead={L("Guías completas sobre un número, una familia de números o una forma de cruzar signos. Para leer de punta a punta.", "Complete guides on one number, a family of numbers or a way of crossing signs. To read from start to finish.")}
        imageKey="guia/hub"
      />
      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-24`}>
          <ol className="border-t-2 border-ink">
            {articles(L).map((article) => (
              <li key={article.slug} className="border-b border-ink/15">{L(<>
                <Link
                  href={`/guia/${article.slug}`}
                  className="group grid grid-cols-[4.5rem_1fr] sm:grid-cols-[8rem_1fr_auto] gap-x-6 sm:gap-x-10 items-baseline py-10 hover:bg-paper-alt/60 transition-colors"
                >
                  <span className="font-display text-5xl sm:text-7xl leading-none text-foreground text-center" aria-hidden="true">
                    {L.t(article.icon)}
                  </span>
                  <span>
                    <span className="block text-base text-muted">{L.t(article.subtitle)}</span>
                    <span className="mt-1 block font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-foreground group-hover:underline underline-offset-[6px]">
                      {L.t(article.title)}
                    </span>
                    <span className="mt-3 block text-lg text-foreground/80 leading-relaxed max-w-2xl">{L.t(article.description)}</span>
                  </span>
                  <span className="hidden sm:block text-base underline underline-offset-4 pr-2">Leer la guía</span>
                </Link>
              </>, <><Link href={`/guia/${article.slug}`} className="group grid grid-cols-[4.5rem_1fr] sm:grid-cols-[8rem_1fr_auto] gap-x-6 sm:gap-x-10 items-baseline py-10 hover:bg-paper-alt/60 transition-colors"><span className="font-display text-5xl sm:text-7xl leading-none text-foreground text-center" aria-hidden="true">{L.t(article.icon)}</span><span><span className="block text-base text-muted">{L.t(article.subtitle)}</span><span className="mt-1 block font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-foreground group-hover:underline underline-offset-[6px]">{L.t(article.title)}</span><span className="mt-3 block text-lg text-foreground/80 leading-relaxed max-w-2xl">{L.t(article.description)}</span></span><span className="hidden sm:block text-base underline underline-offset-4 pr-2">Read the guide</span></Link></>)}</li>
            ))}
          </ol>
          <p className="mt-10 text-lg text-muted max-w-2xl">{L(<>
            ¿Buscás algo más corto? En el <Link href="/blog" className="underline underline-offset-4 hover:no-underline text-foreground">blog</Link> hay
            artículos de cinco minutos, y en <Link href="/conocimiento" className="underline underline-offset-4 hover:no-underline text-foreground">Conocimiento</Link> la
            ficha de cada número, signo y animal.
          </>, <>Looking for something shorter? The <Link href="/blog" className="underline underline-offset-4 hover:no-underline text-foreground">blog</Link> has five-minute articles, and <Link href="/conocimiento" className="underline underline-offset-4 hover:no-underline text-foreground">Knowledge</Link> has the profile of every number, sign and animal.</>)}</p>
        </div>
      </section>
    </main>
  );
}
