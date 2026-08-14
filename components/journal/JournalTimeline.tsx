"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { JournalEntry, JournalMood } from "@/types/journal";
import { MOOD_CONFIG } from "@/types/journal";
import {
  Search,
  Tag,
  Trash2,
  Edit2,
  Calendar,
  Compass,
  TrendingUp,
  Filter,
  Sparkles,
  Download,
  Upload,
  HardDrive,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Button from "@/components/ui/Button";

interface JournalTimelineProps {
  entries: JournalEntry[];
  loading?: boolean;
  storageSizeKB?: string;
  onEditEntry?: (entry: JournalEntry) => void;
  onDeleteEntry?: (id: string) => void;
  onExportJSON?: () => void;
  onImportJSON?: (rawJSON: string) => Promise<{ success: boolean; count: number; error?: string }>;
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

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const moodCfg = MOOD_CONFIG[data.mood as JournalMood];
    return (
      <div className="bg-[#0F0F14] border border-ink/15 rounded-xl p-3 shadow-xl text-xs">
        <div className="font-mono text-muted text-[10px] mb-1">{data.formattedDate}</div>
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <span>{moodCfg?.emoji}</span>
          <span style={{ color: moodCfg?.color }}>{moodCfg?.label}</span>
          <span className="text-muted font-mono">({data.mood}/5)</span>
        </div>
        {data.theme && (
          <div className="mt-1 font-mono text-[10px] text-accent">
            Día {data.personalDay}: {data.theme}
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function JournalTimeline({
  entries,
  loading = false,
  storageSizeKB = "0.0",
  onEditEntry,
  onDeleteEntry,
  onExportJSON,
  onImportJSON,
  className = "",
}: JournalTimelineProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<JournalMood | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportJSON) return;

    try {
      const text = await file.text();
      const res = await onImportJSON(text);
      if (res.success) {
        setImportStatus({
          type: "success",
          message: `Se importaron ${res.count} entrada(s) correctamente.`,
        });
      } else {
        setImportStatus({
          type: "error",
          message: res.error || "Error al importar el archivo.",
        });
      }
    } catch {
      setImportStatus({
        type: "error",
        message: "Error al leer el archivo JSON.",
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setImportStatus(null), 4000);
    }
  };

  // Estado de carga con Skeleton para evitar flash de "vacío"
  if (loading) {
    return (
      <div className={`space-y-4 ${className} animate-pulse`}>
        <div className="h-14 rounded-2xl bg-card border border-ink/10" />
        <div className="h-44 rounded-2xl bg-card border border-ink/10" />
        <div className="h-36 rounded-2xl bg-card border border-ink/10" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={`rounded-2xl border border-ink/10 bg-card p-8 sm:p-10 text-center ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">
          Tu registro de autoconocimiento está listo
        </h3>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mt-2 leading-relaxed">
          Escribí tu primer registro a la izquierda. A medida que sumes entradas, se guardarán 100% en tu navegador y verás la evolución de tu energía.
        </p>

        {/* Botón para restaurar backup si ya tenía antes */}
        {onImportJSON && (
          <div className="mt-6 pt-6 border-t border-ink/10 inline-flex flex-col items-center">
            <span className="text-[11px] font-mono text-muted mb-2">¿Ya tenías un backup previo?</span>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ink/5 hover:bg-ink/10 border border-ink/10 text-xs font-mono text-foreground transition-colors">
              <Upload className="w-3.5 h-3.5 text-accent" />
              <span>Importar Backup (JSON)</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Backup & Storage Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card/60 border border-ink/10 text-xs font-mono">
        <div className="flex items-center gap-2 text-muted">
          <HardDrive className="w-3.5 h-3.5 text-accent" />
          <span>Uso local: <strong>~{storageSizeKB} KB</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {onExportJSON && (
            <button
              type="button"
              onClick={onExportJSON}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ink/5 hover:bg-ink/10 border border-ink/10 text-foreground text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
              title="Descargar copia de seguridad en JSON"
              aria-label="Exportar copia de seguridad en JSON"
            >
              <Download className="w-3 h-3 text-accent" />
              <span>Exportar</span>
            </button>
          )}

          {onImportJSON && (
            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ink/5 hover:bg-ink/10 border border-ink/10 text-foreground text-[11px] focus-within:ring-2 focus-within:ring-accent transition-colors">
              <Upload className="w-3 h-3 text-accent" />
              <span>Importar</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Subir archivo JSON para importar"
              />
            </label>
          )}
        </div>
      </div>

      {/* Import Status Alert */}
      <AnimatePresence>
        {importStatus && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 border ${
              importStatus.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
          >
            {importStatus.type === "success" ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{importStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood vs Time Chart Card */}
      {chartData.length >= 2 && (
        <div className="rounded-2xl border border-ink/10 bg-card p-5 sm:p-6 shadow-sm">
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

          <div
            className="w-full h-44 sm:h-52"
            role="region"
            aria-label="Gráfico de evolución de energía y estado de ánimo a lo largo del tiempo"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A843" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4A843" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="formattedDate"
                  stroke="#7A7870"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(243,241,234,0.1)" }}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  stroke="#7A7870"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(243,241,234,0.1)" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#D4A843"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                  dot={{ fill: "#D4A843", r: 3, strokeWidth: 1, stroke: "#09090D" }}
                  activeDot={{ r: 5, fill: "#F3F1EA" }}
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Accesibilidad (a11y): Tabla oculta visualmente para lectores de pantalla */}
            <table className="sr-only">
              <caption>Historial cronológico de nivel de energía y estado de ánimo</caption>
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Nivel de Energía (1 a 5)</th>
                  <th scope="col">Tema Simbólico</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((d, i) => (
                  <tr key={i}>
                    <td>{d.formattedDate}</td>
                    <td>{d.mood} de 5</td>
                    <td>{d.theme ? `Día ${d.personalDay}: ${d.theme}` : "Sin tema"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-ink/10">
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
                className="rounded-2xl border border-ink/10 bg-card p-5 sm:p-6 shadow-sm hover:border-ink/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Mood + Date + Actions */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-ink/5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border"
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
                          className="p-1.5 text-muted hover:text-foreground rounded-lg hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
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
                          className="p-1.5 text-muted hover:text-red-400 rounded-lg hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition-colors"
                          aria-label="Eliminar entrada"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="my-4 text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {entry.content}
                  </div>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[11px] text-muted bg-background border border-ink/10 px-2 py-0.5 rounded-md"
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
                      <span className="font-mono text-[10px] text-[#A78BFA] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
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
