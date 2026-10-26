"use client";

import { useState, useMemo, useCallback, useEffect, useLayoutEffect, useRef } from "react";
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
import { Check, RefreshCw, Plus, Bold, Italic, Highlighter, Quote, RemoveFormatting } from "lucide-react";
import RichText from "@/components/journal/RichText";
import { toggleWrap, toggleQuote, clearFormat, insertAt, type Edit } from "@/lib/journal/format";

const DRAFT_KEY = "molino.journal-draft.v1";

/** Posición (dentro del textarea) del carácter `pos`, con un espejo del textarea. */
function caretPoint(el: HTMLTextAreaElement, pos: number) {
  const cs = window.getComputedStyle(el);
  const mirror = document.createElement("div");
  const props = [
    "boxSizing", "width", "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "lineHeight",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderTopWidth", "borderLeftWidth",
    "borderRightWidth", "textTransform", "wordSpacing", "textIndent", "tabSize",
  ] as const;
  for (const k of props) (mirror.style as unknown as Record<string, string>)[k] = cs[k] as string;
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.overflowWrap = "break-word";
  mirror.style.top = "0";
  mirror.style.left = "-9999px";
  mirror.textContent = el.value.slice(0, pos);
  const mark = document.createElement("span");
  mark.textContent = el.value.slice(pos) || ".";
  mirror.appendChild(mark);
  document.body.appendChild(mirror);
  const point = { x: mark.offsetLeft, y: mark.offsetTop - el.scrollTop };
  document.body.removeChild(mirror);
  return point;
}

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
  const [mode, setMode] = useState<"write" | "read">("write");
  const [toolbar, setToolbar] = useState<{ x: number; y: number } | null>(null);
  const [draftNote, setDraftNote] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

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
        if (d.mood) setMood(d.mood);
        if (d.tags?.length) {
          setTags(d.tags);
          setShowTags(true);
        }
        setDraftNote("Recuperamos tu borrador de hoy");
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
          setDraftNote((n) => (n === "Recuperamos tu borrador de hoy" ? n : "Borrador guardado"));
        } else localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* nada */
      }
    }, 700);
    return () => window.clearTimeout(id);
  }, [content, mood, tags, date, editingEntry]);

  // La hoja crece con el texto: nada de barra de desplazamiento adentro.
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el || mode !== "write") return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 360)}px`;
  }, [content, mode]);

  /** Muestra la barra de formato arriba de la selección (o la esconde). */
  const updateToolbar = useCallback(() => {
    const el = areaRef.current;
    const sheet = sheetRef.current;
    if (!el || !sheet || document.activeElement !== el || el.selectionStart === el.selectionEnd) {
      setToolbar(null);
      return;
    }
    const p = caretPoint(el, el.selectionStart);
    const sheetBox = sheet.getBoundingClientRect();
    const areaBox = el.getBoundingClientRect();
    const x = Math.min(Math.max(areaBox.left - sheetBox.left + p.x - 12, 0), Math.max(sheetBox.width - 300, 0));
    const y = areaBox.top - sheetBox.top + p.y - 52;
    setToolbar({ x, y: Math.max(y, -52) });
  }, []);

  // La selección también cambia con el teclado, el mouse o el menú del sistema:
  // escuchamos selectionchange (en el textarea y en el documento, según navegador).
  useEffect(() => {
    const el = areaRef.current;
    const onChange = () => {
      if (document.activeElement === areaRef.current) updateToolbar();
    };
    document.addEventListener("selectionchange", onChange);
    el?.addEventListener("selectionchange", onChange);
    el?.addEventListener("select", onChange);
    return () => {
      document.removeEventListener("selectionchange", onChange);
      el?.removeEventListener("selectionchange", onChange);
      el?.removeEventListener("select", onChange);
    };
  }, [updateToolbar]);

  const apply = useCallback((fn: (v: string, s: number, e: number) => Edit) => {
    const el = areaRef.current;
    if (!el) return;
    const r = fn(el.value, el.selectionStart, el.selectionEnd);
    setContent(r.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(r.start, r.end);
      updateToolbar();
    });
  }, [updateToolbar]);

  const FORMATS = [
    { key: "b", label: "Negrita", Icon: Bold, run: (v: string, s: number, e: number) => toggleWrap(v, s, e, "**") },
    { key: "i", label: "Cursiva", Icon: Italic, run: (v: string, s: number, e: number) => toggleWrap(v, s, e, "*") },
    { key: "e", label: "Resaltar", Icon: Highlighter, run: (v: string, s: number, e: number) => toggleWrap(v, s, e, "==") },
    { key: "q", label: "Cita", Icon: Quote, run: toggleQuote },
    { key: "0", label: "Quitar formato", Icon: RemoveFormatting, run: clearFormat },
  ] as const;

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
    const el = areaRef.current;
    const pos = el ? (document.activeElement === el ? el.selectionEnd : el.value.length) : content.length;
    const r = insertAt(content, pos, currentPrompt);
    setContent(r.value);
    setMode("write");
    requestAnimationFrame(() => {
      areaRef.current?.focus();
      areaRef.current?.setSelectionRange(r.start, r.end);
    });
  }, [currentPrompt, content]);

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
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* nada */
        }
        setDraftNote(null);
        setMode("write");

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

        {/* 2. La hoja: escribir o leer cómo queda */}
        <div>
          <div className="flex items-end justify-between gap-4 border-b-2 border-ink">
            <div className="flex" role="tablist" aria-label="La hoja">
              {(
                [
                  ["write", "Escribir"],
                  ["read", "Leer"],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => {
                    setMode(m);
                    setToolbar(null);
                  }}
                  className={`px-1 mr-6 py-2 -mb-0.5 border-b-[3px] text-lg transition-colors ${
                    mode === m ? "border-ink text-foreground" : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="pb-2 text-sm text-muted tabular-nums" aria-live="polite">
              {wordCount} {wordCount === 1 ? "palabra" : "palabras"}
              {wordCount > 0 && ` · ${Math.max(1, Math.round(wordCount / 200))} min de lectura`}
            </span>
          </div>

          <div ref={sheetRef} className="relative">
            {/* Barra de formato: aparece al seleccionar una parte del texto */}
            {toolbar && mode === "write" && (
              <div
                role="toolbar"
                aria-label="Formato de la selección"
                className="absolute z-30 flex items-stretch bg-ink text-paper shadow-[0_6px_20px_rgba(0,0,0,0.18)]"
                style={{ left: toolbar.x, top: toolbar.y }}
              >
                {FORMATS.map(({ key, label, Icon, run }) => (
                  <button
                    key={key}
                    type="button"
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={() => apply(run)}
                    aria-label={label}
                    title={key === "q" || key === "0" ? label : `${label} (${isMac ? "⌘" : "Ctrl+"}${key.toUpperCase()})`}
                    className="w-11 h-11 flex items-center justify-center hover:bg-paper/15 transition-colors border-r border-paper/15 last:border-r-0"
                  >
                    <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            <label htmlFor="journal-content" className="sr-only">
              Lo que querés escribir hoy
            </label>
            <textarea
              id="journal-content"
              ref={areaRef}
              rows={10}
              value={content}
              lang="es"
              spellCheck
              placeholder={content ? undefined : "Empezá por cualquier cosa: lo que pasó, lo que sentiste, lo que no querés olvidar."}
              onChange={(e) => {
                setContent(e.target.value);
                if (draftNote === "Recuperamos tu borrador de hoy") setDraftNote(null);
              }}
              onSelect={updateToolbar}
              onMouseUp={updateToolbar}
              onKeyUp={(e) => {
                if (e.shiftKey || e.key.startsWith("Arrow")) updateToolbar();
              }}
              onBlur={() => setToolbar(null)}
              onScroll={updateToolbar}
              onKeyDown={(e) => {
                const mod = e.metaKey || e.ctrlKey;
                if (e.key === "Escape") setToolbar(null);
                if (!mod) return;
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
                  return;
                }
                const f = FORMATS.find((x) => x.key === e.key.toLowerCase() && ["b", "i", "e"].includes(x.key));
                if (f) {
                  e.preventDefault();
                  apply(f.run);
                }
              }}
              className={`diary-paper block w-full max-w-[46rem] text-[1.3125rem] sm:text-[1.375rem] text-foreground placeholder:text-muted/70 placeholder:italic focus:outline-none resize-none overflow-hidden font-serif hyphens-auto ${
                mode === "write" ? "" : "hidden"
              }`}
              required
            />
            {mode === "read" && (
              <div className="min-h-[360px] max-w-[46rem] pt-5 pl-5 border-l border-ink/25 text-[1.3125rem] sm:text-[1.375rem] leading-[1.65] text-foreground font-serif hyphens-auto">
                {content.trim() ? (
                  <RichText text={content} />
                ) : (
                  <p className="text-muted italic">Todavía no escribiste nada.</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 max-w-[46rem] flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            {!editingEntry && (
              <div className="flex min-w-0 flex-1 items-start gap-2 text-base text-muted">
                <span className="shrink-0 pt-1.5 text-sm label-caps">Si no sabés por dónde</span>
                <button
                  type="button"
                  onClick={usePrompt}
                  className="min-w-0 text-left text-foreground/85 hover:text-foreground py-1.5 -my-1.5 underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
                  title="Agregarla a la hoja"
                >
                  <span className="italic">{currentPrompt}</span>
                </button>
                <button
                  type="button"
                  onClick={nextPrompt}
                  className="p-2 -m-1 text-muted hover:text-foreground transition-colors shrink-0"
                  aria-label="Ver otra sugerencia"
                  title="Otra pregunta"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <p className="mt-3 max-w-[46rem] text-sm text-muted">
            Seleccioná una parte del texto para darle formato: negrita, cursiva, resaltado o cita.
            <span className="hidden sm:inline">
              {" "}
              {isMac ? "⌘" : "Ctrl+"}B, {isMac ? "⌘" : "Ctrl+"}I y {isMac ? "⌘" : "Ctrl+"}E también sirven; {isMac ? "⌘" : "Ctrl+"}↵ guarda.
            </span>
            {draftNote && <span className="block mt-1 text-foreground/70">{draftNote}.</span>}
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
