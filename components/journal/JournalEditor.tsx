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

/** Micro-reflexiones para arrancar cuando no hay prompt contextual ni texto.
 * Sirven para bajar la barrera del "no sé qué escribir" sin prometer un
 * análisis que el Motor no calcula. */
const DAILY_PROMPTS = [
  "¿Qué decisión tomaste hoy, por más chica que sea?",
  "¿Qué emoción dominó tu día y de dónde creés que vino?",
  "¿Hubo una sincronicidad o casualidad que te llamó la atención?",
  "¿Qué te dio energía hoy? ¿Y qué te la sacó?",
  "¿Qué te llevaría anotar para que tu yo del futuro entienda este momento?",
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
  // Siempre hoy — el diario registra el presente, no permite reescribir el pasado.
  const date = useMemo(() => editingEntry?.date || new Date().toISOString().split("T")[0], [editingEntry]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  // Semilla estable por día: arranca la lista de sugerencias en un punto
  // distinto cada día, así el prompt sugerido no se repite.
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
    const targetDate = new Date(date + "T12:00:00");
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
    <div className={`relative overflow-hidden rounded-xl border border-ink/10 bg-card p-6 sm:p-8 transition-all ${className}`}>
      {/* Toast de persistencia local */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-xs font-mono shadow-md backdrop-blur-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Entrada guardada en tu navegador</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center text-accent">
            <PenLine className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
              {editingEntry ? "Editar Entrada" : "Nuevo Registro"}
            </h3>
            <p className="text-xs text-muted capitalize">
              {new Date(date + "T12:00:00").toLocaleDateString("es-AR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Ciclo contextual del día — cruz realizado en vivo */}
      {(cycle?.dayEnergy?.theme || cycle?.dayEnergy?.personalDay || cycle?.yearCycle?.personalYear) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {cycle.dayEnergy?.theme && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-mono border border-accent">
              <Zap className="w-3 h-3 text-accent" />
              <span className="text-accent font-semibold">{cycle.dayEnergy.theme}</span>
            </span>
          )}
          {cycle.dayEnergy?.personalDay && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono bg-accent/5 border border-ink/10">
              <Compass className="w-3 h-3 text-foreground" />
              Día {cycle.dayEnergy.personalDay}
            </span>
          )}
          {cycle.dayEnergy?.moonPhase && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono bg-accent/5 border border-ink/10">
              <Moon className="w-3 h-3 text-foreground" />
              {cycle.dayEnergy.moonPhase}
            </span>
          )}
          {cycle.yearCycle?.personalYear && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono bg-accent/5 border border-ink/10">
              <Sun className="w-3 h-3 text-foreground" />
              Año {cycle.yearCycle.personalYear}
            </span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* Mood Selector (1 to 5) */}
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-2.5 font-semibold">
            ¿Cómo está tu energía hoy?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as JournalMood[]).map((m) => {
              const cfg = MOOD_CONFIG[m];
              const isSelected = mood === m;
              return (
                <motion.button
                  key={m}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setMood(m)}
                  animate={isSelected ? { scale: 1.04 } : { scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-colors text-center group ${
                    isSelected
                      ? "border-transparent ring-2 ring-accent/40 shadow-md"
                      : "border-ink/10 bg-background/50 hover:bg-ink/5 hover:border-ink/20"
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: cfg.bg }
                      : undefined
                  }
                  aria-pressed={isSelected}
                  aria-label={cfg.label}
                >
                  <motion.span
                    animate={isSelected ? { scale: 1.12 } : { scale: 1 }}
                    className="text-xl sm:text-2xl mb-1"
                  >
                    {cfg.emoji}
                  </motion.span>
                  <span
                    className={`font-mono text-[10px] font-semibold truncate w-full ${
                      isSelected ? "text-foreground font-bold" : "text-muted"
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
          <div className="rounded-md bg-accent/5 border border-accent/20 p-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <button type="button" onClick={usePrompt} className="text-left leading-snug">
                {contextualPrompt || DAILY_PROMPTS[promptSeed % DAILY_PROMPTS.length]}
              </button>
            </div>
            <button
              type="button"
              onClick={nextPrompt}
              className="shrink-0 p-1.5 text-muted hover:text-foreground rounded-md hover:bg-ink/5 transition-colors"
              aria-label="Ver otra sugerencia de registro"
              title="Ver otra sugerencia"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Textarea */}
        <div>
          <label
            htmlFor="journal-content"
            className="block font-mono text-[11px] uppercase tracking-wider text-muted font-semibold mb-2"
          >
            Reflexión
          </label>
          <textarea
            id="journal-content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={effectivePlaceholder}
            className="w-full rounded-xl bg-background border border-ink/10 p-3.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y leading-relaxed font-sans"
            required
          />
          <div className="flex justify-between items-center text-[11px] text-muted font-mono mt-1 px-1">
            <span>{content.length} caracteres</span>
            <span>100% privado en tu navegador</span>
          </div>
        </div>

        {/* Quick Tags */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="w-3.5 h-3.5 text-muted" />
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
              Temas de hoy <span className="text-muted/50">(opcional)</span>
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
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border ${
                    selected
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-transparent text-muted border-ink/15 hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit / Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
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
            variant="primary"
            disabled={!content.trim() || isSaving}
            className="flex items-center gap-2 px-6"
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