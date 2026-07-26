"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

interface Source {
  id: string;
  title: string;
  author: string;
  year: string;
  type: "libro" | "articulo" | "video" | "sitio";
  description: string;
  review?: string;
  summary?: string;
  link?: string;
  tags?: string[];
}

const SOURCES: Source[] = [
  {
    id: "gg33", title: "GG33 Numerolog\u00eda", author: "Gary Grinberg", year: "2020", type: "sitio",
    description: "Sistema de numerolog\u00eda basado en patrones num\u00e9ricos y astrolog\u00eda china.",
    review: "GG33 es un enfoque contempor\u00e1neo que fusiona numerolog\u00eda occidental con astrolog\u00eda china. Grinberg argumenta que los n\u00fameros y los ciclos chinos est\u00e1n interconectados.",
    summary: "Asigna un n\u00famero de c\u00f3digo basado en la fecha de nacimiento y lo cruza con el zodiaco chino. Propone 9 tipos num\u00e9ricos con cualidades espec\u00edficas.",
    link: "https://gg33.com", tags: ["numerolog\u00eda", "gg33"]
  },
  {
    id: "pitagoras", title: "Numerolog\u00eda Pitag\u00f3rica", author: "Pit\u00e1goras (atribuido)", year: "~500 a.C.", type: "libro",
    description: "Sistema de numerolog\u00eda occidental que asigna valores num\u00e9ricos a las letras.",
    review: "La numerolog\u00eda pitag\u00f3rica es el sistema m\u00e1s utilizado en occidente. Aunque se atribuye a Pit\u00e1goras, los historiadores modernos no encuentran evidencia directa.",
    summary: "Asigna valores del 1 al 9 a cada letra del alfabeto. Se usa para calcular Camino de Vida, Expression, Soul y Personality Numbers.",
    tags: ["numerolog\u00eda", "historia"]
  },
  {
    id: "kybalion", title: "El Kybalion", author: "Tres Iniciados", year: "1908", type: "libro",
    description: "Siete principios herm\u00e9ticos que influyen en la filosof\u00eda occidental.",
    review: "Obra influyente en el pensamiento esot\u00e9rico moderno. Su atribuci\u00f3n hist\u00f3rica es cuestionable.",
    summary: "Enuncia siete principios: Mentalismo, Correspondencia, Vibraci\u00f3n, Polaridad, Ritmo, Causa y Efecto, y G\u00e9nero.",
    tags: ["hermetismo", "filosof\u00eda"]
  },
  {
    id: "zodiaco-chino", title: "Zodiaco Chino", author: "Tradicional", year: "~2000 a.C.", type: "sitio",
    description: "Ciclo de 12 animales y 5 elementos basado en el calendario lunar chino.",
    review: "Sistema cultural genuino con ra\u00edces en la dinast\u00eda Han. Documentaci\u00f3n hist\u00f3rica s\u00f3lida.",
    summary: "El ciclo sexagenario combina 12 animales con 5 elementos creando 60 combinaciones.",
    link: "https://www.chinahighlights.com/travelguide/chinese-zodiac/",
    tags: ["zodiaco chino", "animales"]
  },
  {
    id: "astrologia", title: "Astrolog\u00eda Tropical", author: "Tradicional", year: "~300 a.C.", type: "libro",
    description: "Sistema de 12 signos basados en la posici\u00f3n del sol en el zod\u00edaco.",
    review: "Codificada por astr\u00f3logos helen\u00edsticos a partir de la tradici\u00f3n babil\u00f3nica. Sistema m\u00e1s utilizado en occidente.",
    summary: "Asocia la posici\u00f3n del sol con 12 signos zodiacales. Cada signo tiene un elemento y una modalidad.",
    tags: ["astrolog\u00eda", "signos"]
  },
  {
    id: "i-ching", title: "I Ching", author: "Tradicional", year: "~1000 a.C.", type: "libro",
    description: "Libro de las mutaciones. Base filos\u00f3fica del zodiaco chino y la adivinaci\u00f3n.",
    review: "Uno de los textos filos\u00f3ficos m\u00e1s antiguos del mundo. Jung lo estudi\u00f3 extensamente.",
    summary: "Utiliza 64 hexagramas para representar situaciones y transiciones. Su valor est\u00e1 en la reflexi\u00f3n.",
    tags: ["i ching", "filosof\u00eda"]
  },
  {
    id: "tarot-waite", title: "The Pictorial Key to the Tarot", author: "Arthur Edward Waite", year: "1910", type: "libro",
    description: "Gu\u00eda cl\u00e1sica de los Arcanos Mayores y Menores del Tarot.",
    review: "Waite cre\u00f3 el mazo m\u00e1s utilizado del mundo. Obra fundamental para entender el tarot moderno.",
    summary: "Describe los 78 arcanos del tarot. Cada carta tiene un significado simb\u00f3lico vinculado con la vida humana.",
    tags: ["tarot", "simbolismo"]
  },
  {
    id: "human-design", title: "Human Design", author: "Ra Uru Hu", year: "1987", type: "sitio",
    description: "Sistema que combina astrolog\u00eda, I Ching, chakras y Kabbalah.",
    review: "Creado en 1987. Combina m\u00faltiples sistemas. No tiene respaldo cient\u00edfico pero tiene comunidad activa.",
    summary: "Define 5 tipos de energ\u00eda basados en la posici\u00f3n de los planetas y el I Ching.",
    link: "https://www.jovianarchive.com",
    tags: ["human design", "energ\u00eda"]
  },
  {
    id: "eneagrama", title: "The Enneagram", author: "Don Richard Riso", year: "1987", type: "libro",
    description: "Tipolog\u00eda de 9 personalidades con ra\u00edces en tradiciones espirituales.",
    review: "Sistema de tipolog\u00eda con 9 tipos. Funciona mejor como herramienta de autoconocimiento que como ciencia.",
    summary: "Los 9 tipos representan motivaciones centrales: Perfeccionista, Ayudador, Triunfador, etc.",
    tags: ["eneagrama", "personalidad"]
  },
  {
    id: "kabbalah", title: "La Kabbalah", author: "Tradicional", year: "~1200", type: "libro",
    description: "\u00c1rbol de la vida y sistema m\u00edstico jud\u00edo.",
    review: "Sistema m\u00edstico con siglos de tradici\u00f3n. Su uso popular tiene poco que ver con la tradici\u00f3n original.",
    summary: "El \u00c1rbol de la Vida tiene 10 sefirot conectados por 22 caminos. Se usa para meditaci\u00f3n y comprensi\u00f3n.",
    tags: ["kabbalah", "misticismo"]
  },
  {
    id: "gene-keys", title: "Gene Keys", author: "Richard Rudd", year: "2009", type: "libro",
    description: "Sistema de 64 hexagramas como dones y sombras.",
    review: "Toma los 64 hexagramas del I Ching y los vincula con el ADN. Creativo pero sin base cient\u00edfica.",
    summary: "Cada hexagrama tiene una Sombra, un D\u00f3n y una Sidhi. Se mapea a la fecha de nacimiento.",
    tags: ["gene keys", "codigo"]
  },
  {
    id: "astrologia-moderna", title: "Astrolog\u00eda Moderna", author: "Stephen Arroyo", year: "1975", type: "libro",
    description: "Enfoque psicol\u00f3gico y humanista de la astrolog\u00eda.",
    review: "Pionero en reencuadrar la astrolog\u00eda como herramienta psicol\u00f3gica. Enfoque m\u00e1s honesto.",
    summary: "Los signos, planetas y aspectos se interpretan como energ\u00edas psicol\u00f3gicas, no como destinos.",
    tags: ["astrolog\u00eda", "psicolog\u00eda"]
  },
  {
    id: "numerologia-caldaica", title: "Numerolog\u00eda Caldea", author: "Tradicional", year: "~500 a.C.", type: "articulo",
    description: "Sistema de numerolog\u00eda basado en valores num\u00e9ricos de las letras del alfabeto caldeo.",
    review: "Anterior a la pitag\u00f3rica. Usa un alfabeto diferente con valores distintos.",
    summary: "Asigna valores del 1 al 8 al alfabeto caldeo. Origen babil\u00f3nico.",
    tags: ["numerolog\u00eda", "caldeo"]
  }
];

