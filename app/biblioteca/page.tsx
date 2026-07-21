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
    tags: ["numerología", "historia"]
  },
  {
    id: "kybalion",
    title: "El Kybalion",
    author: "Tres Iniciados",
    year: "1908",
    type: "libro",
    description: "Siete principios herméticos que influyen en la filosofía occidental.",
    tags: ["hermetismo", "filosofía"]
  },
  {
    id: "zodiaco-chino",
    title: "Zodiaco Chino",
    author: "Tradicional",
    year: "~2000 a.C.",
    type: "sitio",
    description: "Ciclo de 12 animales y 5 elementos basado en el calendario lunar chino.",
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
    tags: ["astrología", "signos"]
  },
  {
    id: "i-ching",
    title: "I Ching",
    author: "Tradicional",
    year: "~1000 a.C.",
    type: "libro",
    description: "Libro de las mutaciones. Base filosófica del zodiaco chino y la adivinación.",
    tags: ["i ching", "filosofía"]
  },
  {
    id: "tarot-waite",
    title: "The Pictorial Key to the Tarot",
    author: "Arthur Edward Waite",
    year: "1910",
    type: "libro",
    description: "Guía clásica de los Arcanos Mayores y Menores del Tarot.",
    tags: ["tarot", "simbolismo"]
  },
  {
    id: "human-design",
    title: "Human Design",
    author: "Ra Uru Hu",
    year: "1987",
    type: "sitio",
    description: "Sistema que combina astrología, I Ching, chakras y Kabbalah.",
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
    tags: ["eneagrama", "personalidad"]
  },
  {
    id: "kabbalah",
    title: "La Kabbalah",
    author: "Tradicional",
    year: "~1200",
    type: "libro",
    description: "Árbol de la vida y sistema místico judío.",
    tags: ["kabbalah", "misticismo"]
  },
  {
    id: "gene-keys",
    title: "Gene Keys",
    author: "Richard Rudd",
    year: "2009",
    type: "libro",
    description: "Sistema de 64 hexagramas como dones y sombras.",
    tags: ["gene keys", "codigo"]
  },
  {
    id: "astrologia-moderna",
    title: "Astrología Moderna",
    author: "Stephen Arroyo",
    year: "1975",
    type: "libro",
    description: "Enfoque psicológico y humanista de la astrología.",
    tags: ["astrología", "psicología"]
  },
  {
    id: "numerologia-caldaica",
    title: "Numerología Caldea",
    author: "Tradicional",
    year: "~500 a.C.",
    type: "articulo",
    description: "Sistema de numerología basado en valores numéricos de las letras del alfabeto caldeo.",
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
