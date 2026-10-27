"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useMemo, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import Image from "next/image";
import { BLOG_POSTS, BLOG_CATEGORIES, getReadingTime, type BlogCategory, type BlogPost } from "@/lib/data/blog-content";
import { Breadcrumb, CONTAINER, Closing } from "@/components/knowledge/Kit";

/**
 * Portada del blog en el lenguaje de Mi Mapa: el artículo más reciente en
 * grande, un índice de categorías como pestañas de texto (sin iconos ni
 * tarjetas grises) y la grilla de artículos con filetes.
 */

type Filter = BlogCategory | "Todos";
const FILTERS: Filter[] = ["Todos", ...BLOG_CATEGORIES];

const CATEGORY_LEAD = (L: Pick2): Record<Filter, string> => ({
  Todos: L("Todos los artículos, del más nuevo al más viejo.", "All articles, newest to oldest."),
  Numerología: L("Los números que salen de tu fecha de nacimiento y cómo se calculan.", "The numbers that come from your date of birth and how they're calculated."),
  Astrología: L("El Sol, la Luna y los planetas: qué miran y qué no.", "The Sun, the Moon and the planets: what they look at and what they don't."),
  "Zodiaco Chino": L("Tu animal, los amigos y opuestos del ciclo de doce años.", "Your animal, and the friends and opposites of the twelve-year cycle."),
  Autoconocimiento: L("Herramientas para leerte con más calma.", "Tools to read yourself more calmly."),
});

function formatDate(iso: string, tag = "es-AR"): string {
  return new Date(iso + "T00:00:00").toLocaleDateString(tag, { year: "numeric", month: "long", day: "numeric" });
}

const byDate = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

function Featured({ post }: { post: BlogPost }) {
  const L = useL();
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8 items-center">
      <Link href={`/blog/${post.slug}`} className="lg:col-span-7 block relative aspect-[16/10] overflow-hidden bg-paper-alt" aria-label={L.t(post.title)}>
        <Image src={post.image} alt={L.t(post.imageAlt ?? post.title)} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
      </Link>
      <div className="lg:col-span-5">
        <p className="text-sm text-muted label-caps">{L(<>El más reciente · {L.t(post.category)}</>, <>Most recent · {L.t(post.category)}</>)}</p>
        <h2 className="mt-4 font-display font-normal text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-tight text-foreground">
          <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-[6px] decoration-2">
            {L.t(post.title)}
          </Link>
        </h2>
        <p className="mt-5 text-xl text-foreground/85 leading-snug">{L.t(post.excerpt)}</p>
        <p className="mt-6 text-base text-muted">{L(<>
          <time dateTime={post.date}>{formatDate(post.date, L("es-AR", "en-US"))}</time> · {L.t(getReadingTime(post))} min de lectura
        </>, <><time dateTime={post.date}>{formatDate(post.date, L("es-AR", "en-US"))}</time> · {L.t(getReadingTime(post))} min read</>)}</p>
      </div>
    </article>
  );
}

function PostCell({ post }: { post: BlogPost }) {
  const L = useL();
  return (
    <article className="group bg-background flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-paper-alt" tabIndex={-1} aria-hidden="true">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-col flex-1 p-6 sm:p-7">
        <p className="text-sm text-muted">
          {L.t(post.category)} · {L.t(getReadingTime(post))} min
        </p>
        <h3 className="mt-2 font-display font-normal text-2xl leading-tight text-foreground">
          <Link href={`/blog/${post.slug}`} className="group-hover:underline underline-offset-4">
            {L.t(post.title)}
          </Link>
        </h3>
        <p className="mt-3 text-base text-muted leading-relaxed flex-1">{L.t(post.excerpt)}</p>
        <time dateTime={post.date} className="mt-5 pt-4 border-t border-ink/15 text-sm text-muted">
          {formatDate(post.date, L("es-AR", "en-US"))}
        </time>
      </div>
    </article>
  );
}

export default function BlogContent() {
  const L = useL();
  const [filter, setFilter] = useState<Filter>("Todos");
  const counts = useMemo(() => {
    const c: Record<string, number> = { Todos: BLOG_POSTS.length };
    for (const p of BLOG_POSTS) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, []);
  const featured = byDate[0];
  const posts = useMemo(
    () => (filter === "Todos" ? byDate.slice(1) : byDate.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <main id="main-content" className="bg-background">
      <header className="border-b border-ink/10">
        <div className={`${CONTAINER} pt-12 sm:pt-16 pb-16 sm:pb-20`}>
          <Breadcrumb items={[{ href: "/", label: L("Inicio", "Home") }, { label: "Blog" }]} />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-6 items-end">
            <div className="lg:col-span-7">
              <p className="text-sm text-accent mb-4 label-caps">{L(<>Blog · {BLOG_POSTS.length} artículos</>, <>Blog · {BLOG_POSTS.length} articles</>)}</p>
              <h1 className="font-display font-normal text-[clamp(3.5rem,9vw,7rem)] leading-[0.92] tracking-tight text-foreground">{L("Para leer con calma", "To read slowly")}</h1>
            </div>
            <p className="lg:col-span-5 text-xl sm:text-2xl text-foreground/85 leading-snug">{L("Numerología, astrología y zodíaco chino explicados con la cuenta a la vista: qué dice cada sistema y de dónde sale.", "Numerology, astrology and the Chinese zodiac explained with the math in plain sight: what each system says and where it comes from.")}</p>
          </div>
          <div className="mt-14">
            <Featured post={featured} />
          </div>
        </div>
      </header>

      <section className="bg-background">
        <div className={`${CONTAINER} pt-14 sm:pt-20 pb-20`}>
          {/* Índice de categorías: pestañas de texto con la cantidad */}
          <nav aria-label={L("Filtrar artículos por categoría", "Filter articles by category")} className="border-b-2 border-ink">
            <ul className="flex gap-x-8 sm:gap-x-10 overflow-x-auto -mb-0.5 scrollbar-none">
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <li key={f} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setFilter(f)}
                      aria-pressed={active}
                      className={`group py-4 border-b-[3px] transition-colors text-left ${
                        active ? "border-ink text-foreground" : "border-transparent text-muted hover:text-foreground"
                      }`}
                    >
                      <span className="font-display text-2xl sm:text-[1.65rem] leading-none">{L.t(f)}</span>
                      <sup className="ml-1.5 text-sm tabular-nums">{counts[f] ?? 0}</sup>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <p className="mt-6 text-lg text-muted max-w-2xl" aria-live="polite">
            {L.t(CATEGORY_LEAD(L)[filter])}
          </p>

          {posts.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
              {posts.map((post) => (
                <PostCell key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-16 text-lg text-muted">{L("Todavía no hay artículos en esta categoría.", "There are no articles in this category yet.")}</p>
          )}

          <div className="mt-20">
            <Closing
              title={L("Leé tu propia fecha", "Read your own date")}
              text={L("Los artículos explican los sistemas. Tu mapa los aplica a tu fecha de nacimiento, con la cuenta a la vista.", "The articles explain the systems. Your map applies them to your date of birth, with the math in plain sight.")}
              href="/profile"
              cta={L("Crear mi mapa", "Create my map")}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
