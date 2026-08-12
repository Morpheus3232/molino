"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import SearchInput from "@/components/ui/SearchInput";
import Chip from "@/components/ui/Chip";
import {
  SOURCES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type BibliotecaSource,
} from "@/lib/data/biblioteca-content";

export const TYPE_META = {
  libro: { label: "Libro", color: "#D4A843" },
  articulo: { label: "Artículo", color: "#77808E" },
  video: { label: "Video", color: "#897095" },
  sitio: { label: "Sitio web", color: "#708F7B" },
};

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
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted font-medium mb-4">Biblioteca</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]">
            Fuentes y referencias
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Molino calcula tu mapa a partir de tres sistemas: numerología, astrología y zodíaco chino. Esta es
            lectura adicional sobre esos sistemas y sobre otras tradiciones simbólicas relacionadas — no todo lo
            que aparece acá alimenta tu mapa.
          </p>
        </motion.section>

        {/* Filter + Search */}
        <motion.section {...fadeUpDelayed(0.05)} className="mb-10">
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
                    const meta = TYPE_META[source.type];
                    return (
                      <motion.div
                        key={source.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ delay: i * 0.03, duration: 0.35 }}
                        className="p-6 border border-ink/10 bg-background flex flex-col"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            href={`/biblioteca/${source.slug}`}
                            className="font-heading text-sm text-foreground hover:text-accent transition-colors"
                          >
                            {source.title}
                          </Link>
                          <span
                            className="font-mono text-xs font-semibold tracking-wider uppercase px-2 py-0.5 shrink-0"
                            style={{ background: `${meta.color}15`, color: meta.color }}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted mb-2">{source.author} · {source.year}</p>

                        {/* Era badge */}
                        <span
                          className={`self-start font-mono text-xs tracking-wider uppercase px-2 py-0.5 mb-3 ${
                            source.era === "ancestral"
                              ? "bg-accent/10 text-accent"
                              : "bg-ink/5 text-muted"
                          }`}
                        >
                          {source.era === "ancestral" ? "Tradición ancestral" : "Contemporáneo"}
                        </span>

                        <p className="text-sm text-muted mb-3 flex-1 leading-relaxed">{source.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {(source.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-xs tracking-wider uppercase bg-background border border-ink/10 px-2 py-0.5 text-muted"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {(source.review || source.summary) && (
                          <div className="mt-auto pt-3 border-t border-ink/10">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedDescription(
                                  expandedDescription === source.id ? null : source.id
                                )
                              }
                              className={`w-full text-left px-3 py-2.5 font-mono text-xs font-semibold tracking-wider uppercase transition-all min-h-[40px] ${
                                expandedDescription === source.id
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-background border border-ink/10 text-muted hover:text-foreground hover:border-ink/30"
                              }`}
                            >
                              {expandedDescription === source.id ? "Cerrar" : "Descripción"}
                            </button>
                          </div>
                        )}

                        {expandedDescription === source.id && (source.review || source.summary) && (
                          <div className="mt-3 p-3 bg-background border border-ink/10 space-y-3">
                            {source.summary && (
                              <div>
                                <p className="font-mono text-xs font-semibold tracking-wider uppercase text-muted mb-1">
                                  Método
                                </p>
                                <p className="text-xs text-muted leading-relaxed">{source.summary}</p>
                              </div>
                            )}
                            {source.review && (
                              <div>
                                <p className="font-mono text-xs font-semibold tracking-wider uppercase text-muted mb-1">
                                  Reseña
                                </p>
                                <p className="text-xs text-muted leading-relaxed">{source.review}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <Link
                          href={`/biblioteca/${source.slug}`}
                          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                        >
                          Ver ficha completa →
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16"
          >
            <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] tracking-tight text-foreground mb-4">Sin fuentes</h2>
            <p className="text-sm text-muted mb-6 max-w-md mx-auto">
              No se encontraron fuentes para los filtros seleccionados.
            </p>
          </motion.div>
        )}
      </main>

    </div>
  );
}
