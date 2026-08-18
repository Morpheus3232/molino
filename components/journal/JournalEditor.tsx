"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import {
  type JournalMood,
  type JournalCycleContext,
  type JournalEntry,
  MOOD_CONFIG,
} from "@/types/journal";
import { calculateDailyEnergy, getYearTheme } from "@/lib/engines/dailyEnergyEngine";
import { resolveYearCycle } from "@/lib/engines/yearCycleEngine";
import type { Animal } from "@/lib/data/animalRelations";
import { Sparkles, Calendar, Check, PenLine } from "lucide-react";
import Button from "@/components/ui/Button";

interface JournalEditorProps {
  profile: UserProfile | null;
  onSaveEntry: (
    data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => Promise<JournalEntry | void>;
  editingEntry?: JournalEntry | null;
  onCancelEdit?: () => void;
  /** Pregunta contextual del día (viene de /hoy vía ?prompt=) — reemplaza el
   * placeholder genérico del textarea, nunca precarga el contenido: el
   * usuario sigue partiendo de una hoja en blanco, solo con menos fricción
   * para arrancar. */
  contextualPrompt?: string;
  className?: string;
}

export default function JournalEditor({
  profile,
  onSaveEntry,
  editingEntry = null,
  onCancelEdit,
  contextualPrompt,
  className = "",
}: JournalEditorProps) {
  const [content, setContent] = useState(editingEntry?.content || "");
  const [mood, setMood] = useState<JournalMood>(editingEntry?.mood || 3);
  const tags = useMemo(() => editingEntry?.tags || [], [editingEntry]);
  const [date, setDate] = useState<string>(
    editingEntry?.date || new Date().toISOString().split("T")[0]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute live cycle context based on profile and selected date
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
    contextualPrompt ||
    "¿Cómo te sentís hoy? Escribí tus pensamientos, decisiones, intuiciones o sincronicidades del día...";

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

  return (
    <div
      className={`relative rounded-2xl border border-ink/10 bg-card p-5 sm:p-7 shadow-sm transition-all ${className}`}
    >
      {/* Toast de persistencia local */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-md backdrop-blur-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Entrada guardada en tu navegador</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <PenLine className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
              {editingEntry ? "Editar Entrada" : "Nuevo Registro"}
            </h3>
            <p className="text-[11px] text-muted">
              Tus reflexiones cruzadas con tu mapa simbólico.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-background border border-ink/10 rounded-xl px-3 py-1.5 text-xs text-muted">
          <Calendar className="w-3.5 h-3.5 text-accent" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent border-none text-foreground font-mono text-xs focus:outline-none cursor-pointer"
            aria-label="Fecha de la entrada"
          />
        </div>
      </div>

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
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center group ${
                    isSelected
                      ? "border-accent bg-accent/15 shadow-sm scale-105"
                      : "border-ink/10 bg-background/50 hover:bg-ink/5 hover:border-ink/20"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={cfg.label}
                >
                  <span className="text-xl sm:text-2xl mb-1 filter group-hover:scale-110 transition-transform">
                    {cfg.emoji}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-semibold truncate w-full ${
                      isSelected ? "text-accent" : "text-muted"
                    }`}
                  >
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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
                <Check className="w-4 h-4 text-emerald-400" />
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
