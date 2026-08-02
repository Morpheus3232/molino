"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import Halftone from "@/components/ui/Halftone";

/**
 * Seccion azul full-bleed. Cierra el ritmo de la home (blanco -> negro -> azul)
 * y funciona como indice de la biblioteca.
 */
function ConceptsIndex() {
  const { toggleFavorite, isFavorite } = useFavorites();

  const entries = useMemo(
    () => [
      { title: "ARQUETIPOS", desc: "Los patrones universales que moldean tu personalidad", href: "/conocimiento/numerologia", tier: "FUNDAMENTAL" },
      { title: "ELEMENTOS", desc: "Las energías primarias que componen tu naturaleza", href: "/conocimiento/astrologia", tier: "FUNDAMENTAL" },
      { title: "CICLOS", desc: "Los ritmos temporales que guían tu año personal", href: "/profile", tier: "TEMPORAL" },
      { title: "NÚMEROS MAESTROS", desc: "Las frecuencias elevadas de tu mapa numérico", href: "/conocimiento/numerologia", tier: "AVANZADO" },
      { title: "COMPATIBILIDAD", desc: "Cómo interactúan tus patrones con otros", href: "/compatibility/countries", tier: "RELACIONAL" },
      { title: "MOMENTUM", desc: "La energía disponible en tu ciclo actual", href: "/timing", tier: "DINÁMICO" },
    ],
    []
  );

  const cellPad = "p-8 lg:p-12";

  return (
    <section className="section-full-bleed bg-accent text-paper relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-40 bottom-0 w-[32rem] h-[32rem] text-paper"
        style={{ opacity: 0.07 }}
      >
        <Halftone variant="wave" resolution={28} className="w-full h-full" />
      </div>

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="pt-20 pb-12 lg:pt-28 lg:pb-16"
        >
          <p className="font-mono text-sm font-semibold tracking-[0.25em] uppercase text-paper mb-6">
            LA BIBLIOTECA
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.88] tracking-tight text-paper max-w-4xl">
            EL LENGUAJE
            <br />
            DETRÁS DE TU MAPA.
          </h2>
          <p className="text-lg lg:text-xl text-paper/90 mt-8 max-w-xl leading-relaxed">
            Conceptos clave, explicados en profundidad.
          </p>
        </motion.div>

        <div className="flex flex-wrap border-t border-paper/20">
          {entries.map((entry, i) => {
            const isLastRow = i >= entries.length - 3;
            return (
              <motion.div
                key={entry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                className={`relative w-full md:w-1/3 ${!isLastRow ? "border-b border-paper/20" : ""} ${
                  i % 3 !== 2 ? "md:border-r border-paper/20" : ""
                }`}
              >
                {/* El link cubre la tarjeta y el boton de favorito va aparte, no
                    anidado: un <button> dentro de otro es HTML invalido. */}
                <Link
                  href={entry.href}
                  className={`group flex h-full flex-col ${cellPad} transition-colors hover:bg-paper/[0.08]`}
                >
                  <p className="font-mono text-xs font-semibold tracking-[0.2em] text-paper/80 mb-4">
                    {entry.tier}
                  </p>
                  <h3 className="font-display text-2xl lg:text-3xl text-paper mb-4 leading-[0.95]">
                    {entry.title}
                  </h3>
                  <p className="text-base text-paper/85 leading-relaxed mb-8 flex-1">{entry.desc}</p>
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-paper pt-6 border-t border-paper/20">
                    EXPLORAR
                    <span
                      className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => toggleFavorite(entry.title)}
                  aria-pressed={isFavorite(entry.title)}
                  aria-label={`Guardar ${entry.title} en favoritos`}
                  className={`absolute top-8 right-8 lg:top-12 lg:right-12 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-paper ${
                    isFavorite(entry.title) ? "text-paper" : "text-paper/60 hover:text-paper"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isFavorite(entry.title) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.2 }}
          className="border-t border-paper/20"
        >
          <div className="py-10 text-center">
            <Link
              href="/biblioteca"
              className="group inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-paper"
            >
              VER TODA LA BIBLIOTECA
              <span
                className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </motion.div>

        <div className="h-8" />
      </div>
    </section>
  );
}

export default ConceptsIndex;
