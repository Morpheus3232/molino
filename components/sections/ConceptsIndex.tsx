"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Flame, Search, X } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useState, useMemo } from "react";
import { fadeUp } from "@/lib/utils/motion";

function ConceptsIndex() {
  const router = useRouter();
  const { toggleFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const entries = [
    { title: "Arquetipos", desc: "Los patrones universales de la personalidad", href: "/conocimiento/numerologia", icon: Sparkles },
    { title: "Ciclos", desc: "Los ritmos de tu año personal", href: "/profile", icon: RefreshCw },
    { title: "Elementos", desc: "Las energías que te componen", href: "/conocimiento/astrologia", icon: Flame },
  ];
  const filteredConcepts = useMemo(() => {
    if (!searchTerm.trim()) return entries;
    const term = searchTerm.toLowerCase().trim();
    return entries.filter(e => e.title.toLowerCase().includes(term) || e.desc.toLowerCase().includes(term));
  }, [entries, searchTerm]);

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-foreground text-background">
      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
        <motion.div {...fadeUp} className="mb-10 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-5">La Biblioteca</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.0] text-background">
            Una guía para entender el lenguaje detrás de tu mapa.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-background/50 max-w-xl leading-relaxed">
            Conceptos clave, explicados en profundidad.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar en la Biblioteca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-neutral-500 mt-2">
              {filteredConcepts.length} resultado{filteredConcepts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {filteredConcepts.map((entry, i) => (
            <motion.button
              key={entry.title}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              type="button"
              onClick={() => router.push(entry.href)}
              className="group text-left rounded-2xl border border-white/10 bg-black/50 p-8 sm:p-10 lg:p-12 hover:border-white/30 hover:bg-black/70 transition-all duration-300 hover:-translate-y-1"
            >
              <entry.icon className="w-6 h-6 text-accent/60 mb-5" />
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-background mb-3 group-hover:text-accent transition-colors duration-300">{entry.title}</p>
              <p className="text-base sm:text-lg text-background/50 leading-relaxed mb-6">{entry.desc}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-background/30 group-hover:text-accent transition-colors duration-300">
                  Explorar
                  <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">{">"}</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(entry.title); }}
                  className="text-background/30 hover:text-accent transition-colors duration-200"
                  aria-label={`Guardar ${entry.title} en favoritos`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="text-center pt-4">
          <button
            type="button"
            onClick={() => router.push("/biblioteca")}
            className="group inline-flex items-center gap-3 text-sm font-medium text-background/50 hover:text-background transition-colors duration-200"
          >
            Ver toda la biblioteca
            <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">{">"}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default ConceptsIndex;