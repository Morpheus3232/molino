"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, fadeUpDelayed } from "@/lib/utils/motion";
import UniversityFooter from "@/components/layout/UniversityFooter";
import SearchInput from "@/components/ui/SearchInput";
import Chip from "@/components/ui/Chip";

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
  category: string;
  era: "ancestral" | "moderno";
}

const CATEGORY_LABELS: Record<string, string> = {
  numerologia: "Numerología",
  astrologia: "Astrología",
  zodiaco: "Zodíaco chino",
  tarot: "Tarot y simbolismo",
  personalidad: "Sistemas de personalidad",
  filosofia: "Misticismo y filosofía",
};

const CATEGORY_ORDER = ["numerologia", "astrologia", "zodiaco", "tarot", "personalidad", "filosofia"];

const SOURCES: Source[] = [
  {
    id: "pitagoras",
    title: "Numerología Pitagórica",
    author: "Pitágoras (atribuido)",
    year: "~500 a.C.",
    type: "libro",
    category: "numerologia",
    era: "ancestral",
    description: "Sistema de numerología occidental que asigna valores numéricos a las letras.",
    review: "La numerología pitagórica es el sistema más utilizado en occidente. Aunque se atribuye a Pitágoras, los historiadores modernos no encuentran evidencia directa.",
    summary: "Asigna valores del 1 al 9 a cada letra del alfabeto. Se usa para calcular Camino de Vida, Expresión, Alma y Personalidad.",
    tags: ["numerología", "historia"],
  },
  {
    id: "numerologia-caldaica",
    title: "Numerología Caldea",
    author: "Tradicional",
    year: "~500 a.C.",
    type: "articulo",
    category: "numerologia",
    era: "ancestral",
    description: "Sistema de numerología basado en valores numéricos de las letras del alfabeto caldeo.",
    review: "Anterior a la pitagórica. Usa un alfabeto diferente con valores distintos.",
    summary: "Asigna valores del 1 al 8 al alfabeto caldeo. Origen babilónico.",
    tags: ["numerología", "caldeo"],
  },
  {
    id: "gg33",
    title: "GG33 Numerología",
    author: "Gary Grinberg",
    year: "2020",
    type: "sitio",
    category: "numerologia",
    era: "moderno",
    description: "Sistema de numerología basado en patrones numéricos y astrología china.",
    review: "GG33 es un enfoque contemporáneo que fusiona numerología occidental con astrología china. Grinberg argumenta que los números y los ciclos chinos están interconectados.",
    summary: "Asigna un número de código basado en la fecha de nacimiento y lo cruza con el zodiaco chino. Propone 9 tipos numéricos con cualidades específicas.",
    link: "https://gg33.com",
    tags: ["numerología", "gg33"],
  },
  {
    id: "astrologia",
    title: "Astrología Tropical",
    author: "Tradicional",
    year: "~300 a.C.",
    type: "libro",
    category: "astrologia",
    era: "ancestral",
    description: "Sistema de 12 signos basados en la posición del sol en el zodíaco.",
    review: "Codificada por astrólogos helenísticos a partir de la tradición babilónica. Sistema más utilizado en occidente.",
    summary: "Asocia la posición del sol con 12 signos zodiacales. Cada signo tiene un elemento y una modalidad.",
    tags: ["astrología", "signos"],
  },
  {
    id: "tetrabiblos",
    title: "Tetrabiblos",
    author: "Claudio Ptolomeo",
    year: "~150 d.C.",
    type: "libro",
    category: "astrologia",
    era: "ancestral",
    description: "Tratado fundamental de astrología occidental que estableció las bases del sistema de 12 signos, casas y aspectos planetarios.",
    review: "La obra astrológica más influyente de la historia. Ptolomeo sistematizó la astrología helenística en cuatro libros que definieron la práctica durante casi dos milenios.",
    summary: "Divide la astrología en cuatro partes: principios generales, predicciones universales, predicciones natales y predicciones por lugar de origen.",
    tags: ["astrología", "historia"],
  },
  {
    id: "astrologia-moderna",
    title: "Astrología Moderna",
    author: "Stephen Arroyo",
    year: "1975",
    type: "libro",
    category: "astrologia",
    era: "moderno",
    description: "Enfoque psicológico y humanista de la astrología.",
    review: "Pionero en reencuadrar la astrología como herramienta psicológica. Enfoque más honesto.",
    summary: "Los signos, planetas y aspectos se interpretan como energías psicológicas, no como destinos.",
    tags: ["astrología", "psicología"],
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    author: "Tradicional",
    year: "~2000 a.C.",
    type: "sitio",
    category: "zodiaco",
    era: "ancestral",
    description: "Ciclo de 12 animales y 5 elementos basado en el calendario lunar chino.",
    review: "Sistema cultural genuino con raíces en la dinastía Han. Documentación histórica sólida.",
    summary: "El ciclo sexagenario combina 12 animales con 5 elementos creando 60 combinaciones.",
    link: "https://www.chinahighlights.com/travelguide/chinese-zodiac/",
    tags: ["zodiaco chino", "animales"],
  },
  {
    id: "i-ching",
    title: "I Ching",
    author: "Tradicional",
    year: "~1000 a.C.",
    type: "libro",
    category: "filosofia",
    era: "ancestral",
    description: "Libro de las mutaciones. Base filosófica del zodiaco chino y la adivinación.",
    review: "Uno de los textos filosóficos más antiguos del mundo. Jung lo estudió extensamente.",
    summary: "Utiliza 64 hexagramas para representar situaciones y transiciones. Su valor está en la reflexión.",
    tags: ["i ching", "filosofía"],
  },
  {
    id: "kybalion",
    title: "El Kybalion",
    author: "Tres Iniciados",
    year: "1908",
    type: "libro",
    category: "filosofia",
    era: "ancestral",
    description: "Siete principios herméticos que influyen en la filosofía occidental.",
    review: "Obra influyente en el pensamiento esotérico moderno. Su atribución histórica es cuestionable.",
    summary: "Enuncia siete principios: Mentalismo, Correspondencia, Vibración, Polaridad, Ritmo, Causa y Efecto, y Género.",
    tags: ["hermetismo", "filosofía"],
  },
  {
    id: "kabbalah",
    title: "La Kabbalah",
    author: "Tradicional",
    year: "~1200",
    type: "libro",
    category: "filosofia",
    era: "ancestral",
    description: "Árbol de la vida y sistema místico judío.",
    review: "Sistema místico con siglos de tradición. Su uso popular tiene poco que ver con la tradición original.",
    summary: "El Árbol de la Vida tiene 10 sefirot conectados por 22 caminos. Se usa para meditación y comprensión.",
    tags: ["kabbalah", "misticismo"],
  },
  {
    id: "tarot-waite",
    title: "The Pictorial Key to the Tarot",
    author: "Arthur Edward Waite",
    year: "1910",
    type: "libro",
    category: "tarot",
    era: "ancestral",
    description: "Guía clásica de los Arcanos Mayores y Menores del Tarot.",
    review: "Waite creó el mazo más utilizado del mundo. Obra fundamental para entender el tarot moderno.",
    summary: "Describe los 78 arcanos del tarot. Cada carta tiene un significado simbólico vinculado con la vida humana.",
    tags: ["tarot", "simbolismo"],
  },
  {
    id: "tarot-bohemians",
    title: "The Tarot of the Bohemians",
    author: "Papus",
    year: "1889",
    type: "libro",
    category: "tarot",
    era: "ancestral",
    description: "Tratado esotérico que vincula el tarot con la cábala, la numerología y la alquimia.",
    review: "Papus sistematizó las correspondencias entre el tarot y otros sistemas simbólicos, creando una obra de referencia para el tarot esotérico.",
    summary: "Establece las correspondencias entre los 22 Arcanos Mayores y las letras hebreas, los caminos del Árbol de la Vida y los signos zodiacales.",
    tags: ["tarot", "simbolismo"],
  },
  {
    id: "eneagrama",
    title: "The Enneagram",
    author: "Don Richard Riso",
    year: "1987",
    type: "libro",
    category: "personalidad",
    era: "ancestral",
    description: "Tipología de 9 personalidades con raíces en tradiciones espirituales.",
    review: "Sistema de tipología con 9 tipos. Funciona mejor como herramienta de autoconocimiento que como ciencia.",
    summary: "Los 9 tipos representan motivaciones centrales: Perfeccionista, Ayudador, Triunfador, etc.",
    tags: ["eneagrama", "personalidad"],
  },
  {
    id: "human-design",
    title: "Human Design",
    author: "Ra Uru Hu",
    year: "1987",
    type: "sitio",
    category: "personalidad",
    era: "moderno",
    description: "Sistema que combina astrología, I Ching, chakras y Kabbalah.",
    review: "Creado en 1987. Combina múltiples sistemas. No tiene respaldo científico pero tiene comunidad activa.",
    summary: "Define 5 tipos de energía basados en la posición de los planetas y el I Ching.",
    link: "https://www.jovianarchive.com",
    tags: ["human design", "energía"],
  },
  {
    id: "gene-keys",
    title: "Gene Keys",
    author: "Richard Rudd",
    year: "2009",
    type: "libro",
    category: "personalidad",
    era: "moderno",
    description: "Sistema de 64 hexagramas como dones y sombras.",
    review: "Toma los 64 hexagramas del I Ching y los vincula con el ADN. Creativo pero sin base científica.",
    summary: "Cada hexagrama tiene una Sombra, un Don y una Sidhi. Se mapea a la fecha de nacimiento.",
    tags: ["gene keys", "codigo"],
  },
];

