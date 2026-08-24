"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  type JournalMood,
  type JournalCycleContext,
  type JournalEntry,
  MOOD_CONFIG,
  QUICK_TAGS,
} from "@/types/journal";
import { calculateDailyEnergy, getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import { resolveYearCycle } from "@/lib/engines/yearCycleEngine";
import { toLocalDateKey } from "@/lib/session/dailyHistory";
import type { Animal } from "@/lib/data/animalRelations";
import { Sparkles, Check, PenLine, Tag, RefreshCw, Zap, Moon, Compass, Plus, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

interface JournalEditorProps {
  profile: UserProfile | null;
  onSaveEntry: (
    data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => Promise<JournalEntry | void>;
  editingEntry?: JournalEntry | null;
  onCancelEdit?: () => void;
  /** Sugerencia del día (viene de /hoy vía ?prompt=) — precarga el
   * textarea como texto real y editable. */
  contextualPrompt?: string;
  className?: string;
}

/** Micro-reflexiones para arrancar cuando no hay prompt contextual ni texto. */
const DAILY_PROMPTS = [
  "¿Qué decisión tomaste hoy, por más chica que sea?",
  "¿Qué emoción dominó tu día y de dónde creés que vino?",
  "¿Hubo una sincronicidad o casualidad que te llamó la atención?",
  "¿Qué te dio energía hoy? ¿Y qué te la sacó?",
  "¿Qué te gustaría anotar para que tu yo del futuro entienda este momento?",
  "¿Te cruzaste con alguien que cambió tu ánimo? ¿Cómo?",
  "¿A qué le dijiste que sí hoy? ¿Y a qué le dijiste que no?",
];

export default function JournalEditor({
  profile,
  onSaveEntry,
  editingEntry = null,
  onCancelEdit,
  contextualPrompt,
  className = "",
}: JournalEditorProps) {
  const [content, setContent] = useState(editingEntry?.content || contextualPrompt || "");
  const [mood, setMood] = useState<JournalMood>(editingEntry?.mood || 3);
  const [tags, setTags] = useState<string[]>(editingEntry?.tags || []);
  const [showTags, setShowTags] = useState<boolean>(Boolean(editingEntry?.tags && editingEntry.tags.length > 0));

  // Siempre fecha local (no UTC) para evitar desfases horarios
  const date = useMemo(() => editingEntry?.date || toLocalDateKey(new Date()), [editingEntry]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Semilla de prompt diario
  const initialSeed = useMemo(
    () => Math.floor(new Date().getDate() % DAILY_PROMPTS.length),
    []
  );
  const [promptSeed, setPromptSeed] = useState(initialSeed);

  const currentPrompt = useMemo(
    () => contextualPrompt || DAILY_PROMPTS[promptSeed % DAILY_PROMPTS.length],
    [contextualPrompt, promptSeed]
  );

  const usePrompt = useCallback(() => {
    if (!currentPrompt) return;
    setContent((prev) => (prev.trim() ? `${prev.trim()}\n\n` : "") + currentPrompt);
  }, [currentPrompt]);

  const nextPrompt = useCallback(() => {
    setPromptSeed((s) => s + 1);
  }, []);

  const cycleContext = useMemo<JournalCycleContext>(() => {
    const [y, m, d] = date.split("-").map(Number);
    const targetDate = new Date(y, m - 1, d, 12, 0, 0);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;

    if (!profile) {
      return {
        yearCycle: { year, label: "Ciclo del año" },
        monthCycle: { personalMonth: month },
        dayEnergy: { theme: "Reflexión" },
      };
    }

    try {
      const dailyEnergy = calculateDailyEnergy(profile, targetDate);
      const userAnimal = (profile.chineseZodiac || "Rata") as Animal;
      const yearCycle = resolveYearCycle(userAnimal, year);
      const yearThemeStr = getYearTheme(dailyEnergy.personalYear);

      return {
        yearCycle: {
          year,
          animal: yearCycle.yearAnimal,
          personalYear: dailyEnergy.personalYear,
          label: yearCycle.label,
          yearTheme: yearThemeStr,
        },
        monthCycle: {
          personalMonth: dailyEnergy.personalMonth,
        },
        dayEnergy: {
          personalDay: dailyEnergy.personalDay,
          theme: dailyEnergy.theme,
          moonPhase: dailyEnergy.moonPhase?.phase,
          overallScore: dailyEnergy.overallScore,
        },
      };
    } catch {
      return {};
    }
  }, [profile, date]);

  const formattedDisplayDate = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    const targetDate = new Date(y, m - 1, d, 12, 0, 0);
    return targetDate.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, [date]);

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim() || isSaving) return;

      setIsSaving(true);
      try {
        await onSaveEntry({
          date,
          content: content.trim(),
          mood,
          tags,
          cycleContext,
        });

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);

        if (!editingEntry) {
          setContent("");
          setMood(3);
          setTags([]);
          setShowTags(false);
        } else if (onCancelEdit) {
          onCancelEdit();
        }
      } catch (err) {
        console.error("[JournalEditor] Error al guardar entrada:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [content, isSaving, onSaveEntry, date, mood, tags, cycleContext, editingEntry, onCancelEdit]
  );

  const cycle = cycleContext;

  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all ${className}`}>
      {/* Toast de persistencia local */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono shadow-sm backdrop-blur-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Guardado en tu navegador</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header — Título claro + Fecha + Contexto sutil */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <PenLine className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {editingEntry ? "Editar Entrada" : "Nuevo Registro"}
            </h3>
            <p className="text-xs text-muted capitalize mt-0.5">
              {formattedDisplayDate}
            </p>
          </div>
        </div>

        {/* Badges de ciclo en vivo — discretos */}
        {(cycle?.dayEnergy?.theme || cycle?.dayEnergy?.personalDay || cycle?.yearCycle?.personalYear) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {cycle.dayEnergy?.theme && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-accent/10 text-accent border border-accent/20">
                <Zap className="w-3 h-3 text-accent" />
                <span>{cycle.dayEnergy.theme}</span>
              </span>
            )}
            {cycle.dayEnergy?.personalDay && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-background border border-border text-foreground">
                <Compass className="w-3 h-3 text-muted" />
                Día {cycle.dayEnergy.personalDay}
              </span>
            )}
            {cycle.dayEnergy?.moonPhase && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-background border border-border text-foreground">
                <Moon className="w-3 h-3 text-muted" />
                {cycle.dayEnergy.moonPhase}
              </span>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* 1. ¿Cómo te sentís? — Escala horizontal minimalista (5 estados) */}
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-2.5 font-semibold">
            ¿Cómo te sentís?
          </label>
          <div className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 rounded-xl bg-background border border-border">
            {([1, 2, 3, 4, 5] as JournalMood[]).map((m) => {
              const cfg = MOOD_CONFIG[m];
              const isSelected = mood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs transition-all min-h-[44px] ${
                    isSelected
                      ? "bg-accent/15 border border-accent/40 text-foreground font-semibold shadow-xs"
                      : "text-muted hover:text-foreground hover:bg-ink/[0.03] border border-transparent"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={cfg.label}
                >
                  <span className="text-lg leading-none" aria-hidden="true">{cfg.emoji}</span>
                  <span className="font-mono text-[10px] sm:text-[11px] truncate">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. ¿Qué querés registrar? — Textarea como protagonista absoluto */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="journal-content"
              className="block font-mono text-[11px] uppercase tracking-wider text-muted font-semibold"
            >
              ¿Qué querés registrar?
            </label>
          </div>

          <textarea
            id="journal-content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribí tus pensamientos, decisiones, intuiciones o lo que viviste hoy..."
            className="w-full rounded-2xl bg-background border border-border p-4 text-sm sm:text-base text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y leading-relaxed font-sans"
            required
          />

          <div className="flex items-center justify-between pt-1">
            {/* Sugerencia subordinada y discreta */}
            {!editingEntry && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <button
                  type="button"
                  onClick={usePrompt}
                  className="text-left text-muted/80 hover:text-accent transition-colors truncate max-w-[240px] sm:max-w-md flex items-center gap-1"
                  title="Usar como punto de partida"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate italic">&ldquo;{currentPrompt}&rdquo;</span>
                </button>
                <button
                  type="button"
                  onClick={nextPrompt}
                  className="p-1 text-muted hover:text-accent rounded transition-colors shrink-0"
                  aria-label="Ver otra sugerencia"
                  title="Cambiar sugerencia"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            )}

            <span className="text-[11px] text-muted font-mono ml-auto shrink-0">
              {content.length} caracteres
            </span>
          </div>
        </div>

        {/* 3. Temas clave — Ocultos por defecto, desplegables discretamente */}
        <div>
          {!showTags ? (
            <button
              type="button"
              onClick={() => setShowTags(true)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-accent transition-colors py-1 min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar tema {tags.length > 0 && `(${tags.length})`}</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-muted" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
                    Temas clave <span className="text-muted/60 font-normal">(opcional)</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTags(false)}
                  className="text-[11px] font-mono text-muted hover:text-foreground transition-colors"
                >
                  Ocultar
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => {
                  const selected = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={selected}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                        selected
                          ? "bg-accent text-accent-foreground border-accent font-semibold"
                          : "bg-background text-muted border-border hover:border-accent/40 hover:text-foreground"
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* 4. Guardar registro — CTA principal claro */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
          {editingEntry && onCancelEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              className="text-muted hover:text-foreground min-h-[44px]"
            >
              Cancelar
            </Button>
          )}

          <Button
            type="submit"
            variant="accent"
            disabled={!content.trim() || isSaving}
            className="flex items-center gap-2 px-7 py-2.5 font-bold shadow-sm min-h-[44px]"
          >
            {isSaving ? (
              <>Guardando...</>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                ¡Guardado!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {editingEntry ? "Actualizar registro" : "Guardar registro"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
