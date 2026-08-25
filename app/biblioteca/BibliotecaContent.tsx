"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUpMount, fadeUpMountDelayed } from "@/lib/utils/motion";
import SearchInput from "@/components/ui/SearchInput";
import Chip from "@/components/ui/Chip";
import { BookOpen, Sparkles, Compass, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import {
  SOURCES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type BibliotecaSource,
} from "@/lib/data/biblioteca-content";

export const TYPE_META = {
  libro: { label: "Libro", color: "#7B5E1C" },
  articulo: { label: "Artículo", color: "#5F6773" },
  video: { label: "Video", color: "#7C6487" },
  sitio: { label: "Sitio web", color: "#5A7262" },
};

const CONTEXT_PATHS = [
  {
    title: "Numerología & Camino de Vida",
    desc: "Para entender la reducción pitagórica, los Números Maestros y la estructura vibratoria del tiempo.",
    authors: "Pitágoras · Numerología Caldea",
    tag: "numerología",
  },
  {
    title: "Astrología Psicológica & Elementos",
    desc: "Para profundizar en la interacción entre los cuatro elementos y las polaridades solares sin determinismo.",
    authors: "Stephen Arroyo · Dane Rudhyar · Liz Greene",
    tag: "psicología",
  },
  {
    title: "Arquetipos & Sincronicidad",
    desc: "Para explorar la teoría del inconsciente colectivo y por qué los símbolos resuenan en la psique humana.",
    authors: "Carl G. Jung",
    tag: "arquetipos",
  },
  {
    title: "Ciclo Sexagenario & Zodíaco Chino",
    desc: "Para estudiar los ritmos lunares, las 12 ramas terrestres y la armonía de los cinco elementos orientales.",
    authors: "Zodiaco Chino Tradicional · I Ching",
    tag: "zodiaco chino",
  },
];

export default function BibliotecaContent() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    SOURCES.forEach((s) => s.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, []);

  const filtered = useMemo(() => {
    return SOURCES.filter((s) => {
      const matchTag = !activeTag || (s.tags || []).includes(activeTag);
      const matchSearch =
        !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTag && matchSearch;
    });
  }, [activeTag, searchQuery]);

  const grouped = useMemo(() => {
    const groups: Record<string, BibliotecaSource[]> = {};
    CATEGORY_ORDER.forEach((cat) => (groups[cat] = []));
    filtered.forEach((s) => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [filtered]);

  const hasAnyResults = Object.values(grouped).some((g) => g.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-16 sm:pt-20 pb-24" id="main-content">
        {/* Hero */}
        <motion.section {...fadeUpMount} className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted font-medium mb-4">Biblioteca de Fuentes</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]">
            Fuentes, Autores & Contexto
          </h1>
          <p className="text-base sm:text-lg text-muted mt-4 max-w-2xl leading-relaxed">
            Molino integra tres sistemas simbólicos tradicionales: <strong>numerología pitagórica</strong>, <strong>astrología solar</strong> y <strong>zodíaco chino</strong>. Esta biblioteca documenta las obras y corrientes teóricas que fundamentan nuestros algoritmos de lectura.
          </p>
        </motion.section>

        {/* Tu mapa en contexto — Guía de lectura temática */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-accent" />
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-accent">
              Tu mapa en contexto: cómo orientar tu lectura
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTEXT_PATHS.map((item) => (
              <div
                key={item.title}
                role="button"
                tabIndex={0}
                className="p-5 rounded-2xl bg-card/70 border border-ink/10 hover:border-accent/30 transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => {
                  setActiveTag(item.tag);
                  document.getElementById("biblioteca-search")?.scrollIntoView({ behavior: "smooth" });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveTag(item.tag);
                    document.getElementById("biblioteca-search")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <h3 className="font-heading text-sm font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  {item.desc}
                </p>
                <div className="text-[11px] font-mono text-accent flex items-center justify-between pt-2 border-t border-ink/5">
                  <span>{item.authors}</span>
                  <span className="hover:underline">Filtrar obras →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter + Search */}
        <motion.section {...fadeUpMountDelayed(0.05)} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <SearchInput
                id="biblioteca-search"
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder="Buscar por título, autor, descripción o etiqueta…"
                label="Buscar en la biblioteca"
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-1 sm:justify-end">
              <Chip selected={!activeTag} onClick={() => setActiveTag(null)}>
                Todas
              </Chip>
              {allTags.map((tag) => (
                <Chip
                  key={tag}
                  selected={activeTag === tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  #{tag}
                </Chip>
              ))}
            </div>
          </div>
        </motion.section>

        {hasAnyResults ? (
          CATEGORY_ORDER.map((catKey) => {
            const sources = grouped[catKey];
            if (sources.length === 0) return null;
            return (
              <section key={catKey} className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-ink/10" aria-hidden="true" />
                  <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">
                    {CATEGORY_LABELS[catKey]}
                  </h2>
                  <span className="font-mono text-xs text-muted">{sources.length}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sources.map((source, i) => {
                    const meta = TYPE_META[source.type as keyof typeof TYPE_META] || TYPE_META.libro;
                    return (
                      <motion.div
                        key={source.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.35 }}
                        className="p-6 rounded-2xl border border-ink/10 bg-card flex flex-col justify-between hover:border-ink/25 transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link
                              href={`/biblioteca/${source.slug}`}
                              className="font-heading text-sm font-bold text-foreground hover:text-accent transition-colors"
                            >
                              {source.title}
                            </Link>
                            <span
                              className="font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0"
                              style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                            >
                              {meta.label}
                            </span>
                          </div>

                          <p className="text-xs font-mono text-muted mb-3">
                            {source.author} {source.year ? `(${source.year})` : ""}
                          </p>

                          <p className="text-xs text-muted leading-relaxed">
                            {source.description}
                          </p>
                        </div>

                        {source.tags && source.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-ink/5">
                            {source.tags.map((t) => (
                              <span key={t} className="text-[10px] font-mono text-muted/70 bg-background px-1.5 py-0.5 rounded border border-ink/5">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-2xl border border-dashed border-ink/15 text-muted font-mono text-xs">
            No se encontraron obras para los filtros seleccionados.
          </div>
        )}
      </main>
    </div>
  );
}
