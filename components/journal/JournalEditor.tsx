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
import { Check, Tag, RefreshCw, Plus, ChevronDown } from "lucide-react";
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
    <div className={`relative ${className}`}>
      {/* Toast de persistencia local */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-card border border-success/40 text-success text-xs font-mono shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Guardado en tu navegador</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encabezado de diario: la fecha es el título de la página, y el
          contexto del día va como una nota al margen, no como badges. */}
      <header>
        <p className="text-sm text-muted label-caps">
          {editingEntry ? "Corrigiendo una página" : "Página de hoy"}
        </p>
        <h2 className="mt-1 font-display italic font-normal text-3xl sm:text-4xl text-foreground first-letter:uppercase">
          {formattedDisplayDate}
        </h2>
        {(cycle?.dayEnergy?.theme || cycle?.dayEnergy?.personalDay || cycle?.dayEnergy?.moonPhase) && (
          <p className="mt-2 text-sm italic text-muted">
            {[
              cycle.dayEnergy?.personalDay && `Día personal ${cycle.dayEnergy.personalDay}`,
              cycle.dayEnergy?.theme,
              cycle.dayEnergy?.moonPhase && `luna ${cycle.dayEnergy.moonPhase.toLowerCase()}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* 1. ¿Cómo te sentís? — Escala horizontal minimalista (5 estados) */}
        <div>
          <p className="text-base italic text-muted mb-2">Hoy me siento…</p>
          {/* Dos bugs de layout acá, los dos por lo mismo: cinco palabras de
              hasta 11 caracteres no entran en una fila angosta.

              1. `flex-1` sin `min-w-0`: min-width:auto le pone como piso el
                 ancho intrínseco de la palabra, los botones no podían
                 encogerse y desbordaban el contenedor (el `truncate` del span
                 nunca se activaba porque el ítem flex es el button).
              2. Mostrar los 5 labels y truncar da "Desafian…" / "En sinto…",
                 que no dicen nada. Y ocultarlos por breakpoint de viewport no
                 sirve: este editor vive en un card angosto incluso en desktop.

              La escala se lee por los emoji (lluvia → sol → chispa) y el
              label del estado elegido se confirma debajo. Funciona igual a
              312px que a 1440px, sin recortes. El nombre completo de cada
              opción sigue disponible en su aria-label. */}
          <div className="flex items-stretch gap-1 border-y border-border py-1">
            {([1, 2, 3, 4, 5] as JournalMood[]).map((m) => {
              const cfg = MOOD_CONFIG[m];
              const isSelected = mood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`flex-1 min-w-0 flex items-center justify-center rounded-sm transition-colors min-h-[44px] border text-xl leading-none ${
                    isSelected
                      ? "border-transparent border-b-foreground opacity-100"
                      : "border-transparent opacity-40 hover:opacity-90"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={cfg.label}
                >
                  <span aria-hidden="true">{cfg.emoji}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center italic text-base text-foreground" aria-live="polite">
            {MOOD_CONFIG[mood].label}
          </p>
        </div>

        {/* 2. ¿Qué querés registrar? — Textarea como protagonista absoluto */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="journal-content" className="sr-only">
              Lo que querés escribir hoy
            </label>
          </div>

          <textarea
            id="journal-content"
            rows={9}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="diary-paper w-full text-lg text-foreground focus:outline-none resize-y font-sans"
            required
          />

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-1">
            {/* Sugerencia subordinada y discreta */}
            {!editingEntry && (
              <div className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-muted">
                <button
                  type="button"
                  onClick={usePrompt}
                  className="min-w-0 text-left text-muted/80 hover:text-accent transition-colors flex items-center gap-1 py-1.5 -my-1.5"
                  title="Usar como punto de partida"
                >
                  <span className="truncate italic">&ldquo;{currentPrompt}&rdquo;</span>
                </button>
                <button
                  type="button"
                  onClick={nextPrompt}
                  className="p-2 -m-1 text-muted hover:text-accent rounded transition-colors shrink-0"
                  aria-label="Ver otra sugerencia"
                  title="Cambiar sugerencia"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            )}

            <span className="text-xs text-muted font-mono ml-auto shrink-0">
              {content.trim() ? content.trim().split(/\s+/).length : 0} palabras
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
                  <span className="text-sm text-muted font-semibold label-caps">
                    Temas clave <span className="text-muted/60 font-normal">(opcional)</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTags(false)}
                  className="text-xs font-mono text-muted hover:text-foreground transition-colors"
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
        <div className="flex items-center justify-end gap-3 pt-2">
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
                <Check className="w-4 h-4 text-success" />
                ¡Guardado!
              </>
            ) : (
              <>
                {editingEntry ? "Guardar la corrección" : "Guardar en el diario"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
