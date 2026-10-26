"use client";

import { useState } from "react";
import Link from "next/link";
import SearchInput from "@/components/ui/SearchInput";
import { PageHero, KnowledgeSection, IndexGrid, Columns, Closing, CONTAINER } from "@/components/knowledge/Kit";

const SYSTEMS = [
  {
    id: "numerologia",
    title: "Numerología",
    subtitle: "El lenguaje de los números",
    description:
      "Cada número tiene un significado. Tu Camino de Vida y tus números derivados se cruzan con el resto de tu mapa para componer quién sos.",
    href: "/conocimiento/numerologia",
  },
  {
    id: "astrologia",
    title: "Astrología",
    subtitle: "Los astros y tu energía",
    description:
      "Tu signo solar y su elemento muestran cómo te mostrás al mundo y qué te mueve.",
    href: "/conocimiento/astrologia",
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    subtitle: "El ciclo de 12 animales",
    description:
      "Un sistema de 12 animales y 5 elementos que se repite cada 60 años. Tu animal y elemento describen tu estilo.",
    href: "/conocimiento/zodiaco-chino",
  },
];

const CONCEPTS = [
  { title: "Arquetipos", description: "Los 9 arquetipos numerológicos y lo que describen sobre tu energía natural.", href: "/conocimiento/numerologia" },
  { title: "Elementos", description: "Fuego, Tierra, Aire, Agua. Cada elemento tiene una cualidad fundamental.", href: "/conocimiento/astrologia" },
  { title: "Ciclos", description: "Tu año, mes y día personal. Cómo cambia tu energía a lo largo del tiempo.", href: "/profile#moment" },
  { title: "Compatibilidad", description: "Cómo conectás con personas, lugares, marcas y conceptos a través de tus sistemas.", href: "/affinity/country" },
  { title: "Números maestros", description: "11, 22, 33. Números especiales que amplifican la energía de tu Camino de Vida.", href: "/conocimiento/numerologia" },
  { title: "Modalidades", description: "Cardinal, Fijo, Mutable. Cómo implementás tu energía en el mundo.", href: "/conocimiento/astrologia" },
];

const SOURCES = [
  { title: "Numerología Pitagórica", author: "Tradición pitagórica", description: "Asocia letras del alfabeto con números del 1 al 9." },
  { title: "Astrología Occidental", author: "Tradición helenística", description: "Basada en la posición del sol, la luna y los planetas." },
  { title: "Zodiaco Chino", author: "Tradición china", description: "Ciclo de 12 animales combinados con 5 elementos." },
];


export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConcepts = CONCEPTS.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { label: "Explorar" }]}
        eyebrow="Explorar · tres sistemas"
        title="El universo de tu conocimiento"
        lead="Tu mapa combina tres sistemas simbólicos. Recorré cada uno para entender cómo funciona y qué mira."
        imageKey="paginas/explore"
      />

      <KnowledgeSection label="Los sistemas" title="Por dónde empezar">
        <IndexGrid cols={3} items={SYSTEMS.map((s) => ({ href: s.href, kicker: s.subtitle, title: s.title, text: s.description, cta: "Explorar" }))} />
      </KnowledgeSection>

      <KnowledgeSection label="Conceptos clave" title="Las palabras del sistema" intro="Buscá un concepto o recorré la lista." tone="alt">
        <div className="max-w-xl mb-8">
          <SearchInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Buscar concepto" label="Buscar concepto" />
        </div>
        {filteredConcepts.length === 0 ? (
          <p className="text-lg text-muted">
            No hay conceptos para &ldquo;{searchTerm}&rdquo;.{" "}
            <button type="button" onClick={() => setSearchTerm("")} className="underline underline-offset-4 text-foreground">
              Ver todos
            </button>
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
            {filteredConcepts.map((concept) => (
              <li key={concept.title} className="bg-background">
                <Link href={concept.href} className="group block h-full p-6 sm:p-7 hover:bg-paper-alt/70 transition-colors">
                  <span className="block font-display text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">{concept.title}</span>
                  <span className="mt-2 block text-base text-foreground/80 leading-relaxed">{concept.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </KnowledgeSection>

      <KnowledgeSection label="Fuentes" title="Las obras de referencia">
        <Columns cols={SOURCES.map((s) => ({ title: s.title, body: <><span className="block text-base text-muted">{s.author}</span><span className="mt-2 block">{s.description}</span></> }))} />
        <p className="mt-6 text-lg">
          <Link href="/biblioteca" className="underline underline-offset-4 hover:no-underline">Ver la biblioteca completa</Link>
        </p>
      </KnowledgeSection>

      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-20`}>
          <Closing
            title="¿Qué resuena con tu signo?"
            text="Países, marcas, universidades y personas del Atlas, ordenados según tu animal del zodíaco chino."
            href="/affinity"
            cta="Ver mis afinidades"
          />
        </div>
      </section>
    </main>
  );
}
