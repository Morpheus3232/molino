"use client";
import { useL, type Pick2 } from "@/lib/i18n/useL";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useEditor, useEditorState, EditorContent, Extension, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Highlighter, Quote } from "lucide-react";
import { docToMarkdown, markdownToHtml } from "@/lib/journal/markdown";

/**
 * La hoja del diario: se escribe con el formato a la vista. Al seleccionar
 * texto aparece una barrita con negrita, cursiva, resaltado y cita. Los atajos
 * de siempre (⌘B, ⌘I, ⌘E, ⌘Z) y ⌘↵ para guardar funcionan sin anunciarse.
 *
 * Lo que sale (onChange) es texto plano con marcas: ver lib/journal/markdown.
 */

export interface DiaryEditorHandle {
  setMarkdown: (md: string) => void;
  clear: () => void;
  focus: () => void;
}

interface Props {
  id: string;
  ariaLabel: string;
  initialMarkdown?: string;
  placeholder?: string;
  onChange: (md: string) => void;
  onSubmit?: () => void;
}

type Marks = { bold: boolean; italic: boolean; highlight: boolean; quote: boolean };

const ACTIONS = (L: Pick2): { key: keyof Marks; label: string; Icon: typeof Bold; run: (e: Editor) => void }[] => ([
  { key: "bold", label: L("Negrita", "Bold"), Icon: Bold, run: (e) => e.chain().focus().toggleBold().run() },
  { key: "italic", label: L("Cursiva", "Italic"), Icon: Italic, run: (e) => e.chain().focus().toggleItalic().run() },
  { key: "highlight", label: L("Resaltar", "Highlight"), Icon: Highlighter, run: (e) => e.chain().focus().toggleHighlight().run() },
  { key: "quote", label: L("Cita", "Quote"), Icon: Quote, run: (e) => e.chain().focus().toggleBlockquote().run() },
]);

const NONE: Marks = { bold: false, italic: false, highlight: false, quote: false };

// Fuera del componente: un objeto nuevo en cada render haría que el menú
// reenvíe sus opciones al editor todo el tiempo.
const BUBBLE_OPTIONS = {
  placement: "top" as const,
  offset: 10,
  flip: { padding: { top: 96, bottom: 16 } },
  shift: { padding: 12 },
};

const DiaryEditor = forwardRef<DiaryEditorHandle, Props>(function DiaryEditor(
  { id, ariaLabel, initialMarkdown = "", placeholder = "", onChange, onSubmit },
  ref,
) {
  const L = useL();
  // Los callbacks cambian en cada render; las extensiones los leen por ref.
  const onSubmitRef = useRef(onSubmit);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onSubmitRef.current = onSubmit;
    onChangeRef.current = onChange;
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        strike: false,
        horizontalRule: false,
        link: false,
        underline: false,
      }),
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({ placeholder }),
      Extension.create({
        name: "diaryShortcuts",
        addKeyboardShortcuts() {
          return {
            "Mod-e": () => this.editor.commands.toggleHighlight(),
            "Mod-Enter": () => {
              onSubmitRef.current?.();
              return true;
            },
          };
        },
      }),
    ],
    content: markdownToHtml(initialMarkdown),
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": ariaLabel,
        spellcheck: "true",
        lang: "es",
        class: "diary-prose font-serif text-[1.3125rem] sm:text-[1.375rem] text-foreground",
      },
    },
    onUpdate: ({ editor: e }) => onChangeRef.current(docToMarkdown(e.getJSON())),
  });

  const state =
    useEditorState({
      editor,
      selector: ({ editor: e }): Marks =>
        e
          ? { bold: e.isActive("bold"), italic: e.isActive("italic"), highlight: e.isActive("highlight"), quote: e.isActive("blockquote") }
          : NONE,
    }) ?? NONE;

  // Lo que llega antes de que el editor exista (un borrador) se aplica al crearse.
  const pending = useRef<string | null>(null);
  useEffect(() => {
    if (editor && pending.current !== null) {
      editor.commands.setContent(markdownToHtml(pending.current), { emitUpdate: false });
      pending.current = null;
    }
  }, [editor]);

  useImperativeHandle(
    ref,
    () => ({
      setMarkdown: (md: string) => {
        if (editor) editor.commands.setContent(markdownToHtml(md), { emitUpdate: false });
        else pending.current = md;
      },
      clear: () => {
        editor?.commands.clearContent(false);
      },
      focus: () => {
        editor?.commands.focus("end");
      },
    }),
    [editor],
  );

  return (
    <div className="diary-editor">


      <EditorContent editor={editor} />
      {/* Después de EditorContent: el menú se registra cuando la vista ya existe. */}
      {editor && (
        <BubbleMenu
          editor={editor}
          options={BUBBLE_OPTIONS}
          className="z-30"
        >
          {/* role y nombre en un div propio: el menú no siempre reenvía atributos */}
          <div role="toolbar" aria-label={L("Formato de la selección", "Selection formatting")} className="flex items-stretch bg-ink shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
            {ACTIONS(L).map(({ key, label, Icon, run }) => (
              <button
                key={key}
                type="button"
                // Que el clic no le saque la selección al editor.
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => run(editor)}
                aria-label={label}
                aria-pressed={state[key]}
                title={label}
                className={`w-11 h-11 flex items-center justify-center transition-colors border-r border-paper/15 last:border-r-0 ${
                  state[key] ? "bg-paper text-ink" : "text-paper hover:bg-paper/15"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
              </button>
            ))}
          </div>
        </BubbleMenu>
      )}
      {!editor && (
        // Mientras carga el editor (o sin JavaScript): la hoja vacía con su forma.
        <div className="min-h-[22rem] border-l border-ink/25" aria-hidden="true" />
      )}
    </div>
  );
});

export default DiaryEditor;
