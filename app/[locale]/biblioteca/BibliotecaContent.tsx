"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useState, useMemo } from "react";
import { Link } from "@/lib/i18n/navigation";
import SearchInput from "@/components/ui/SearchInput";
import { PageHero, KnowledgeSection, CONTAINER } from "@/components/knowledge/Kit";
import {
  SOURCES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type BibliotecaSource,
} from "@/lib/data/biblioteca-content";

export const TYPE_META = {
  libro: { label: "Libro", color: "#626262" },
  articulo: { label: "Artículo", color: "#666666" },
  video: { label: "Video", color: "#6D6D6D" },
  sitio: { label: "Sitio web", color: "#6C6C6C" },
};

const CONTEXT_PATHS = (L: Pick2) => ([
  {
    title: L("Numerología & Camino de Vida", "Numerology & Life Path"),
    desc: L("Para entender la reducción pitagórica, los Números Maestros y la estructura vibratoria del tiempo.", "To understand Pythagorean reduction, the Master Numbers and the vibrational structure of time."),
    authors: L("Pitágoras · Numerología Caldea", "Pythagoras · Chaldean Numerology"),
    tag: "numerología",
  },
  {
    title: L("Astrología Psicológica & Elementos", "Psychological Astrology & Elements"),
    desc: L("Para profundizar en la interacción entre los cuatro elementos y las polaridades solares sin determinismo.", "To go deeper into the interplay between the four elements and the solar polarities, without determinism."),
    authors: "Stephen Arroyo · Dane Rudhyar · Liz Greene",
    tag: "psicología",
  },
  {
    title: L("Arquetipos & Sincronicidad", "Archetypes & Synchronicity"),
    desc: L("Para explorar la teoría del inconsciente colectivo y por qué los símbolos resuenan en la psique humana.", "To explore the theory of the collective unconscious and why symbols resonate in the human psyche."),
    authors: "Carl G. Jung",
    tag: "arquetipos",
  },
  {
    title: L("Ciclo Sexagenario & Zodíaco Chino", "Sexagenary Cycle & Chinese Zodiac"),
    desc: L("Para estudiar los ritmos lunares, las 12 ramas terrestres y la armonía de los cinco elementos orientales.", "To study the lunar rhythms, the 12 earthly branches and the harmony of the five Eastern elements."),
    authors: L("Zodiaco Chino Tradicional · I Ching", "Traditional Chinese Zodiac · I Ching"),
    tag: "zodiaco chino",
  },
]);

