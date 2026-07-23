"use client";

import { useState, useMemo } from "react";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

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
    id: "gg33",
    title: "GG33 Numerología",
    author: "Gary Grinberg",
    year: "2020",
    type: "sitio",
    description: "Sistema de numerología basado en patrones numéricos y astrología china.",
    review: "GG33 es un enfoque contemporáneo que fusiona numerología occidental con astrología china. Grinberg argumenta que los números y los ciclos chinos están interconectados. Es una perspectiva original pero no es académica ni tiene respaldo científico.",
    summary: "El sistema GG33 asigna un número de \"código\" basado en la fecha de nacimiento y lo cruza con el zodiaco chino. Propone 9 \"tipos\" numéricos con cualidades específicas. Lo más interesante es la idea de que los números no son estáticos sino que se mueven en ciclos.",
    link: "https://gg33.com",
    tags: ["numerología", "gg33"]
  },
  {
    id: "pitagoras",
    title: "Numerología Pitagórica",
    author: "Pitágoras (atribuido)",
    year: "~500 a.C.",
    type: "libro",
    description: "Sistema de numerología occidental que asigna valores numéricos a las letras.",
    review: "La numerología pitagórica es el sistema más extendido en occidente. Aunque se atribuye a Pitágoras, los historiadores modernos no encuentran evidencia directa de que Pitágoras la practicara. Lo que sí sabemos es que su escuela filosófica valoraba los números como principios del universo.",
    summary: "Asigna valores del 1 al 9 a cada letra del alfabeto (A=1, B=2... I=9, J=1, etc.). Se usa para calcular Life Path, Expression, Soul y Personality Numbers. Es un sistema de interpretación simbólica, no matemática.",
    tags: ["numerología", "historia"]
  },
  {
    id: "kybalion",
    title: "El Kybalion",
    author: "Tres Iniciados",
    year: "1908",
    type: "libro",
    description: "Siete principios herméticos que influyen en la filosofía occidental.",
    review: "El Kybalion pretende ser una traducción de textos herméticos antiguos, aunque los historiadores creen que fue escrito por William Walker Atkinson. Es una obra influyente en el pensamiento esotérico moderno, pero su atribución histórica es cuestionable.",
    summary: "Enuncia siete principios: Mentalismo, Correspondencia, Vibración, Polaridad, Ritmo, Causa y Efecto, y Género. Cada principio describe una \"ley\" universal que, según el texto, gobierna la realidad.",
    tags: ["hermetismo", "filosofía"]
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    author: "Tradicional",
    year: "~2000 a.C.",
    type: "sitio",
    description: "Ciclo de 12 animales y 5 elementos basado en el calendario lunar chino.",
    review: "El zodiaco chino es un sistema cultural genuino con raíces en la dinastía Han. A diferencia de muchas tradiciones esotéricas, tiene una documentación histórica sólida. Su uso como herramienta de personalidad es más popular que académico.",
    summary: "El ciclo sexagenario combina 12 animales con 5 elementos (Madera, Fuego, Tierra, Metal, Agua) creando 60 combinaciones. Cada animal tiene cualidades tradicionales asignadas. El sistema se usa ampliamente en la cultura popular china.",
    link: "https://www.chinahighlights.com/travelguide/chinese-zodiac/",
    tags: ["zodiaco chino", "animales"]
  },
  {
    id: "astrologia",
    title: "Astrología Tropical",
    author: "Tradicional",
    year: "~300 a.C.",
    type: "libro",
    description: "Sistema de 12 signos basados en la posición del sol en el zodíaco.",
    review: "La astrología tropical fue codificada por los astrólogos helenísticos (Vetiśvāra, Teodosio) a partir de la tradición babilónica. Es el sistema más utilizado en occidente. Sus críticos señalan que los signos se han desplazado ~24° desde su codificación.",
    summary: "Asocia la posición del sol en el momento del nacimiento con 12 signos zodiacales. Cada signo tiene un elemento (Fuego, Tierra, Aire, Agua), una modalidad (Cardinal, Fijo, Mutable) y un planeta regente. Es interpretativo, no predictivo.",
    tags: ["astrología", "signos"]
  },
  {
    id: "i-ching",
    title: "I Ching",
    author: "Tradicional",
    year: "~1000 a.C.",
    type: "libro",
    description: "Libro de las mutaciones. Base filosófica del zodiaco chino y la adivinación.",
    review: "El I Ching es uno de los textos filosóficos más antiguos del mundo. Su influencia en la cultura china es comparable a la de la Biblia en occidente. Jung lo estudió extensamente y lo vinculó con la sincronicidad. No es un libro de predicción sino de reflexión.",
    summary: "Utiliza 64 hexagramas (combinaciones de líneas Yang/Yin) para representar situaciones y transiciones. Cada hexagrama tiene un significado filosófico y se \"consulta\" mediante monedas o varillas. Su valor está en la reflexión, no en la predicción.",
    tags: ["i ching", "filosofía"]
  },
  {
    id: "tarot-waite",
    title: "The Pictorial Key to the Tarot",
    author: "Arthur Edward Waite",
    year: "1910",
    type: "libro",
    description: "Guía clásica de los Arcanos Mayores y Menores del Tarot.",
    review: "Waite creó el mazo Rider-Waite-Smith, el más utilizado del mundo. Su libro explica la simbología de cada carta. Es una obra fundamental para entender el tarot moderno, aunque su enfoque es esotérico y no científico.",
    summary: "Describe los 78 arcanos del tarot (22 mayores + 56 menores). Cada carta tiene un significado simbólico vinculado con la vida humana. El mazo de Waite es el estándar para la interpretación en occidente.",
    tags: ["tarot", "simbolismo"]
  },
  {
    id: "human-design",
    title: "Human Design",
    author: "Ra Uru Hu",
    year: "1987",
    type: "sitio",
    description: "Sistema que combina astrología, I Ching, chakras y Kabbalah.",
    review: "Human Design fue creado por Ra Uru Hu (Alan Robert Krakower) en 1987. Combina múltiples sistemas en un marco unificado. No tiene respaldo científico y es puramente interpretativo, pero tiene una comunidad activa y un marco conceptual interno coherente.",
    summary: "Define 5 tipos de energía (Generador, Proyector, Manifestador, Generador Manifestante, Reflector) basados en la posición de los planetas. Usa el I Ching para definir \"centros\" energéticos inspirados en los chakras.",
    link: "https://www.jovianarchive.com",
    tags: ["human design", "energía"]
  },
  {
    id: "eneagrama",
    title: "The Enneagram",
    author: "Don Richard Riso",
    year: "1987",
    type: "libro",
    description: "Tipología de 9 personalidades con raíces en tradiciones espirituales.",
    review: "Riso y Hudson crearon un sistema de tipología de personalidad con 9 tipos, cada uno con miedos, deseos y patrones. Aunque tiene raíces en tradiciones espirituales, funciona mejor como herramienta de autoconocimiento que como ciencia.",
    summary: "Los 9 tipos representan motivaciones centrales: Perfeccionista, Ayudador, Triunfador, Individualista, Investigador, Lealista, Entusiasta, Desafiador, Pacificador. Cada tipo tiene wing, línea de integración y niveles de conciencia.",
    tags: ["eneagrama", "personalidad"]
  },
  {
    id: "kabbalah",
    title: "La Kabbalah",
    author: "Tradicional",
    year: "~1200",
    type: "libro",
    description: "Árbol de la vida y sistema místico judío.",
    review: "La Kabbalah es un sistema místico judío con siglos de tradición. Su uso popular (como la \"Kabbalah\" de Madonna) tiene poco que ver con la tradición original. El Árbol de la Vida es su herramienta central para comprender la realidad.",
    summary: "El Árbol de la Vida tiene 10 sefirot (atributos divinos) conectados por 22 caminos. Cada sefirah representa una cualidad: Keter (Corona), Chokmah (Sabiduría), Binah (Entendimiento), etc. Se usa para meditación y comprensión filosófica.",
    tags: ["kabbalah", "misticismo"]
  },
  {
    id: "gene-keys",
    title: "Gene Keys",
    author: "Richard Rudd",
    year: "2009",
    type: "libro",
    description: "Sistema de 64 hexagramas como dones y sombras.",
    review: "Rudd toma los 64 hexagramas del I Ching y los vincula con el ADN y la astrología. Es un sistema creativo pero sin base científica. Su valor está en el marco reflexivo que ofrece, no en sus afirmaciones biológicas.",
    summary: "Cada hexagrama tiene una Sombra (medio de expresión negativo), un Dón (cualidad positiva) y una Sidhi (virtud elevada). Se mapea a la fecha de nacimiento para revelar \"genes\" simbólicos.",
    tags: ["gene keys", "codigo"]
  },
  {
    id: "astrologia-moderna",
    title: "Astrología Moderna",
    author: "Stephen Arroyo",
    year: "1975",
    type: "libro",
    description: "Enfoque psicológico y humanista de la astrología.",
    review: "Arroyo fue pionero en reencuadrar la astrología como herramienta psicológica en vez de predictiva. Su enfoque es más honesto que el de la astrología popular y se acerca a lo que Molino intenta hacer: usar los sistemas como herramientas de reflexión.",
    summary: "Explica la astrología desde una perspectiva de crecimiento personal. Los signos, planetas y aspectos se interpretan como energías psicológicas, no como destinos. Es una de las mejores introducciones al enfoque moderno de la astrología.",
    tags: ["astrología", "psicología"]
  },
  {
    id: "numerologia-caldaica",
    title: "Numerología Caldea",
    author: "Tradicional",
    year: "~500 a.C.",
    type: "articulo",
    description: "Sistema de numerología basado en valores numéricos de las letras del alfabeto caldeo.",
    review: "La numerología caldea es anterior a la pitagórica. Usa un alfabeto diferente con valores distintos (A=1, B=2, I=10→1, J=10→1, etc.). Su origen es babilónico y está vinculado con la escritura cuneiforme.",
    summary: "Asigna valores del 1 al 8 al alfabeto caldeo (sin el 9). Se usaba para interpretar nombres y fechas. Aunque menos conocida que la pitagórica, tiene una tradición histórica más antigua.",
    tags: ["numerología", "caldeo"]
  }
];

