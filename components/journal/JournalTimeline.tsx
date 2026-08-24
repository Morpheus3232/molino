"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { JournalEntry, JournalMood } from "@/types/journal";
import { MOOD_CONFIG } from "@/types/journal";
import JournalInsights from "@/components/journal/JournalInsights";
import { Search, Tag, Trash2, Edit2, Compass, TrendingUp, ChevronDown } from "lucide-react";

// recharts is heavy; keep it out of the initial client bundle by loading the
// mood chart lazily (ssr:false). The rest of the timeline renders immediately.
const MoodChart = dynamic(() => import("@/components/journal/MoodChart"), {
  ssr: false,
  loading: () => <div className="w-full h-44 sm:h-52 animate-pulse bg-card border border-ink/10 rounded-xl" aria-hidden="true" />,
});

interface JournalTimelineProps {
  entries: JournalEntry[];
  loading?: boolean;
  onEditEntry?: (entry: JournalEntry) => void;
  onDeleteEntry?: (id: string) => void;
  className?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-AR", {
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
        const matchContent = entry.content.toLowerCase().includes(q);
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
      formattedDate: formatDate(e.date),
      mood: e.mood,
      personalDay: e.cycleContext?.dayEnergy?.personalDay,
      theme: e.cycleContext?.dayEnergy?.theme,
    }));
  }, [entries]);

  // Estado de carga con Skeleton para evitar flash de "vacío"
  if (loading) {
    return (
      <div className={`space-y-4 ${className} animate-pulse`}>
        <div className="h-14 rounded-xl bg-card border border-ink/10" />
        <div className="h-44 rounded-xl bg-card border border-ink/10" />
        <div className="h-36 rounded-xl bg-card border border-ink/10" />
      </div>
    );
  }

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Mood vs Time Chart Card */}
      {chartData.length >= 2 && (
        <div className="rounded-xl border border-ink/10 bg-card p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">
                Evolución de Energía & Estado de Ánimo
              </h3>
            </div>
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
              {chartData.length} registros
            </span>
          </div>

          <MoodChart chartData={chartData} />
        </div>
      )}

      {/* Insights — promedios de mood agrupados, solo si hay al menos un
          patrón real (≥2 entradas en algún grupo) */}
      <JournalInsights entries={entries} />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-card border border-ink/10">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            type="text"
            placeholder="Buscar por palabra, tag o energía..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-background border border-ink/10 text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus-visible:ring-1 focus-visible:ring-accent"
            aria-label="Buscar en las entradas del journal"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded p-0.5"
              aria-label="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Mood & Tag Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mood filter pills */}
          {([1, 2, 3, 4, 5] as JournalMood[]).map((m) => {
            const cfg = MOOD_CONFIG[m];
            const active = selectedMood === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMood(active ? null : m)}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  active
                    ? "border-accent bg-accent/20 text-accent font-bold"
                    : "border-ink/10 bg-background text-muted hover:text-foreground"
                }`}
                title={cfg.label}
                aria-label={`Filtrar por estado de ánimo: ${cfg.label}`}
                aria-pressed={active}
              >
                {cfg.emoji}
              </button>
            );
          })}

          {/* Clear filters button */}
          {(selectedMood || selectedTag || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedMood(null);
                setSelectedTag(null);
                setSearchQuery("");
              }}
              className="px-2.5 py-1 text-[11px] font-mono text-accent hover:underline ml-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tag filter pills if tags exist */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap px-1">
          <span className="text-[11px] font-mono text-muted flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3" /> Tags:
          </span>
          {allTags.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(active ? null : tag)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  active
                    ? "bg-accent text-background font-bold border-accent"
                    : "bg-card text-muted border-ink/10 hover:border-ink/20 hover:text-foreground"
                }`}
                aria-pressed={active}
                aria-label={`Filtrar por etiqueta ${tag}`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/15 p-8 text-center text-xs text-muted font-mono">
            No se encontraron entradas con los filtros seleccionados.
          </div>
        ) : (
          filteredEntries.map((entry, index) => {
            const moodCfg = MOOD_CONFIG[entry.mood];
            const cycle = entry.cycleContext;

            return (
              <motion.article
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0, margin: "50px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25), ease: [0.25, 0.46, 0.45, 0.94] }}
                className="rounded-xl border border-ink/10 bg-card p-5 sm:p-6 hover:border-ink/20 transition-colors flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Mood + Date + Actions */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-ink/5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold border"
                        style={{
                          backgroundColor: moodCfg.bg,
                          color: moodCfg.color,
                          borderColor: moodCfg.border,
                        }}
                      >
                        <span className="text-sm">{moodCfg.emoji}</span>
                        <span>{moodCfg.label}</span>
                      </span>

                      <span className="font-mono text-xs text-muted">
                        {formatDate(entry.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {onEditEntry && (
                        <button
                          type="button"
                          onClick={() => onEditEntry(entry)}
                          className="p-1.5 text-muted hover:text-foreground rounded-md hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                          aria-label="Editar entrada"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteEntry && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("¿Seguro que querés eliminar esta entrada?")) {
                              onDeleteEntry(entry.id);
                            }
                          }}
                          className="p-1.5 text-muted hover:text-red-400 rounded-md hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition-colors"
                          aria-label="Eliminar entrada"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Content — truncado con toggle de expandir */}
                  <div className="my-4 text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {entry.content}
                  </div>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[11px] text-muted bg-background border border-ink/10 px-2 py-0.5 rounded-sm"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Astrological & Numerological Cycle Badge */}
                {cycle && (cycle.dayEnergy || cycle.yearCycle) && (
                  <div className="pt-3 border-t border-ink/10 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 text-muted">
                      <Compass className="w-3.5 h-3.5 text-accent" />
                      <span className="font-mono text-[10px] sm:text-[11px]">
                        {cycle.dayEnergy?.personalDay
                          ? `Día Personal ${cycle.dayEnergy.personalDay} · `
                          : ""}
                        {cycle.dayEnergy?.theme ? (
                          <strong className="text-accent">{cycle.dayEnergy.theme}</strong>
                        ) : null}
                        {cycle.dayEnergy?.moonPhase ? ` · ${cycle.dayEnergy.moonPhase}` : ""}
                      </span>
                    </div>

                    {cycle.yearCycle?.personalYear && (
                      <span className="font-mono text-[10px] text-accent bg-accent/5 border border-accent/20 px-2 py-0.5 rounded-sm">
                        Año {cycle.yearCycle.personalYear}
                      </span>
                    )}
                  </div>
                )}
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
}
