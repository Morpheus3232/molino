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
import { Check, RefreshCw, Plus } from "lucide-react";

interface JournalEditorProps {
  profile: UserProfile | null;
  onSaveEntry: (
    data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => Promise<JournalEntry | void>;
  editingEntry?: JournalEntry | null;
  onCancelEdit?: () => void;
  /** Sugerencia del día (viene de /hoy vía ?prompt=). Se muestra como la
   * sugerencia de abajo de la hoja, nunca escrita adentro: la hoja es de quien
   * escribe y arranca en blanco (antes aparecía el texto "solo"). */
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
  const [content, setContent] = useState(editingEntry?.content || "");
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

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

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
    <div className={`relative ${className}`}>
      {/* Aviso de guardado */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="absolute top-0 right-0 z-20 flex items-center gap-2 px-4 py-2 bg-background border-2 border-ink text-sm text-foreground"
            role="status"
          >
            <Check className="w-4 h-4" />
            <span>Guardado en tu navegador</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* La fecha es el título de la hoja; el contexto del día, su bajada. */}
      <header>
        <p className="text-sm text-muted label-caps">
          {editingEntry ? "Corrigiendo una página" : "Página de hoy"}
        </p>
        <h2 className="mt-2 font-display font-normal text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] tracking-tight text-foreground first-letter:uppercase">
          {formattedDisplayDate}
        </h2>
        {(cycle?.dayEnergy?.theme || cycle?.dayEnergy?.personalDay || cycle?.dayEnergy?.moonPhase) && (
          <p className="mt-3 text-lg text-muted">
            {[
              cycle.dayEnergy?.personalDay && `Día personal ${cycle.dayEnergy.personalDay}`,
              cycle.dayEnergy?.theme,
              cycle.dayEnergy?.moonPhase && `luna ${cycle.dayEnergy.moonPhase.toLowerCase().replace(/^luna\s+/, "")}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        {/* 1. El ánimo: cinco casillas con filete, la elegida en tinta. En
            pantallas angostas se ven los iconos y el nombre se confirma abajo;
            el nombre completo siempre está en el aria-label. */}
        <fieldset>
          <legend className="text-lg text-foreground mb-3">Hoy me siento…</legend>
          <div className="grid grid-cols-5 gap-px bg-ink/15 border border-ink/15">
            {([1, 2, 3, 4, 5] as JournalMood[]).map((m) => {
              const cfg = MOOD_CONFIG[m];
              const isSelected = mood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`min-w-0 flex flex-col items-center justify-center gap-1.5 py-4 min-h-[64px] transition-colors ${
                    isSelected ? "bg-ink text-paper" : "bg-background text-muted hover:bg-paper-alt hover:text-foreground"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={cfg.label}
                >
                  <span aria-hidden="true" className={`text-2xl leading-none ${isSelected ? "" : "opacity-60"}`}>
                    {cfg.emoji}
                  </span>
                  <span className="hidden sm:block text-sm leading-none" aria-hidden="true">{cfg.label}</span>
                </button>
              );
            })}
          </div>
          <p className="sm:hidden mt-2 text-center text-base text-foreground" aria-live="polite">
            {MOOD_CONFIG[mood].label}
          </p>
        </fieldset>

        {/* 2. La hoja */}
        <div>
          <label htmlFor="journal-content" className="sr-only">
            Lo que querés escribir hoy
          </label>
          <textarea
            id="journal-content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="diary-paper w-full border-t-2 border-ink text-xl text-foreground focus:outline-none resize-y font-serif"
            required
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            {!editingEntry && (
              <div className="flex min-w-0 flex-1 items-center gap-2 text-base text-muted">
                <button
                  type="button"
                  onClick={usePrompt}
                  className="min-w-0 text-left hover:text-foreground transition-colors py-1.5 -my-1.5"
                  title="Usar como punto de partida"
                >
                  <span className="italic">&ldquo;{currentPrompt}&rdquo;</span>
                </button>
                <button
                  type="button"
                  onClick={nextPrompt}
                  className="p-2 -m-1 text-muted hover:text-foreground transition-colors shrink-0"
                  aria-label="Ver otra sugerencia"
                  title="Cambiar sugerencia"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
            <span className="text-sm text-muted ml-auto shrink-0 tabular-nums">
              {wordCount} {wordCount === 1 ? "palabra" : "palabras"}
            </span>
          </div>
        </div>

        {/* 3. Temas: opcionales, se despliegan */}
        <div>
          {!showTags ? (
            <button
              type="button"
              onClick={() => setShowTags(true)}
              className="inline-flex items-center gap-2 text-base text-muted hover:text-foreground transition-colors min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar tema {tags.length > 0 && `(${tags.length})`}</span>
            </button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-base text-foreground">
                  Temas <span className="text-muted">(opcional)</span>
                </span>
                <button type="button" onClick={() => setShowTags(false)} className="text-sm text-muted hover:text-foreground underline underline-offset-4">
                  Ocultar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => {
                  const selected = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={selected}
                      className={`px-3 py-1.5 text-sm transition-colors border ${
                        selected ? "bg-ink text-paper border-ink" : "bg-background text-muted border-ink/25 hover:border-ink hover:text-foreground"
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

        {/* 4. Guardar */}
        <div className="flex items-center justify-end gap-6 pt-6 border-t border-ink/15">
          {editingEntry && onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="text-base text-muted hover:text-foreground underline underline-offset-4 min-h-[44px]">
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim() || isSaving}
            className="inline-flex items-center gap-2 px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps disabled:bg-ink/10 disabled:text-muted disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>Guardando…</>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Guardado
              </>
            ) : (
              <>{editingEntry ? "Guardar la corrección" : "Guardar en el diario"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