export default function BibliotecaContent() {
  const L = useL();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    const groups: Record<string, BibliotecaSource[]> = {};
    CATEGORY_ORDER.forEach((cat) => (groups[cat] = []));
    filtered.forEach((s) => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [filtered]);

  const hasAnyResults = Object.values(grouped).some((g) => g.length > 0);

  const pickTag = (tag: string) => {
    setActiveTag(tag);
    document.getElementById("biblioteca-obras")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main id="main-content" className="bg-background">
      <PageHero
        crumbs={[{ href: "/", label: L("Inicio", "Home") }, { label: L("Biblioteca", "Library") }]}
        eyebrow={L(`Biblioteca · ${SOURCES.length} obras`, `Library · ${SOURCES.length} works`)}
        title={L("De dónde sale cada lectura", "Where each reading comes from")}
        lead={L("Las obras y corrientes detrás de los tres sistemas que usa Molino: numerología pitagórica, astrología solar y zodíaco chino.", "The works and schools of thought behind the three systems Molino uses: Pythagorean numerology, sun-sign astrology and the Chinese zodiac.")}
        imageKey="biblioteca/hub"
      />

      <KnowledgeSection
        label={L("Por dónde empezar", "Where to start")}
        title={L("Cuatro caminos de lectura", "Four reading paths")}
        intro={L("Elegí un tema y la biblioteca se filtra a las obras que lo sostienen.", "Pick a topic and the library narrows to the works behind it.")}
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/15 border border-ink/15">
          {CONTEXT_PATHS(L).map((item) => (
            <li key={item.title} className="bg-background">
              <button
                type="button"
                onClick={() => pickTag(item.tag)}
                className="group w-full h-full text-left p-7 sm:p-9 hover:bg-paper-alt/70 transition-colors flex flex-col"
              >{L(<>
                <span className="font-display text-3xl leading-tight text-foreground group-hover:underline underline-offset-[5px]">{L.t(item.title)}</span>
                <span className="mt-3 text-lg text-foreground/80 leading-relaxed flex-1">{L.t(item.desc)}</span>
                <span className="mt-5 text-base text-muted">{L.t(item.authors)}</span>
                <span className="mt-4 text-base text-foreground underline underline-offset-4">Ver las obras</span>
              </>, <><span className="font-display text-3xl leading-tight text-foreground group-hover:underline underline-offset-[5px]">{L.t(item.title)}</span><span className="mt-3 text-lg text-foreground/80 leading-relaxed flex-1">{L.t(item.desc)}</span><span className="mt-5 text-base text-muted">{L.t(item.authors)}</span><span className="mt-4 text-base text-foreground underline underline-offset-4">See the works</span></>)}</button>
            </li>
          ))}
        </ul>
      </KnowledgeSection>

      <section id="biblioteca-obras" className="bg-background scroll-mt-20">
        <div className={`${CONTAINER} py-16 sm:py-24`}>
          <p className="text-sm text-muted mb-3 label-caps">{L("Las obras", "The works")}</p>
          <h2 className="section-title text-foreground">{L("Todo el catálogo", "The full catalog")}</h2>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-5 items-start">
            <div className="lg:col-span-5">
              <SearchInput
                id="biblioteca-search"
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder={L("Título, autor o tema", "Title, author or topic")}
                label={L("Buscar en la biblioteca", "Search the library")}
              />
            </div>
            <div className="lg:col-span-7 flex flex-wrap gap-x-5 gap-y-2 text-base" role="group" aria-label={L("Filtrar por tema", "Filter by topic")}>
              {[null, ...allTags].map((tag) => {
                const on = activeTag === tag;
                return (
                  <button
                    key={tag ?? "todas"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActiveTag(on && tag ? null : tag)}
                    className={`py-1 border-b-2 transition-colors ${on ? "border-ink text-foreground" : "border-transparent text-muted hover:text-foreground"}`}
                  >
                    {L.t(tag ?? L("Todas", "All"))}
                  </button>
                );
              })}
            </div>
          </div>

          {hasAnyResults ? (
            CATEGORY_ORDER.map((catKey) => {
              const sources = grouped[catKey];
              if (sources.length === 0) return null;
              return (
                <section key={catKey} className="mt-14" aria-labelledby={`cat-${catKey}`}>
                  <h3 id={`cat-${catKey}`} className="flex items-baseline justify-between border-b-2 border-ink pb-3">
                    <span className="font-display text-3xl text-foreground">{L.t(CATEGORY_LABELS[catKey])}</span>
                    <span className="text-base text-muted tabular-nums">{sources.length}</span>
                  </h3>
                  <ul className="divide-y divide-ink/15">
                    {sources.map((source) => {
                      const meta = TYPE_META[source.type as keyof typeof TYPE_META] || TYPE_META.libro;
                      return (
                        <li key={source.id}>
                          <Link
                            href={`/biblioteca/${source.slug}`}
                            className="group grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-10 gap-y-2 py-6 hover:bg-paper-alt/50 transition-colors"
                          >
                            <span>
                              <span className="block font-display text-2xl leading-tight text-foreground group-hover:underline underline-offset-4">
                                {L.t(source.title)}
                              </span>
                              <span className="mt-1 block text-base text-muted">
                                {L.t(source.author)}
                                {source.year ? `, ${source.year}` : ""} · {L.t(meta.label)}
                              </span>
                            </span>
                            <span className="text-lg text-foreground/80 leading-relaxed">{L.t(source.description)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })
          ) : (
            <p className="mt-14 text-lg text-muted">
              {L("No hay obras con ese filtro.", "No works match that filter.")}{" "}
              <button type="button" onClick={() => { setActiveTag(null); setSearchQuery(""); }} className="underline underline-offset-4 text-foreground">{L("Ver todas", "See all")}</button>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
