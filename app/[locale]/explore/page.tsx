"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import SearchInput from "@/components/ui/SearchInput";
import { PageHero, KnowledgeSection, IndexGrid, Columns, Closing, CONTAINER } from "@/components/knowledge/Kit";

const SYSTEMS = (L: Pick2) => ([
  {
    id: "numerologia",
    title: "Numerología",
    subtitle: L("El lenguaje de los números", "The language of numbers"),
    description:
      L("Cada número tiene un significado. Tu Camino de Vida y tus números derivados se cruzan con el resto de tu mapa para componer quién sos.", "Every number has a meaning. Your Life Path and your derived numbers cross with the rest of your map to compose who you are."),
    href: "/conocimiento/numerologia",
  },
  {
    id: "astrologia",
    title: "Astrología",
    subtitle: L("Los astros y tu energía", "The stars and your energy"),
    description:
      L("Tu signo solar y su elemento muestran cómo te mostrás al mundo y qué te mueve.", "Your sun sign and its element show how you present yourself to the world and what moves you."),
    href: "/conocimiento/astrologia",
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    subtitle: L("El ciclo de 12 animales", "The cycle of 12 animals"),
    description:
      L("Un sistema de 12 animales y 5 elementos que se repite cada 60 años. Tu animal y elemento describen tu estilo.", "A system of 12 animals and 5 elements that repeats every 60 years. Your animal and element describe your style."),
    href: "/conocimiento/zodiaco-chino",
  },
]);

const CONCEPTS = (L: Pick2) => ([
  { title: L("Arquetipos", "Archetypes"), description: L("Los 9 arquetipos numerológicos y lo que describen sobre tu energía natural.", "The 9 numerological archetypes and what they describe about your natural energy."), href: "/conocimiento/numerologia" },
  { title: L("Elementos", "Elements"), description: L("Fuego, Tierra, Aire, Agua. Cada elemento tiene una cualidad fundamental.", "Fire, Earth, Air, Water. Each element has a fundamental quality."), href: "/conocimiento/astrologia" },
  { title: L("Ciclos", "Cycles"), description: L("Tu año, mes y día personal. Cómo cambia tu energía a lo largo del tiempo.", "Your personal year, month and day. How your energy changes over time."), href: "/profile#moment" },
  { title: L("Compatibilidad", "Compatibility"), description: L("Cómo conectás con personas, lugares, marcas y conceptos a través de tus sistemas.", "How you connect with people, places, brands and concepts through your systems."), href: "/affinity/country" },
  { title: L("Números maestros", "Master numbers"), description: L("11, 22, 33. Números especiales que amplifican la energía de tu Camino de Vida.", "11, 22, 33. Special numbers that amplify the energy of your Life Path."), href: "/conocimiento/numerologia" },
  { title: L("Modalidades", "Modalities"), description: L("Cardinal, Fijo, Mutable. Cómo implementás tu energía en el mundo.", "Cardinal, Fixed, Mutable. How you put your energy to work in the world."), href: "/conocimiento/astrologia" },
]);

const SOURCES = (L: Pick2) => ([
  { title: L("Numerología Pitagórica", "Pythagorean Numerology"), author: L("Tradición pitagórica", "Pythagorean tradition"), description: L("Asocia letras del alfabeto con números del 1 al 9.", "Associates the letters of the alphabet with numbers from 1 to 9.") },
  { title: L("Astrología Occidental", "Western Astrology"), author: L("Tradición helenística", "Hellenistic tradition"), description: L("Basada en la posición del sol, la luna y los planetas.", "Based on the position of the Sun, the Moon and the planets.") },
  { title: "Zodiaco Chino", author: L("Tradición china", "Chinese tradition"), description: L("Ciclo de 12 animales combinados con 5 elementos.", "A cycle of 12 animals combined with 5 elements.") },
]);


export default function ExplorePage() {
  const L = useL();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConcepts = CONCEPTS(L).filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Explorar", "Explore") }]}
        eyebrow={L("Explorar · tres sistemas", "Explore · three systems")}
        title={L("El universo de tu conocimiento", "The universe of your knowledge")}
        lead={L("Tu mapa combina tres sistemas simbólicos. Recorré cada uno para entender cómo funciona y qué mira.", "Your map combines three symbolic systems. Walk through each one to understand how it works and what it looks at.")}
        imageKey="paginas/explore"
      />

      <KnowledgeSection label={L("Los sistemas", "The systems")} title={L("Por dónde empezar", "Where to start")}>
        <IndexGrid cols={3} items={SYSTEMS(L).map((s) => ({ href: s.href, kicker: s.subtitle, title: s.title, text: s.description, cta: L("Explorar", "Explore") }))} />
      </KnowledgeSection>

      <KnowledgeSection label={L("Conceptos clave", "Key concepts")} title={L("Las palabras del sistema", "The words of the system")} intro={L("Buscá un concepto o recorré la lista.", "Search for a concept or browse the list.")} tone="alt">
        <div className="max-w-xl mb-8">
          <SearchInput value={searchTerm} onValueChange={setSearchTerm} placeholder={L("Buscar concepto", "Search concept")} label={L("Buscar concepto", "Search concept")} />
        </div>
        {filteredConcepts.length === 0 ? (
          <p className="text-lg text-muted">
            No hay conceptos para &ldquo;{L.t(searchTerm)}&rdquo;.{" "}
            <button type="button" onClick={() => setSearchTerm("")} className="underline underline-offset-4 text-foreground">{L("Ver todos", "See all")}</button>
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
            {filteredConcepts.map((concept) => (
              <li key={concept.title} className="bg-background">
                <Link href={concept.href} className="group block h-full p-6 sm:p-7 hover:bg-paper-alt/70 transition-colors">
                  <span className="block font-display text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">{L.t(concept.title)}</span>
                  <span className="mt-2 block text-base text-foreground/80 leading-relaxed">{L.t(concept.description)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </KnowledgeSection>

      <KnowledgeSection label={L("Fuentes", "Sources")} title={L("Las obras de referencia", "The reference works")}>
        <Columns cols={SOURCES(L).map((s) => ({ title: s.title, body: <><span className="block text-base text-muted">{L.t(s.author)}</span><span className="mt-2 block">{L.t(s.description)}</span></> }))} />
        <p className="mt-6 text-lg">{L(<>
          <Link href="/biblioteca" className="underline underline-offset-4 hover:no-underline">Ver la biblioteca completa</Link>
        </>, <><Link href="/biblioteca" className="underline underline-offset-4 hover:no-underline">See the full library</Link></>)}</p>
      </KnowledgeSection>

      <section className="bg-background">
        <div className={`${CONTAINER} py-16 sm:py-20`}>
          <Closing
            title={L("¿Qué resuena con tu signo?", "What resonates with your sign?")}
            text={L("Países, marcas, universidades y personas del Atlas, ordenados según tu animal del zodíaco chino.", "Countries, brands, universities and people from the Atlas, sorted by your Chinese zodiac animal.")}
            href="/affinity"
            cta={L("Ver mis afinidades", "See my affinities")}
          />
        </div>
      </section>
    </main>
  );
}
