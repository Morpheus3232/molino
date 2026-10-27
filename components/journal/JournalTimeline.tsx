"use client";
import { useL } from "@/lib/i18n/useL";

import RichText from "@/components/journal/RichText";
import { plainText } from "@/lib/journal/markdown";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { JournalEntry, JournalMood } from "@/types/journal";
import { MOOD_CONFIG } from "@/types/journal";
import JournalInsights from "@/components/journal/JournalInsights";
import { Search, Trash2, Edit2 } from "lucide-react";

// recharts is heavy; keep it out of the initial client bundle by loading the
// mood chart lazily (ssr:false). The rest of the timeline renders immediately.
const MoodChart = dynamic(() => import("@/components/journal/MoodChart"), {
  ssr: false,
  loading: () => <div className="w-full h-44 sm:h-52 animate-pulse bg-ink/5" aria-hidden="true" />,
});

interface JournalTimelineProps {
  entries: JournalEntry[];
  loading?: boolean;
  onEditEntry?: (entry: JournalEntry) => void;
  onDeleteEntry?: (id: string) => void;
  className?: string;
}

function formatDate(dateStr: string, tag = "es-AR"): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(tag, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function JournalTimeline({
  entries,
  loading = false,
  onEditEntry,
  onDeleteEntry,
  className = "",
}: JournalTimelineProps) {
  const L = useL();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<JournalMood | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    entries.forEach((e) => e.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (selectedMood && entry.mood !== selectedMood) return false;
      if (selectedTag && !entry.tags.includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchContent = plainText(entry.content).toLowerCase().includes(q);
        const matchTags = entry.tags.some((t) => t.toLowerCase().includes(q));
        const matchTheme = entry.cycleContext?.dayEnergy?.theme?.toLowerCase().includes(q);
        if (!matchContent && !matchTags && !matchTheme) return false;
      }
      return true;
    });
  }, [entries, selectedMood, selectedTag, searchQuery]);

  // Chart data (chronological asc)
  const chartData = useMemo(() => {
    const sortedAsc = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedAsc.map((e) => ({
      date: e.date,
      formattedDate: formatDate(e.date, L("es-AR", "en-US")),
      mood: e.mood,
      personalDay: e.cycleContext?.dayEnergy?.personalDay,
      theme: e.cycleContext?.dayEnergy?.theme,
    }));
  }, [entries]);

  // Estado de carga con esqueleto para evitar el destello de "vacío"
  if (loading) {
    return (
      <div className={`space-y-px ${className} animate-pulse`}>
        <div className="h-14 bg-ink/5" />
        <div className="h-44 bg-ink/5" />
        <div className="h-36 bg-ink/5" />
      </div>
    );
  }

  if (entries.length === 0) {
    return null;
  }

  const filtering = Boolean(selectedMood || selectedTag || searchQuery);

  return (
    <div className={className}>
      {/* Cómo vino el ánimo */}
      {chartData.length >= 2 && (
        <div className="border-t-2 border-ink pt-6 pb-10">
          <div className="flex items-baseline justify-between gap-3 mb-6">
            <h3 className="font-display font-normal text-3xl text-foreground">{L("Cómo vino el ánimo", "How your mood went")}</h3>
            <span className="text-base text-muted tabular-nums">{L(<>{chartData.length} páginas</>, <>{chartData.length} pages</>)}</span>
          </div>
          <div className="bg-background border border-ink/15 p-4 sm:p-6">
            <MoodChart chartData={chartData} />
          </div>
        </div>
      )}

      {/* Promedios por tema, luna y año: solo si hay algún patrón real */}
      <JournalInsights entries={entries} />

      {/* Buscar y filtrar */}
      <div className="border-t-2 border-ink pt-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder={L("Buscar en el diario", "Search the journal")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-background border-2 border-ink text-lg text-foreground placeholder:text-muted/70 focus:outline-none"
              aria-label={L("Buscar en las entradas del diario", "Search journal entries")}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-sm p-1"
                aria-label={L("Borrar búsqueda", "Clear search")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-base text-muted">{L("Ánimo", "Mood")}</span>
            <div className="grid grid-cols-5 gap-px bg-ink/15 border border-ink/15">
              {([1, 2, 3, 4, 5] as JournalMood[]).map((m) => {
                const cfg = MOOD_CONFIG[m];
                const active = selectedMood === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(active ? null : m)}
                    className={`w-11 h-11 flex items-center justify-center text-lg transition-colors ${
                      active ? "bg-ink text-paper" : "bg-background hover:bg-paper-alt"
                    }`}
                    title={L.t(cfg.label)}
                    aria-label={L(`Filtrar por estado de ánimo: ${cfg.label}`, `Filter by mood: ${L.t(cfg.label)}`)}
                    aria-pressed={active}
                  >
                    <span aria-hidden="true" className={active ? "" : "opacity-60"}>{L.t(cfg.emoji)}</span>
                  </button>
                );
              })}
            </div>
            {filtering && (
              <button
                type="button"
                onClick={() => {
                  setSelectedMood(null);
                  setSelectedTag(null);
                  setSearchQuery("");
                }}
                className="text-base text-foreground underline underline-offset-4 hover:no-underline"
              >{L("Limpiar", "Clear")}</button>
            )}
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-base text-muted mr-1">{L("Temas", "Topics")}</span>
            {allTags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(active ? null : tag)}
                  className={`px-3 py-1.5 text-sm transition-colors border ${
                    active ? "bg-ink text-paper border-ink" : "bg-background text-muted border-ink/25 hover:border-ink hover:text-foreground"
                  }`}
                  aria-pressed={active}
                  aria-label={L(`Filtrar por etiqueta ${tag}`, `Filter by tag ${L.t(tag)}`)}
                >
                  #{L.t(tag)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Las páginas: la fecha al margen, el texto a la derecha */}
      <div className="mt-8 border-t border-ink/15">
        {filteredEntries.length === 0 ? (
          <p className="py-12 text-lg text-muted">{L("Ninguna página coincide con esos filtros.", "No pages match those filters.")}</p>
        ) : (
          filteredEntries.map((entry) => {
            const moodCfg = MOOD_CONFIG[entry.mood];
            const cycle = entry.cycleContext;
            const d = new Date(entry.date + "T12:00:00");
            return (
              <article
                key={entry.id}
                aria-label={formatDate(entry.date, L("es-AR", "en-US"))}
                className="group grid grid-cols-1 md:grid-cols-[13rem_1fr] gap-x-10 gap-y-3 py-8 border-b border-ink/15"
              >
                <div>
                  <p className="font-display text-5xl leading-none text-foreground tabular-nums">{L.t(d.getDate())}</p>
                  <p className="mt-1 text-base text-foreground first-letter:uppercase">
                    {d.toLocaleDateString(L("es-AR", "en-US"), { weekday: "long" })}, {d.toLocaleDateString(L("es-AR", "en-US"), { month: "long", year: "numeric" })}
                  </p>
                  <p className="mt-2 text-base text-muted">
                    <span aria-hidden="true">{L.t(moodCfg.emoji)}</span> {L.t(moodCfg.label.toLowerCase())}
                  </p>
                </div>

                <div className="min-w-0">
                  <RichText text={entry.content} className="text-lg sm:text-xl text-foreground leading-relaxed max-w-3xl font-serif" />

                  {entry.tags && entry.tags.length > 0 && (
                    <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-base text-muted">
                      {entry.tags.map((t) => (
                        <span key={t}>#{L.t(t)}</span>
                      ))}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    {cycle && (cycle.dayEnergy || cycle.yearCycle) ? (
                      <p className="text-sm text-muted">
                        {L.t([
                          cycle.dayEnergy?.personalDay && L(`Día personal ${cycle.dayEnergy.personalDay}`, `Personal day ${L.t(cycle.dayEnergy.personalDay)}`),
                          cycle.dayEnergy?.theme,
                          cycle.dayEnergy?.moonPhase && `luna ${cycle.dayEnergy.moonPhase.toLowerCase().replace(/^luna\s+/, "")}`,
                          cycle.yearCycle?.personalYear && L(`año ${cycle.yearCycle.personalYear}`, `year ${cycle.yearCycle.personalYear}`),
                        ]
                          .filter(Boolean).map(L.t)
                          .join(" · "))}
                      </p>
                    ) : (
                      <span />
                    )}
                    <div className="flex items-center gap-5 text-sm">
                      {onEditEntry && (
                        <button
                          type="button"
                          onClick={() => onEditEntry(entry)}
                          className="inline-flex items-center gap-1.5 text-muted hover:text-foreground underline-offset-4 hover:underline min-h-[36px]"
                          aria-label={L("Corregir esta página", "Correct this page")}
                        >
                          <Edit2 className="w-3.5 h-3.5" /> {L(" Corregir", " Correct")}
                        </button>
                      )}
                      {onDeleteEntry && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(L("¿Seguro que querés eliminar esta entrada?", "Are you sure you want to delete this entry?"))) {
                              onDeleteEntry(entry.id);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-muted hover:text-foreground underline-offset-4 hover:underline min-h-[36px]"
                          aria-label={L("Borrar esta página", "Delete this page")}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> {L(" Borrar", " Delete")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
