"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

const CATEGORY_LEAD: Record<Filter, string> = {
  Todos: "Todos los artículos, del más nuevo al más viejo.",
  Numerología: "Los números que salen de tu fecha de nacimiento y cómo se calculan.",
  Astrología: "El Sol, la Luna y los planetas: qué miran y qué no.",
  "Zodiaco Chino": "Tu animal, los amigos y opuestos del ciclo de doce años.",
  Autoconocimiento: "Herramientas para leerte con más calma.",
};

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" });
}

const byDate = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

function Featured({ post }: { post: BlogPost }) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-8 items-center">
      <Link href={`/blog/${post.slug}`} className="lg:col-span-7 block relative aspect-[16/10] overflow-hidden bg-paper-alt" aria-label={post.title}>
        <Image src={post.image} alt={post.imageAlt ?? post.title} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
      </Link>
      <div className="lg:col-span-5">
        <p className="text-sm text-muted label-caps">El más reciente · {post.category}</p>
        <h2 className="mt-4 font-display font-normal text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-tight text-foreground">
          <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-[6px] decoration-2">
            {post.title}
          </Link>
        </h2>
        <p className="mt-5 text-xl text-foreground/85 leading-snug">{post.excerpt}</p>
        <p className="mt-6 text-base text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {getReadingTime(post)} min de lectura
        </p>
      </div>
    </article>
  );
}

function PostCell({ post }: { post: BlogPost }) {
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
          {post.category} · {getReadingTime(post)} min
        </p>
        <h3 className="mt-2 font-display font-normal text-2xl leading-tight text-foreground">
          <Link href={`/blog/${post.slug}`} className="group-hover:underline underline-offset-4">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 text-base text-muted leading-relaxed flex-1">{post.excerpt}</p>
        <time dateTime={post.date} className="mt-5 pt-4 border-t border-ink/15 text-sm text-muted">
          {formatDate(post.date)}
        </time>
      </div>
    </article>
  );
}

export default function BlogContent() {
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
          <Breadcrumb items={[{ href: "/", label: "Inicio" }, { label: "Blog" }]} />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-6 items-end">
            <div className="lg:col-span-7">
              <p className="text-sm text-accent mb-4 label-caps">Blog · {BLOG_POSTS.length} artículos</p>
              <h1 className="font-display font-normal text-[clamp(3.5rem,9vw,7rem)] leading-[0.92] tracking-tight text-foreground">
                Para leer con calma
              </h1>
            </div>
            <p className="lg:col-span-5 text-xl sm:text-2xl text-foreground/85 leading-snug">
              Numerología, astrología y zodíaco chino explicados con la cuenta a la vista: qué dice cada sistema y de dónde
              sale.
            </p>
          </div>
          <div className="mt-14">
            <Featured post={featured} />
          </div>
        </div>
      </header>

      <section className="bg-background">
        <div className={`${CONTAINER} pt-14 sm:pt-20 pb-20`}>
          {/* Índice de categorías: pestañas de texto con la cantidad */}
          <nav aria-label="Filtrar artículos por categoría" className="border-b-2 border-ink">
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
                      <span className="font-display text-2xl sm:text-[1.65rem] leading-none">{f}</span>
                      <sup className="ml-1.5 text-sm tabular-nums">{counts[f] ?? 0}</sup>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <p className="mt-6 text-lg text-muted max-w-2xl" aria-live="polite">
            {CATEGORY_LEAD[filter]}
          </p>

          {posts.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
              {posts.map((post) => (
                <PostCell key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-16 text-lg text-muted">Todavía no hay artículos en esta categoría.</p>
          )}

          <div className="mt-20">
            <Closing
              title="Leé tu propia fecha"
              text="Los artículos explican los sistemas. Tu mapa los aplica a tu fecha de nacimiento, con la cuenta a la vista."
              href="/profile"
              cta="Crear mi mapa"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