const TYPE_META = {
  libro: { label: "Libro", color: "#D4A843" },
  articulo: { label: "Artículo", color: "#4A5568" },
  video: { label: "Video", color: "#6B4C7A" },
  sitio: { label: "Sitio web", color: "#2D5A3D" },
};

export default function BibliotecaContent() {
  const router = useRouter();
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
    const groups: Record<string, Source[]> = {};
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

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
        {/* Hero */}
        <motion.section {...fadeUp} className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted font-medium mb-4">Biblioteca</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05]">
            Fuentes y referencias
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-xl leading-relaxed">
            Colección curada de libros, artículos y recursos que nutren el conocimiento simbólico de Molino.
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
                  <h2 className="text-xs uppercase tracking-[0.25em] text-muted font-medium">
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
                          <h3 className="font-display text-sm text-foreground">{source.title}</h3>
                          <span
                            className="font-mono text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 shrink-0"
                            style={{ background: `${meta.color}15`, color: meta.color }}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted mb-2">{source.author} · {source.year}</p>

                        {/* Era badge */}
                        <span
                          className={`self-start font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 mb-3 ${
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
                              className="font-mono text-[9px] tracking-wider uppercase bg-background border border-ink/10 px-2 py-0.5 text-muted"
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
                                  ? "bg-accent text-white"
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
                                <p className="font-mono text-[9px] font-semibold tracking-wider uppercase text-muted mb-1">
                                  Método
                                </p>
                                <p className="text-xs text-muted leading-relaxed">{source.summary}</p>
                              </div>
                            )}
                            {source.review && (
                              <div>
                                <p className="font-mono text-[9px] font-semibold tracking-wider uppercase text-muted mb-1">
                                  Reseña
                                </p>
                                <p className="text-xs text-muted leading-relaxed">{source.review}</p>
                              </div>
                            )}
                          </div>
                        )}
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
            <p className="eyebrow-brutalist mb-4">Sin fuentes</p>
            <p className="text-sm text-muted mb-6 max-w-md mx-auto">
              No se encontraron fuentes para los filtros seleccionados.
            </p>
          </motion.div>
        )}
      </main>

      <UniversityFooter />
    </div>
  );
}
