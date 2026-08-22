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
import { Sparkles, Check, PenLine, Tag, RefreshCw, Zap, Sun, Moon, Compass } from "lucide-react";
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

  const usePrompt = useCallback(() => {
    const target = contextualPrompt || DAILY_PROMPTS[promptSeed % DAILY_PROMPTS.length];
    if (!target) return;
    setContent((prev) => (prev.trim() ? `${prev.trim()}\n\n` : "") + target);
  }, [contextualPrompt, promptSeed]);

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

  const effectivePlaceholder =
    "¿Cómo te sentís hoy? Escribí tus pensamientos, decisiones, intuiciones o sincronicidades del día...";

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
            <span>Entrada guardada en tu navegador</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <PenLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {editingEntry ? "Editar Entrada" : "Nuevo Registro"}
            </h3>
            <p className="text-xs sm:text-sm text-muted capitalize mt-0.5">
              {formattedDisplayDate}
            </p>
          </div>
        </div>

        {/* Badges de ciclo en vivo */}
        {(cycle?.dayEnergy?.theme || cycle?.dayEnergy?.personalDay || cycle?.yearCycle?.personalYear) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {cycle.dayEnergy?.theme && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-accent/10 text-accent border border-accent/20">
                <Zap className="w-3 h-3 text-accent" />
                <span>{cycle.dayEnergy.theme}</span>
              </span>
            )}
            {cycle.dayEnergy?.personalDay && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono bg-background border border-border text-foreground">
                <Compass className="w-3 h-3 text-muted" />
                Día {cycle.dayEnergy.personalDay}
              </span>
            )}
            {cycle.dayEnergy?.moonPhase && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono bg-background border border-border text-foreground">
                <Moon className="w-3 h-3 text-muted" />
                {cycle.dayEnergy.moonPhase}
              </span>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Mood Selector (1 to 5) */}
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-3 font-semibold">
            ¿Cómo está tu energía hoy?
          </label>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {([1, 2, 3, 4, 5] as JournalMood[]).map((m) => {
              const cfg = MOOD_CONFIG[m];
              const isSelected = mood === m;
              return (
                <motion.button
                  key={m}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMood(m)}
                  animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center group ${
                    isSelected
                      ? "border-accent/40 bg-accent/10 shadow-sm ring-1 ring-accent"
                      : "border-border bg-background/50 hover:bg-background hover:border-border/80"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={cfg.label}
                >
                  <span className="text-2xl sm:text-3xl mb-1.5 block transform group-hover:scale-110 transition-transform">
                    {cfg.emoji}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-semibold truncate w-full ${
                      isSelected ? "text-accent font-bold" : "text-muted"
                    }`}
                  >
                    {cfg.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Prompt sugerido */}
        {!editingEntry && (
          <div className="rounded-2xl bg-accent/[0.04] border border-accent/20 p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-foreground/90 font-medium">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <button
                type="button"
                onClick={usePrompt}
                className="text-left leading-relaxed hover:text-accent transition-colors"
              >
                {contextualPrompt || DAILY_PROMPTS[promptSeed % DAILY_PROMPTS.length]}
              </button>
            </div>
            <button
              type="button"
              onClick={nextPrompt}
              className="shrink-0 p-1 text-muted hover:text-accent rounded-lg hover:bg-background/80 transition-colors"
              aria-label="Ver otra sugerencia de registro"
              title="Ver otra sugerencia"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Textarea */}
        <div className="space-y-2">
          <label
            htmlFor="journal-content"
            className="block font-mono text-[11px] uppercase tracking-wider text-muted font-semibold"
          >
            Reflexión del día
          </label>
          <textarea
            id="journal-content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={effectivePlaceholder}
            className="w-full rounded-2xl bg-background border border-border p-4 text-sm sm:text-base text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y leading-relaxed font-sans"
            required
          />
          <div className="flex justify-between items-center text-[11px] text-muted font-mono px-1">
            <span>{content.length} caracteres</span>
            <span>100% privado en tu dispositivo</span>
          </div>
        </div>

        {/* Quick Tags */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Tag className="w-3.5 h-3.5 text-muted" />
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
              Temas clave <span className="text-muted/60 font-normal">(opcional)</span>
            </label>
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
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
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
        </div>

        {/* Submit / Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
          {editingEntry && onCancelEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
              className="text-muted hover:text-foreground"
            >
              Cancelar
            </Button>
          )}

          <Button
            type="submit"
            variant="accent"
            disabled={!content.trim() || isSaving}
            className="flex items-center gap-2 px-6 py-2.5 font-bold shadow-sm"
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
                {editingEntry ? "Actualizar Entrada" : "Guardar en el Journal"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}