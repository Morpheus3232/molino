"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

const SYSTEMS = [
  {
    id: "numerologia",
    title: "Numerología",
    subtitle: "El lenguaje de los números",
    description:
      "Cada número tiene un significado. Tu Camino de Vida, Expresión, Alma y Personalidad revelan capas diferentes de quién sos.",
    href: "/conocimiento/numerologia",
  },
  {
    id: "astrologia",
    title: "Astrología",
    subtitle: "Los astros y tu energía",
    description:
      "Tu signo solar, los planetas y las casas forman un mapa del cielo en el momento de tu nacimiento.",
    href: "/conocimiento/astrologia",
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    subtitle: "El ciclo de 12 animales",
    description:
      "Un sistema de 12 animales y 5 elementos que se repite cada 60 años. Tu animal y elemento definen tu estilo.",
    href: "/conocimiento/zodiaco-chino",
  },
];

const CONCEPTS = [
  { title: "Arquetipos", description: "Los 9 arquetipos numerológicos y lo que revelan sobre tu energía natural.", href: "/conocimiento/numerologia" },
  { title: "Elementos", description: "Fuego, Tierra, Aire, Agua. Cada elemento tiene una cualidad fundamental.", href: "/conocimiento/astrologia" },
  { title: "Ciclos", description: "Tu año, mes y día personal. Cómo cambia tu energía a lo largo del tiempo.", href: "/profile#moment" },
  { title: "Compatibilidad", description: "Cómo conectás con personas, lugares, marcas y conceptos a través de tus sistemas.", href: "/compatibility/argentina" },
  { title: "Números maestros", description: "11, 22, 33. Números especiales que amplifican la energía de tu Camino de Vida.", href: "/conocimiento/numerologia" },
  { title: "Modalidades", description: "Cardinal, Fijo, Mutable. Cómo implementás tu energía en el mundo.", href: "/conocimiento/astrologia" },
];

const SOURCES = [
  { title: "Numerología Pitagórica", author: "Tradición pitagórica", description: "Asocia letras del alfabeto con números del 1 al 9." },
  { title: "Astrología Occidental", author: "Tradición helenística", description: "Basada en la posición del sol, la luna y los planetas." },
  { title: "Zodiaco Chino", author: "Tradición china", description: "Ciclo de 12 animales combinados con 5 elementos." },
];

const colBorder = "border-accent/10";
const cellPad = "p-8 sm:p-10 lg:p-12";

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConcepts = CONCEPTS.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <UniversityHeader />

      <main className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-28" id="main-content">

        {/* ═══ HERO ═══ */}
        <motion.section {...fadeUp} className="mb-20 sm:mb-28">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">
            Explorar
          </p>
          <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] max-w-3xl">
            El universo de tu conocimiento
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Molino combina múltiples sistemas simbólicos para construir tu mapa personal.
            Explorá cada sistema para entender cómo funciona.
          </p>
        </motion.section>

        {/* ═══ LOS TRES SISTEMAS ═══ */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los tres sistemas</p>
          </div>
          <div className="flex flex-wrap border-t border-accent/10">
            {SYSTEMS.map((system, i) => (
              <motion.button
                key={system.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onClick={() => router.push(system.href)}
                className={`w-full md:w-1/3 flex flex-col ${i < 2 ? `md:border-r ${colBorder}` : ""} border-b ${colBorder} group`}
              >
                <div className={`flex-1 ${cellPad}`}>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-2">{system.subtitle}</p>
                  <p className="font-heading uppercase text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-3">
                    {system.title}
                  </p>
                  <p className="text-sm text-muted leading-relaxed">{system.description}</p>
                  <p className="text-xs text-accent mt-4 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explorar →
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ═══ CONCEPTOS CLAVE ═══ */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Conceptos clave</p>
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar concepto..."
              className="w-full max-w-md border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent"
              aria-label="Buscar concepto"
            />
          </div>

          {filteredConcepts.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border">
              <p className="text-sm text-muted mb-3">
                No se encontraron conceptos para &quot;{searchTerm}&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-accent/10">
              {filteredConcepts.map((concept, i) => (
                <motion.button
                  key={concept.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => router.push(concept.href)}
                  className={`text-left px-5 sm:px-8 py-5 sm:py-6 border-b border-accent/10 ${(i % 3) < 2 ? "sm:border-r border-accent/10" : ""} group`}
                >
                  <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {concept.title}
                  </p>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    {concept.description}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </motion.section>

        {/* ═══ FUENTES ═══ */}
        <motion.section {...fadeUpDelayed(0.2)} className="mb-20 sm:mb-28">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Fuentes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-accent/10">
            {SOURCES.map((source, i) => (
              <div key={source.title} className={`px-5 sm:px-8 py-6 sm:py-8 border-b border-accent/10 ${i < 2 ? "md:border-r border-accent/10" : ""}`}>
                <p className="text-sm font-medium text-foreground">{source.title}</p>
                <p className="text-xs text-muted mt-1">{source.author}</p>
                <p className="text-xs text-muted/60 mt-2 leading-relaxed">{source.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/biblioteca" className="inline-flex items-center gap-2 text-xs font-medium text-accent hover:text-accent/80 transition-colors">
              Ver biblioteca completa →
            </Link>
          </div>
        </motion.section>

        {/* ═══ AFINIDAD SIMBÓLICA ═══ */}
        <motion.section {...fadeUpDelayed(0.25)}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Afinidad Simbólica</p>
          </div>
          <p className="text-sm text-muted mb-6 max-w-lg leading-relaxed">
            Descubrí qué entidades reales resuenan con vos. Países, marcas, universidades y más.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/affinity"
              className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 text-sm bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px]"
            >
              Explorar afinidades
            </Link>
            <Link
              href="/compatibility/countries"
              className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3 text-sm border border-border text-foreground hover:border-accent/30 transition-colors min-h-[44px]"
            >
              Compatibilidad
            </Link>
          </div>
        </motion.section>

      </main>

      <UniversityFooter />
    </div>
  );
}