const TYPE_META = {
  libro: { label: "Libro", icon: "📖", color: "#D4A843" },
  articulo: { label: "Artículo", icon: "📄", color: "#4A5568" },
  video: { label: "Video", icon: "🎥", color: "#6B4C7A" },
  sitio: { label: "Sitio web", icon: "🌐", color: "#2D5A3D" },
};

export default function BibliotecaPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("todos");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <div className="text-center mb-6">
              <span className="badge mb-3">📚 Biblioteca Pública</span>
              <h1 className="font-serif text-3xl font-bold text-foreground mt-3">Fuentes y referencias</h1>
              <p className="text-muted text-sm mt-2 max-w-md mx-auto">
                Colección curada de libros, artículos y recursos que nutren el conocimiento simbólico de Molino.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar por título, autor o etiqueta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input flex-1"
                aria-label="Buscar fuentes"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input"
                aria-label="Filtrar por tipo"
              >
                <option value="todos">Todos los tipos</option>
                <option value="libro">📖 Libros</option>
                <option value="articulo">📄 Artículos</option>
                <option value="video">🎥 Videos</option>
                <option value="sitio">🌐 Sitios web</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !activeTag ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted hover:text-foreground"
                }`}
              >
                Todos
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTag === tag ? "bg-accent text-accent-foreground" : "bg-background border border-border text-muted hover:text-foreground"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </Card>
        </Section>

        <Section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((source) => {
              const meta = TYPE_META[source.type];
              return (
                <Card key={source.id} hover padding="md">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{source.title}</h3>
                        <span
                          className="text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0"
                          style={{ background: `${meta.color}15`, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted mb-2">
                        {source.author} · {source.year}
                      </p>
                      <p className="text-sm text-muted mb-3">{source.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(source.tags || []).map(tag => (
                          <span key={tag} className="text-[10px] bg-background border border-border rounded-full px-2 py-0.5 text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {source.link && (
                        <a
                          href={source.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-accent hover:text-foreground transition-colors"
                        >
                          Ver fuente →
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    {source.review && (
                      <button
                        type="button"
                        onClick={() => setExpandedReview(expandedReview === source.id ? null : source.id)}
                        className={`flex-1 text-left px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                          expandedReview === source.id
                            ? "bg-accent text-accent-foreground"
                            : "bg-background border border-border text-muted hover:text-foreground hover:border-accent"
                        }`}
                      >
                        Leer Reseña
                      </button>
                    )}
                    {source.summary && (
                      <button
                        type="button"
                        onClick={() => setExpandedSummary(expandedSummary === source.id ? null : source.id)}
                        className={`flex-1 text-left px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                          expandedSummary === source.id
                            ? "bg-accent text-accent-foreground"
                            : "bg-background border border-border text-muted hover:text-foreground hover:border-accent"
                        }`}
                      >
                        Ver Resumen
                      </button>
                    )}
                  </div>
                  {/* Expandable Review */}
                  {expandedReview === source.id && source.review && (
                    <div className="mt-3 p-3 rounded-lg bg-background border border-border">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">Reseña</p>
                      <p className="text-xs text-muted leading-relaxed">{source.review}</p>
                    </div>
                  )}
                  {/* Expandable Summary */}
                  {expandedSummary === source.id && source.summary && (
                    <div className="mt-3 p-3 rounded-lg bg-background border border-border">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">Resumen</p>
                      <p className="text-xs text-muted leading-relaxed">{source.summary}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted">
              <p className="text-lg">No se encontraron fuentes</p>
              <p className="text-sm mt-2">Probá con otra búsqueda o filtro.</p>
            </div>
          )}
        </Section>

        <Section className="mt-8">
          <Card hover={false}>
            <div className="text-center">
              <p className="text-sm text-muted">
                📢 ¿Conocés una fuente relevante?
              </p>
              <Button variant="secondary" className="mt-3" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  Contribuir en GitHub
                </a>
              </Button>
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