const TYPE_META = {
  libro: { label: "Libro", color: "#D4A843" },
  articulo: { label: "Art\u00edculo", color: "#4A5568" },
  video: { label: "Video", color: "#6B4C7A" },
  sitio: { label: "Sitio web", color: "#2D5A3D" },
};

export default function BibliotecaPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("todos");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    SOURCES.forEach(s => s.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, []);

  const filtered = useMemo(() => {
    return SOURCES.filter(s => {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                           s.author.toLowerCase().includes(search.toLowerCase()) ||
                           (s.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchFilter = filter === "todos" || s.type === filter;
      const matchTag = !activeTag || (s.tags || []).includes(activeTag);
      return matchSearch && matchFilter && matchTag;
    });
  }, [search, filter, activeTag]);

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">

        {/* Hero — editorial, outside cards */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-4">Biblioteca</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Fuentes y referencias
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Colecci&oacute;n curada de libros, art&iacute;culos y recursos que nutren el conocimiento simb&oacute;lico de Molino.
          </p>
        </motion.section>

        {/* Search + Filters */}
        <motion.section {...fadeUpDelayed(0.05)} className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input type="text" placeholder="Buscar por t&iacute;tulo, autor o etiqueta..." value={search} onChange={(e) => setSearch(e.target.value)} className="input flex-1" aria-label="Buscar fuentes" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input" aria-label="Filtrar por tipo">
              <option value="todos">Todos los tipos</option>
              <option value="libro">Libros</option>
              <option value="articulo">Art&iacute;culos</option>
              <option value="video">Videos</option>
              <option value="sitio">Sitios web</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveTag(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!activeTag ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted hover:text-foreground"}`}>
              Todos
            </button>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeTag === tag ? "bg-accent text-accent-foreground" : "bg-background border border-border text-muted hover:text-foreground"}`}>
                #{tag}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Section divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-border" aria-hidden="true" />
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">{filtered.length} fuentes</h2>
        </div>

        {/* Sources grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((source, i) => {
            const meta = TYPE_META[source.type];
            return (
              <motion.div key={source.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ delay: i * 0.03, duration: 0.35 }} className="p-5 rounded-xl border border-border bg-card flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-serif text-base font-semibold text-foreground truncate">{source.title}</h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${meta.color}15`, color: meta.color }}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-muted mb-2">{source.author} &middot; {source.year}</p>
                <p className="text-sm text-muted mb-3 flex-1">{source.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(source.tags || []).map(tag => (
                    <span key={tag} className="text-[10px] bg-background border border-border rounded-full px-2 py-0.5 text-muted">#{tag}</span>
                  ))}
                </div>
                {/* Button */}
                {(source.review || source.summary) && (
                  <div className="mt-auto pt-3 border-t border-border">
                    <button type="button" onClick={() => setExpandedDescription(expandedDescription === source.id ? null : source.id)} className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all min-h-[40px] ${expandedDescription === source.id ? "bg-accent text-accent-foreground" : "bg-background border border-border text-muted hover:text-foreground hover:border-accent"}`}>
                      Descripci&oacute;n
                    </button>
                  </div>
                )}
                {/* Expandable content */}
                {expandedDescription === source.id && (source.review || source.summary) && (
                  <div className="mt-3 p-3 rounded-lg bg-background border border-border space-y-3">
                    {source.summary && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">M&eacute;todo</p>
                        <p className="text-xs text-muted leading-relaxed">{source.summary}</p>
                      </div>
                    )}
                    {source.review && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">Rese&ntilde;a</p>
                        <p className="text-xs text-muted leading-relaxed">{source.review}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-lg">No se encontraron fuentes</p>
            <p className="text-sm mt-2">Prob&aacute; con otra b&uacute;squeda o filtro.</p>
          </div>
        )}

      </main>

      <UniversityFooter />
    </div>
  );
}
