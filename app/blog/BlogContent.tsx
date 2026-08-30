"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUpMount, staggerContainer, staggerDelay } from "@/lib/utils/motion";
import { BLOG_POSTS, BLOG_CATEGORIES, getReadingTime, type BlogCategory, type BlogPost } from "@/lib/data/blog-content";
import { Sparkles, Users, Moon, Compass } from "lucide-react";

type Filter = BlogCategory | "Todos";
const FILTERS: Filter[] = ["Todos", ...BLOG_CATEGORIES];

// Metadata para cada categoría
const CATEGORY_META: Record<Filter, { icon: React.ComponentType<{ className?: string }>, description: string, color: string }> = {
  Todos: {
    icon: Compass,
    description: "Explorá todos los artículos",
    color: "text-accent",
  },
  Numerología: {
    icon: Sparkles,
    description: "Los números de tu fecha de nacimiento",
    color: "text-terracota",
  },
  Astrología: {
    icon: Moon,
    description: "Tu carta astral y los planetas",
    color: "text-gold",
  },
  "Zodiaco Chino": {
    icon: Users,
    description: "Tu animal y los ciclos de 12 años",
    color: "text-purple-400",
  },
  Autoconocimiento: {
    icon: Compass,
    description: "Herramientas para conocerte mejor",
    color: "text-blue-400",
  },
};

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
      {...fadeUpMount}
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

  const meta = CATEGORY_META[filter];
  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-16 sm:pt-24 pb-24" id="main-content">
        {/* Hero — above the fold, dispara al montar (no whileInView, ver fadeUpMount) */}
        <div className="mb-12">
          <motion.h1
            {...fadeUpMount}
            transition={{ duration: 0.5 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05] mb-5"
          >
            Blog de autoconocimiento
          </motion.h1>
          <motion.p
            {...fadeUpMount}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base text-muted max-w-2xl leading-relaxed"
          >
            Numerología, astrología y zodíaco chino explicados con claridad. Aprendé a leer los
            patrones que ya están en tu fecha de nacimiento.
          </motion.p>
        </div>

        {/* Menú de categorías mejorado */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12"
          aria-label="Filtrar artículos por categoría"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {FILTERS.map((f, idx) => {
              const active = filter === f;
              const categoryMeta = CATEGORY_META[f];
              const CategoryIcon = categoryMeta.icon;

              return (
                <motion.button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all min-h-[120px] sm:min-h-[140px] ${
                    active
                      ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                      : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
                  }`}
                >
                  <CategoryIcon className={`w-6 h-6 sm:w-7 sm:h-7 mb-2 ${active ? categoryMeta.color : "text-muted"} transition-colors`} />
                  <span className={`text-xs sm:text-sm font-heading font-bold uppercase tracking-[0.1em] text-center leading-tight ${
                    active ? "text-foreground" : "text-muted"
                  }`}>
                    {f}
                  </span>
                  {f !== "Todos" && (
                    <span className="text-[10px] text-muted mt-1 text-center leading-tight max-w-[90px]">
                      {categoryMeta.description}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.nav>

        {/* Descripción de la categoría activa */}
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-10 p-5 rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-3"
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mt-0.5 shrink-0 ${meta.color}`} />
          <div>
            <p className="font-heading font-semibold text-foreground text-sm sm:text-base">
              {filter === "Todos" ? "Todos los artículos" : filter}
            </p>
            <p className="text-xs sm:text-sm text-muted mt-1">
              {meta.description}
            </p>
            {filter !== "Todos" && (
              <p className="text-xs text-muted/70 mt-2">
                {posts.length} artículo{posts.length !== 1 ? "s" : ""} disponible{posts.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </motion.div>

        {/* Grid de tarjetas — sin `layout` en el contenedor: esa prop dispara
            una animación FLIP que, en navegación client-side de Next.js,
            puede medir la posición contra el layout de la página anterior
            todavía no descartado y calcular un translateY gigante (~2600px
            en producción, empujando el grid entero fuera de pantalla, sin
            resolver nunca — la causa real del blog "en blanco"). AnimatePresence
            solo en los hijos sigue animando entrada/salida al filtrar por
            categoría sin ese riesgo. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {posts.length === 0 && (
          <p className="text-center text-muted mt-16">Todavía no hay artículos en esta categoría.</p>
        )}

        {/* CTA al mapa */}
        <motion.section {...staggerContainer} className="mt-20 text-center">
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
