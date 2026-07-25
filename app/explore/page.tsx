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
    description: "Cada n\u00famero tiene un significado. Tu Camino de Vida, Expression, Alma y Personalidad revelan capas diferentes de qui\u00e9n sos.",
    href: "/conocimiento/numerologia",
    color: "var(--element-fire)",
  },
  {
    id: "astrologia",
    title: "Astrología",
    subtitle: "Los astros y tu energía",
    description: "Tu signo solar, los planetas y las casas forman un mapa del cielo en el momento de tu nacimiento.",
    href: "/conocimiento/astrologia",
    color: "var(--layer-astrology)",
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    subtitle: "El ciclo de 12 animales",
    description: "Un sistema de 12 animales y 5 elementos que se repite cada 60 años. Tu animal y elemento definen tu estilo.",
    href: "/conocimiento/zodiaco-chino",
    color: "var(--layer-moment)",
  },
];

const CONCEPTS = [
  {
    title: "Arquetipos",
    description: "Los 9 arquetipos numerológicos y lo que revelan sobre tu energía natural.",
    href: "/conocimiento/numerologia",
  },
  {
    title: "Elementos",
    description: "Fuego, Tierra, Aire, Agua. Cada elemento tiene una cualidad fundamental que aparece en múltiples sistemas.",
    href: "/conocimiento/astrologia",
  },
  {
    title: "Ciclos",
    description: "Tu año, mes y día personal. Cómo cambia tu energía a lo largo del tiempo.",
    href: "/profile#moment",
  },
  {
    title: "Compatibilidad",
    description: "Cómo conectás con personas, lugares, marcas y conceptos a través de tus sistemas.",
    href: "/compatibility/argentina",
  },
  {
    title: "Números maestros",
    description: "11, 22, 33. Números especiales que amplifican la energía de tu Camino de Vida.",
    href: "/conocimiento/numerologia",
  },
  {
    title: "Modalidades",
    description: "Cardinal, Fijo, Mutable. Cómo implementás tu energía en el mundo.",
    href: "/conocimiento/astrologia",
  },
];

const SOURCES = [
  {
    title: "Numerología Pitagórica",
    author: "Tradición pitagórica",
    description: "El sistema más utilizado. Asocia letras del alfabeto con números del 1 al 9.",
  },
  {
    title: "Astrología Occidental",
    author: "Tradición helenística",
    description: "Basada en la posición del sol, la luna y los planetas en el momento del nacimiento.",
  },
  {
    title: "Zodiaco Chino",
    author: "Tradición china",
    description: "Un ciclo de 12 animales combinados con 5 elementos que se repite cada 60 años.",
  },
];

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConcepts = CONCEPTS.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-content px-5 sm:px-8 lg:px-12 pt-14 sm:pt-24 pb-28" id="main-content">

        {/* Hero */}
        <motion.section {...fadeUp} className="mb-24 sm:mb-32">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-5">Explorar</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05] max-w-4xl">
            El universo de
            <br />
            <span className="text-accent">tu conocimiento</span>
          </h1>
          <p className="text-base sm:text-lg text-muted mt-7 max-w-xl leading-relaxed">
            Molino combina múltiples sistemas simbólicos para construir tu mapa personal.
            Explorá cada sistema para entender cómo funciona.
          </p>
        </motion.section>

        {/* Systems — the three pillars */}
        <motion.section {...fadeUpDelayed(0.1)} className="mb-24 sm:mb-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Los tres sistemas</h2>
          </div>

          <div className="space-y-5">
            {SYSTEMS.map((system, i) => (
              <motion.button
                key={system.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                onClick={() => router.push(system.href)}
                className="w-full text-left p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-accent/40 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: system.color }}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {system.title}
                    </h3>
                    <p className="text-sm text-accent/80 font-medium mt-1">{system.subtitle}</p>
                    <p className="text-sm text-muted mt-3 leading-relaxed max-w-lg">
                      {system.description}
                    </p>
                  </div>
                  <span className="text-sm text-muted group-hover:text-accent transition-colors mt-2 shrink-0">
                    Explorar →
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Concepts — searchable grid */}
        <motion.section {...fadeUpDelayed(0.15)} className="mb-24 sm:mb-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Conceptos clave</h2>
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar concepto..."
              className="input max-w-md"
              aria-label="Buscar concepto"
            />
          </div>

          {filteredConcepts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted mb-3">
                No se encontraron conceptos para &ldquo;{searchTerm}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-sm font-medium text-accent hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConcepts.map((concept, i) => (
                <motion.button
                  key={concept.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                  onClick={() => router.push(concept.href)}
                  className="text-left p-5 rounded-2xl border border-border bg-card hover:border-accent/40 transition-all duration-300 group"
                >
                  <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    {concept.description}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </motion.section>

        {/* Sources — brief */}
        <motion.section {...fadeUpDelayed(0.2)} className="mb-24 sm:mb-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Fuentes</h2>
          </div>

          <div className="space-y-4 max-w-2xl">
            {SOURCES.map((source) => (
              <div key={source.title} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">{source.title}</p>
                  <p className="text-xs text-muted mt-0.5">{source.author}</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{source.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/biblioteca"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
            >
              Ver biblioteca completa →
            </Link>
          </div>
        </motion.section>

        {/* Affinity — primary entity discovery */}
        <motion.section {...fadeUpDelayed(0.25)} className="mb-24 sm:mb-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Afinidad Simb&oacute;lica</h2>
          </div>

          <p className="text-sm text-muted mb-6 max-w-lg">
            Descubr&iacute; qu&eacute; entidades reales resuenan con vos. Pa&iacute;ses, marcas, universidades y m&aacute;s.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/affinity"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[44px]"
            >
              Explorar afinidades &rarr;
            </Link>
            <Link
              href="/compatibility/countries"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all px-6 py-3 text-sm border border-border bg-card text-foreground hover:border-accent min-h-[44px]"
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
