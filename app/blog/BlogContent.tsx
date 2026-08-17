"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import { BLOG_POSTS, BLOG_CATEGORIES, getReadingTime, type BlogCategory, type BlogPost } from "@/lib/data/blog-content";

type Filter = BlogCategory | "Todos";
const FILTERS: Filter[] = ["Todos", ...BLOG_CATEGORIES];

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const readTime = getReadingTime(post);
  return (
    <motion.article
      {...staggerItemSmooth}
      transition={{ delay: staggerDelay(index, 0.08), duration: 0.4 }}
      className="card group flex flex-col h-full overflow-hidden hover:border-accent/50 transition-colors"
    >
      <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] relative overflow-hidden bg-paper-alt" aria-label={post.title}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent">{post.category}</span>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted/70">{readTime} min de lectura</span>
        </div>
        <h2 className="font-heading text-xl font-semibold text-foreground leading-snug mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <time dateTime={post.date} className="text-xs font-mono uppercase tracking-[0.2em] text-muted/70">
            {formatDate(post.date)}
          </time>
          <Link href={`/blog/${post.slug}`} className="text-accent hover:text-accent-hover font-medium">
            Leer artículo →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogContent() {
  const [filter, setFilter] = useState<Filter>("Todos");

  const posts = useMemo(
    () => (filter === "Todos" ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-16 sm:pt-24 pb-24" id="main-content">
        {/* Hero */}
        <motion.section {...staggerApple} className="mb-12">
          <motion.h1
            {...staggerItemSmooth}
            transition={{ duration: 0.5 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05] mb-5"
          >
            Blog de autoconocimiento
          </motion.h1>
          <motion.p
            {...staggerItemSmooth}
            transition={{ duration: 0.5 }}
            className="text-base text-muted max-w-2xl leading-relaxed"
          >
            Numerología, astrología y zodíaco chino explicados con claridad. Aprendé a leer los
            patrones que ya están en tu fecha de nacimiento.
          </motion.p>
        </motion.section>

        {/* Filtros por categoría */}
        <nav className="flex flex-wrap gap-2 mb-10" aria-label="Filtrar artículos por categoría">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-[0.2em] rounded-sm border transition-colors min-h-[36px] ${
                  active
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border text-muted hover:text-foreground hover:border-accent/50"
                }`}
              >
                {f}
              </button>
            );
          })}
        </nav>

        {/* Grid de tarjetas */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {posts.length === 0 && (
          <p className="text-center text-muted mt-16">Todavía no hay artículos en esta categoría.</p>
        )}

        {/* CTA al mapa */}
        <motion.section {...staggerApple} className="mt-20 text-center">
          <div className="p-8 sm:p-10 rounded-md border border-border bg-card">
            <p className="text-sm text-muted mb-4 max-w-md mx-auto">
              ¿Querés ver cómo se aplican estos sistemas a TU fecha de nacimiento?
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-md font-heading uppercase tracking-wider font-semibold px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground min-h-[44px] transition-colors"
            >
              Generá tu mapa
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
