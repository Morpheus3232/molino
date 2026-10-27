"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
import { Check, Plus } from "lucide-react";
import DiaryEditor, { type DiaryEditorHandle } from "@/components/journal/DiaryEditor";
import { plainText } from "@/lib/journal/markdown";

const DRAFT_KEY = "molino.journal-draft.v1";

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
const DAILY_PROMPTS = (L: Pick2) => ([
  L("¿Qué decisión tomaste hoy, por más chica que sea?", "What decision did you make today, however small?"),
  L("¿Qué emoción dominó tu día y de dónde creés que vino?", "What emotion dominated your day, and where do you think it came from?"),
  L("¿Hubo una sincronicidad o casualidad que te llamó la atención?", "Was there a synchronicity or coincidence that caught your attention?"),
  L("¿Qué te dio energía hoy? ¿Y qué te la sacó?", "What gave you energy today? And what drained it?"),
  L("¿Qué te gustaría anotar para que tu yo del futuro entienda este momento?", "What would you like to note down so your future self understands this moment?"),
  L("¿Te cruzaste con alguien que cambió tu ánimo? ¿Cómo?", "Did you run into someone who changed your mood? How?"),
  L("¿A qué le dijiste que sí hoy? ¿Y a qué le dijiste que no?", "What did you say yes to today? And what did you say no to?"),
]);

