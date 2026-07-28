"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Flame, Search, X } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useState, useMemo } from "react";
import { fadeUp } from "@/lib/utils/motion";
import { Masonry, MasonryItem, GoldenCard } from "@/components/ui/GridSystem";

function ConceptsIndex() {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");

  const entries = useMemo(() => [
    { title: "Arquetipos", desc: "Los patrones universales que moldean tu personalidad", href: "/conocimiento/numerologia", icon: Sparkles, tier: "fundamental", length: "long" },
    { title: "Ciclos", desc: "Los ritmos temporales que guían tu año personal", href: "/profile", icon: RefreshCw, tier: "temporal", length: "medium" },
    { title: "Elementos", desc: "Las energías primarias que componen tu naturaleza", href: "/conocimiento/astrologia", icon: Flame, tier: "fundamental", length: "medium" },
    { title: "Números Maestros", desc: "Las frecuencias elevadas de tu mapa numérico", href: "/conocimiento/numerologia", icon: Sparkles, tier: "avanzado", length: "short" },
    { title: "Modalidades", desc: "Los tres modos de expresión de tu energía", href: "/conocimiento/astrologia", icon: RefreshCw, tier: "estructural", length: "short" },
    { title: "Compatibilidad", desc: "Cómo interactúan tus patrones con otros", href: "/compatibility/countries", icon: Flame, tier: "relacional", length: "long" },
    { title: "Síntesis", desc: "La lectura integrada de todos tus sistemas", href: "/synthesis", icon: Sparkles, tier: "integral", length: "medium" },
    { title: "Patrones", desc: "Los temas recurrentes en tu historia personal", href: "/patterns", icon: RefreshCw, tier: "profundo", length: "medium" },
    { title: "Momentum", desc: "La energía disponible en tu ciclo actual", href: "/timing", icon: Flame, tier: "dinamico", length: "short" },
  ], []);

  const filteredConcepts = useMemo(() => {
    if (!searchTerm.trim()) return entries;
    const term = searchTerm.toLowerCase().trim();
    return entries.filter(e =>
      e.title.toLowerCase().includes(term) ||
      e.desc.toLowerCase().includes(term) ||
      e.tier.toLowerCase().includes(term)
    );
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
            Conceptos clave, explicados en profundidad. Busca, filtra y descubre.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="relative max-w-md sm:max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar en la Biblioteca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/10 bg-black/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-neutral-500 mt-3">
              {filteredConcepts.length} resultado{filteredConcepts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <Masonry columns={3} rowGap="1.5rem" columnGap="1.5rem" animated={true}>
          {filteredConcepts.map((entry, i) => (
            <MasonryItem key={entry.title} delay={i * 0.06}>
              <GoldenCard ratio={entry.length === "long" ? 1.45 : entry.length === "short" ? 1.85 : 1.618} elevated={entry.tier === "fundamental" || entry.tier === "integral"} animated={true} delay={i * 0.06}>
                <motion.button
                  {...fadeUp}
                  transition={{ delay: i * 0.06 }}
                  type="button"
                  onClick={() => router.push(entry.href)}
                  className="group relative h-full w-full p-8 sm:p-10 lg:p-12 flex flex-col hover:border-white/30 hover:bg-black/70 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <entry.icon className="w-6 h-6 text-accent/60 group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-accent/60 font-medium mb-2">{entry.tier}</p>
                      <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-background mb-4 group-hover:text-accent transition-colors duration-300 leading-tight">{entry.title}</p>
                      <p className="text-base sm:text-lg text-background/50 leading-relaxed mb-6 flex-1">{entry.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-background/30 group-hover:text-accent transition-colors duration-200">
                        Explorar
                        <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(entry.title); }}
                        className={`text-background/30 hover:text-accent transition-colors duration-200 ${isFavorite(entry.title) ? "text-accent" : ""}`}
                        aria-label={`Guardar ${entry.title} en favoritos`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.button>
              </GoldenCard>
            </MasonryItem>
          ))}
        </Masonry>

        {filteredConcepts.length === 0 && (
          <motion.div {...fadeUp} className="text-center py-16">
            <p className="text-background/50">{`No se encontraron conceptos para "${searchTerm}"`}</p>
          </motion.div>
        )}

        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="text-center pt-8">
          <button
            type="button"
            onClick={() => router.push("/biblioteca")}
            className="group inline-flex items-center gap-3 text-sm font-medium text-background/50 hover:text-background transition-colors duration-200"
          >
            Ver toda la biblioteca
            <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default ConceptsIndex;