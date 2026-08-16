"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import { getBlogPostBySlug, getReadingTime, type BlogPost } from "@/lib/data/blog-content";

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function Toc({ post }: { post: BlogPost }) {
  const activeId = useScrollSpy(post.sections.map((s) => s.id));

  return (
    <nav aria-label="Tabla de contenidos" className="mb-8">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-4">En este artículo</p>
      <ul className="space-y-2.5 border-l border-border pl-4">
        {post.sections.map((section) => {
          const active = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block text-sm leading-snug transition-colors border-l -ml-[1.05rem] pl-4 ${
                  active
                    ? "text-foreground font-medium border-accent"
                    : "text-muted border-transparent hover:text-foreground"
                }`}
              >
                {section.heading}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function RelatedArticles({ post }: { post: BlogPost }) {
  const related = post.related
    .map((slug) => getBlogPostBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p));

  if (related.length === 0) return null;

  return (
    <div className="mb-8">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-4">Artículos relacionados</p>
      <ul className="space-y-3">
        {related.map((rel) => (
          <li key={rel.slug}>
            <Link
              href={`/blog/${rel.slug}`}
              className="group block p-4 rounded-md border border-border hover:border-accent/50 transition-colors"
            >
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent block mb-1">
                {rel.category}
              </span>
              <span className="text-sm text-foreground group-hover:text-accent transition-colors font-medium">
                {rel.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarCta() {
  return (
    <div className="p-6 rounded-md border border-border bg-card">
      <p className="text-sm font-medium text-foreground mb-2">Tu mapa personal</p>
      <p className="text-xs text-muted leading-relaxed mb-4">
        Cruzá numerología, astrología y zodíaco chino en un solo mapa, gratis y sin registro.
      </p>
      <Link
        href="/profile"
        className="inline-flex w-full items-center justify-center gap-2 rounded-md font-heading uppercase tracking-wider font-semibold px-4 py-3 text-xs bg-accent text-accent-foreground hover:opacity-90 min-h-[44px] transition-opacity"
      >
        Crear mi mapa
      </Link>
    </div>
  );
}

export default function BlogArticleContent({ post }: { post: BlogPost }) {
  const readTime = getReadingTime(post);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-16 sm:pt-24 pb-24" id="main-content">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="underline decoration-ink/25 underline-offset-2 hover:text-accent transition-colors">
            Inicio
          </Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <Link href="/blog" className="underline decoration-ink/25 underline-offset-2 hover:text-accent transition-colors">
            Blog
          </Link>
          <span className="mx-2" aria-hidden="true">&rsaquo;</span>
          <span className="text-foreground font-medium" aria-current="page">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          {/* Contenido principal (~70%) */}
          <div className="min-w-0">
            {/* Hero */}
            <motion.header {...fadeUp} className="mb-10">
              <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-accent mb-4">
                {post.category}
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.08] mb-5">
                {post.title}
              </h1>
              <p className="text-base text-muted leading-relaxed max-w-2xl mb-6">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted/70">
                <span>{post.author}</span>
                <span className="w-px h-3 bg-border" aria-hidden="true" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span className="w-px h-3 bg-border" aria-hidden="true" />
                <span>{readTime} min de lectura</span>
              </div>
            </motion.header>

            {/* Portada */}
            <motion.div {...fadeUp} className="mb-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-border bg-paper-alt">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Intro */}
            <div className="space-y-4 mb-10">
              {post.intro.map((p) => (
                <p key={p.slice(0, 40)} className="text-base sm:text-lg text-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Secciones */}
            {post.sections.map((section) => (
              <motion.section key={section.id} {...fadeUp} id={section.id} className="mb-12 scroll-mt-24">
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="text-base text-muted leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-5 space-y-2.5">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-foreground leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}

            {/* FAQ */}
            {post.faq && post.faq.length > 0 && (
              <motion.section {...fadeUp} className="mb-12">
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight mb-4">
                  Preguntas frecuentes
                </h2>
                <div className="space-y-3">
                  {post.faq.map((faq) => (
                    <details key={faq.q} className="group rounded-md border border-border p-5">
                      <summary className="cursor-pointer text-sm font-medium text-foreground list-none flex items-center justify-between gap-3">
                        {faq.q}
                        <span aria-hidden="true" className="text-accent transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                      </summary>
                      <p className="text-sm text-muted leading-relaxed mt-3">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </motion.section>
            )}

            {/* CTA contextual al final */}
            <motion.section {...fadeUp} className="text-center">
              <div className="p-8 sm:p-10 rounded-md border border-border bg-card">
                <p className="text-base text-foreground font-medium mb-2">
                  ¿Querés saber qué dice TU fecha de nacimiento?
                </p>
                <p className="text-sm text-muted mb-5">
                  Generá tu mapa gratuito con numerología, astrología y zodíaco chino.
                </p>
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-md font-heading uppercase tracking-wider font-semibold px-6 py-3 text-sm bg-gold text-gold-foreground hover:bg-gold-hover min-h-[44px] transition-colors"
                >
                  Crear mi mapa →
                </Link>
              </div>
            </motion.section>

            {/* Volver al blog */}
            <div className="mt-12 pt-6 border-t border-border">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <span aria-hidden="true">&larr;</span> Volver al blog
              </Link>
            </div>
          </div>

          {/* Sidebar (~30%) — sticky en desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Toc post={post} />
              <RelatedArticles post={post} />
              <SidebarCta />
            </div>
          </aside>
        </div>

        {/* Sidebar móvil: TOC + relacionados + CTA debajo del contenido */}
        <div className="lg:hidden mt-12 pt-6 border-t border-border">
          <Toc post={post} />
          <RelatedArticles post={post} />
          <SidebarCta />
        </div>
      </main>
    </div>
  );
}