export default function JournalEditor({
  profile,
  onSaveEntry,
  editingEntry = null,
  onCancelEdit,
  contextualPrompt,
  className = "",
}: JournalEditorProps) {
  const L = useL();
  const [content, setContent] = useState(editingEntry?.content || "");
  const [mood, setMood] = useState<JournalMood>(editingEntry?.mood || 3);
  const [tags, setTags] = useState<string[]>(editingEntry?.tags || []);
  const [showTags, setShowTags] = useState<boolean>(Boolean(editingEntry?.tags && editingEntry.tags.length > 0));

  // Siempre fecha local (no UTC) para evitar desfases horarios
  const date = useMemo(() => editingEntry?.date || toLocalDateKey(new Date()), [editingEntry]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [draftNote, setDraftNote] = useState<string | null>(null);
  const sheet = useRef<DiaryEditorHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Borrador: lo que escribís se guarda solo mientras escribís, y vuelve si
  // cerrás la pestaña sin guardar. No aplica al corregir una página vieja.
  useEffect(() => {
    if (editingEntry) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as { date: string; content: string; mood?: JournalMood; tags?: string[] };
      if (d.date === date && d.content?.trim()) {
        setContent(d.content);
        // La hoja lo aplica en cuanto el editor existe.
        const push = (tries = 0) => {
          if (sheet.current) sheet.current.setMarkdown(d.content);
          else if (tries < 40) window.setTimeout(() => push(tries + 1), 50);
        };
        push();
        if (d.mood) setMood(d.mood);
        if (d.tags?.length) {
          setTags(d.tags);
          setShowTags(true);
        }
        setDraftNote(L("Borrador recuperado", "Draft recovered"));
      }
    } catch {
      /* sin almacenamiento: se escribe igual */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editingEntry) return;
    const id = window.setTimeout(() => {
      try {
        if (content.trim()) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ date, content, mood, tags }));
          
        } else localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* nada */
      }
    }, 700);
    return () => window.clearTimeout(id);
  }, [content, mood, tags, date, editingEntry]);


  // Semilla de prompt diario
  const initialSeed = useMemo(
    () => Math.floor(new Date().getDate() % DAILY_PROMPTS(L).length),
    []
  );
  const promptSeed = initialSeed;

  const currentPrompt = useMemo(
    () => contextualPrompt || DAILY_PROMPTS(L)[promptSeed % DAILY_PROMPTS(L).length],
    [contextualPrompt, promptSeed]
  );

  const plain = useMemo(() => plainText(content), [content]);
  const wordCount = plain.trim() ? plain.trim().split(/\s+/).length : 0;



  const cycleContext = useMemo<JournalCycleContext>(() => {
    const [y, m, d] = date.split("-").map(Number);
    const targetDate = new Date(y, m - 1, d, 12, 0, 0);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;

    if (!profile) {
      return {
        yearCycle: { year, label: L("Ciclo del año", "Cycle of the year") },
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
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* nada */
        }
        setDraftNote(null);

        if (!editingEntry) {
          setContent("");
          sheet.current?.clear();
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
            <span>{L("Guardado en tu navegador", "Saved in your browser")}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* La fecha es el título de la hoja; el contexto del día, su bajada. */}
      <header>
        <p className="text-sm text-muted label-caps">
          {editingEntry ? L("Corrigiendo una página", "Correcting a page") : L("Página de hoy", "Today's page")}
        </p>
        <h2 className="mt-2 font-display font-normal text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] tracking-tight text-foreground first-letter:uppercase">
          {formattedDisplayDate}
        </h2>
        {(cycle?.dayEnergy?.theme || cycle?.dayEnergy?.personalDay || cycle?.dayEnergy?.moonPhase) && (
          <p className="mt-3 text-lg text-muted">
            {[
              cycle.dayEnergy?.personalDay && L(`Día personal ${cycle.dayEnergy.personalDay}`, `Personal day ${cycle.dayEnergy.personalDay}`),
              cycle.dayEnergy?.theme,
              cycle.dayEnergy?.moonPhase && `luna ${cycle.dayEnergy.moonPhase.toLowerCase().replace(/^luna\s+/, "")}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </header>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-10 space-y-8">
        {/* 1. El ánimo: cinco casillas con filete, la elegida en tinta. En
            pantallas angostas se ven los iconos y el nombre se confirma abajo;
            el nombre completo siempre está en el aria-label. */}
        <fieldset>
          <legend className="text-lg text-foreground mb-3">{L("Hoy me siento…", "Today I feel…")}</legend>
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

        {/* 2. La hoja: la pregunta del día espera adentro, como sugerencia */}
        <div>
          <div className="border-t-2 border-ink max-w-[46rem]">
            <DiaryEditor
              ref={sheet}
              id="journal-content"
              ariaLabel={L("Lo que querés escribir hoy", "What you want to write today")}
              initialMarkdown={editingEntry?.content ?? ""}
              placeholder={editingEntry ? "" : currentPrompt}
              onChange={(md) => {
                setContent(md);
                setDraftNote(null);
              }}
              onSubmit={() => formRef.current?.requestSubmit()}
            />
          </div>
          <p className="mt-2 max-w-[46rem] flex justify-between gap-4 text-sm text-muted" aria-live="polite">
            <span>{draftNote}</span>
            <span className="tabular-nums">
              {wordCount > 0 && `${wordCount} ${wordCount === 1 ? "palabra" : "palabras"}`}
            </span>
          </p>
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
              <span>{L(<>Agregar tema {tags.length > 0 && `(${tags.length})`}</>, <>Add a topic {tags.length > 0 && `(${tags.length})`}</>)}</span>
            </button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-base text-foreground">{L(<>
                  Temas <span className="text-muted">(opcional)</span>
                </>, <>Topics <span className="text-muted">(optional)</span></>)}</span>
                <button type="button" onClick={() => setShowTags(false)} className="text-sm text-muted hover:text-foreground underline underline-offset-4">{L("Ocultar", "Hide")}</button>
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
            <button type="button" onClick={onCancelEdit} className="text-base text-muted hover:text-foreground underline underline-offset-4 min-h-[44px]">{L("Cancelar", "Cancel")}</button>
          )}
          <button
            type="submit"
            disabled={!content.trim() || isSaving}
            className="inline-flex items-center gap-2 px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps disabled:bg-ink/10 disabled:text-muted disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>{L("Guardando…", "Saving…")}</>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                {L("Guardado", "Saved")}
              </>
            ) : (
              <>{editingEntry ? L("Guardar la corrección", "Save the correction") : L("Guardar en el diario", "Save to the journal")}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
