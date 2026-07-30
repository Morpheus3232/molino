"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Flame } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useMemo } from "react";

function ConceptsIndex() {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();

  const entries = useMemo(() => [
    { title: "ARQUETIPOS", desc: "Los patrones universales que moldean tu personalidad", href: "/conocimiento/numerologia", icon: Sparkles, tier: "FUNDAMENTAL" },
    { title: "CICLOS", desc: "Los ritmos temporales que guían tu año personal", href: "/profile", icon: RefreshCw, tier: "TEMPORAL" },
    { title: "ELEMENTOS", desc: "Las energías primarias que componen tu naturaleza", href: "/conocimiento/astrologia", icon: Flame, tier: "FUNDAMENTAL" },
    { title: "NÚMEROS MAESTROS", desc: "Las frecuencias elevadas de tu mapa numérico", href: "/conocimiento/numerologia", icon: Sparkles, tier: "AVANZADO" },
    { title: "MODALIDADES", desc: "Los tres modos de expresión de tu energía", href: "/conocimiento/astrologia", icon: RefreshCw, tier: "ESTRUCTURAL" },
    { title: "COMPATIBILIDAD", desc: "Cómo interactúan tus patrones con otros", href: "/compatibility/countries", icon: Flame, tier: "RELACIONAL" },
    { title: "SÍNTESIS", desc: "La lectura integrada de todos tus sistemas", href: "/synthesis", icon: Sparkles, tier: "INTEGRAL" },
    { title: "PATRONES", desc: "Los temas recurrentes en tu historia personal", href: "/patterns", icon: RefreshCw, tier: "PROFUNDO" },
    { title: "MOMENTUM", desc: "La energía disponible en tu ciclo actual", href: "/timing", icon: Flame, tier: "DINÁMICO" },
  ], []);

  const cellPad = "p-8 lg:p-12";

  return (
    <section className="bg-background text-foreground">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`${cellPad} px-0`}
        >
          <p className="eyebrow-brutalist mb-4">LA BIBLIOTECA</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.9] tracking-tight">
            UNA GUÍA PARA ENTENDER
            <br />
            EL LENGUAJE DETRÁS DE TU MAPA.
          </h2>
          <p className="text-sm sm:text-base text-muted mt-4 max-w-xl leading-relaxed">
            Conceptos clave, explicados en profundidad. Buscá, filtrá y descubrí.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div className="flex flex-wrap border-t border-ink/10">
          {entries.map((entry, i) => {
            const isLastRow = i >= entries.length - 3;
            return (
              <motion.button
                key={entry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                type="button"
                onClick={() => router.push(entry.href)}
                className={`group w-full md:w-1/3 ${cellPad} flex flex-col text-left bg-background hover:bg-accent/5 transition-all duration-500 ${!isLastRow ? "border-b border-ink/10" : ""} ${i % 3 !== 2 ? "md:border-r border-ink/10" : ""}`}
              >
                <entry.icon className="w-6 h-6 text-accent mb-6" />
                <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-accent mb-4">{entry.tier}</p>
                <h3 className="font-display text-3xl sm:text-4xl text-foreground mb-4 leading-tight">{entry.title}</h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed mb-8 flex-1">{entry.desc}</p>
                <div className="flex items-center justify-between pt-5 border-t border-ink/10">
                  <span className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-accent group-hover:opacity-80 transition-opacity">
                    EXPLORAR
                    <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(entry.title); }}
                    className={`text-accent/50 hover:text-accent transition-colors ${isFavorite(entry.title) ? "text-accent" : ""}`}
                    aria-label={`Guardar ${entry.title} en favoritos`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border-t border-ink/10"
        >
          <div className="py-8 px-0 text-center">
            <button
              type="button"
              onClick={() => router.push("/biblioteca")}
              className="group inline-flex items-center gap-3 text-xs font-mono tracking-wider text-accent/80 hover:text-accent transition-colors"
            >
              VER TODA LA BIBLIOTECA
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ConceptsIndex;