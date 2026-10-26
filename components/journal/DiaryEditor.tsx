"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useEditor, useEditorState, EditorContent, Extension, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Highlighter, Quote, List, RemoveFormatting, Undo2, Redo2 } from "lucide-react";
import { docToMarkdown, markdownToHtml } from "@/lib/journal/markdown";

/**
 * La hoja del diario: se escribe con el formato a la vista. Al seleccionar
 * texto aparece una barra flotante (y la misma barra está siempre arriba de la
 * hoja). Atajos: ⌘B negrita, ⌘I cursiva, ⌘E resaltar, ⌘⇧B cita, ⌘Z deshacer,
 * ⌘↵ guardar. También se puede escribir en markdown: **negrita**, *cursiva*,
 * ==resaltado==, "> " para citar y "- " para una lista.
 *
 * Lo que sale (onChange) es texto plano con esas marcas: ver lib/journal/markdown.
 */

export interface DiaryEditorHandle {
  /** Agrega una pregunta como renglón en cursiva y deja el cursor debajo. */
  insertPrompt: (text: string) => void;
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
  isMac?: boolean;
}

type Action = {
  key: string;
  label: string;
  shortcut?: string;
  Icon: typeof Bold;
  run: (e: Editor) => void;
  active?: (s: ActiveState) => boolean;
};

type ActiveState = { bold: boolean; italic: boolean; highlight: boolean; quote: boolean; list: boolean; canUndo: boolean; canRedo: boolean };

const ACTIONS: Action[] = [
  { key: "bold", label: "Negrita", shortcut: "B", Icon: Bold, run: (e) => e.chain().focus().toggleBold().run(), active: (s) => s.bold },
  { key: "italic", label: "Cursiva", shortcut: "I", Icon: Italic, run: (e) => e.chain().focus().toggleItalic().run(), active: (s) => s.italic },
  { key: "highlight", label: "Resaltar", shortcut: "E", Icon: Highlighter, run: (e) => e.chain().focus().toggleHighlight().run(), active: (s) => s.highlight },
  { key: "quote", label: "Cita", shortcut: "⇧B", Icon: Quote, run: (e) => e.chain().focus().toggleBlockquote().run(), active: (s) => s.quote },
  { key: "list", label: "Lista", shortcut: "⇧8", Icon: List, run: (e) => e.chain().focus().toggleBulletList().run(), active: (s) => s.list },
  {
    key: "clear",
    label: "Quitar formato",
    Icon: RemoveFormatting,
    run: (e) => e.chain().focus().unsetAllMarks().clearNodes().run(),
  },
];

function Buttons({
  editor,
  state,
  isMac,
  tone,
  withHistory = false,
}: {
  editor: Editor;
  state: ActiveState;
  isMac: boolean;
  tone: "dark" | "light";
  withHistory?: boolean;
}) {
  const mod = isMac ? "⌘" : "Ctrl+";
  const base =
    tone === "dark"
      ? "w-11 h-11 flex items-center justify-center transition-colors border-r border-paper/15 last:border-r-0"
      : "w-10 h-10 flex items-center justify-center transition-colors";
  const items = withHistory
    ? [
        ...ACTIONS,
        { key: "undo", label: "Deshacer", shortcut: "Z", Icon: Undo2, run: (e: Editor) => e.chain().focus().undo().run() } as Action,
        { key: "redo", label: "Rehacer", shortcut: "⇧Z", Icon: Redo2, run: (e: Editor) => e.chain().focus().redo().run() } as Action,
      ]
    : ACTIONS;
  return (
    <>
      {items.map((a) => {
        const on = a.active?.(state) ?? false;
        const disabled = (a.key === "undo" && !state.canUndo) || (a.key === "redo" && !state.canRedo);
        const cls =
          tone === "dark"
            ? on
              ? "bg-paper text-ink"
              : "text-paper hover:bg-paper/15"
            : on
              ? "bg-ink text-paper"
              : "text-foreground/70 hover:text-foreground hover:bg-ink/[0.06] disabled:opacity-30 disabled:hover:bg-transparent";
        return (
          <button
            key={a.key}
            type="button"
            disabled={disabled}
            // Que el clic no le saque el foco (ni la selección) al editor.
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => a.run(editor)}
            aria-label={a.label}
            aria-pressed={a.active ? on : undefined}
            title={a.shortcut ? `${a.label} (${mod}${a.shortcut})` : a.label}
            className={`${base} ${cls} ${tone === "light" && (a.key === "clear" || a.key === "undo") ? "ml-2 sm:ml-3" : ""}`}
          >
            <a.Icon className="w-[18px] h-[18px]" aria-hidden="true" />
          </button>
        );
      })}
    </>
  );
}

// Fuera del componente: un objeto nuevo en cada render haría que el menú
// reenvíe sus opciones al editor todo el tiempo.
const BUBBLE_OPTIONS = {
  placement: "top" as const,
  offset: 10,
  flip: { padding: { top: 96, bottom: 16 } },
  shift: { padding: 12 },
};

const DiaryEditor = forwardRef<DiaryEditorHandle, Props>(function DiaryEditor(
  { id, ariaLabel, initialMarkdown = "", placeholder = "", onChange, onSubmit, isMac = false },
  ref,
) {
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

  const state = useEditorState({
    editor,
    selector: ({ editor: e }): ActiveState =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            highlight: e.isActive("highlight"),
            quote: e.isActive("blockquote"),
            list: e.isActive("bulletList"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : { bold: false, italic: false, highlight: false, quote: false, list: false, canUndo: false, canRedo: false },
  }) ?? { bold: false, italic: false, highlight: false, quote: false, list: false, canUndo: false, canRedo: false };

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
      insertPrompt: (text: string) => {
        if (!editor) return;
        const { $from } = editor.state.selection;
        const emptyLine = $from.parent.type.name === "paragraph" && $from.parent.content.size === 0;
        const nodes = [
          { type: "paragraph", content: [{ type: "text", text, marks: [{ type: "italic" }] }] },
          { type: "paragraph" },
        ];
        const chain = editor.chain().focus();
        if (editor.isEmpty) chain.setContent({ type: "doc", content: nodes }).focus("end").run();
        else if (emptyLine) chain.insertContent(nodes).run();
        else chain.focus("end").insertContent(nodes).run();
        onChangeRef.current(docToMarkdown(editor.getJSON()));
      },
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
      {/* La barra de siempre: a la vista para descubrirla (y para el celular,
          donde la selección abre el menú del sistema). */}
      <div
        role="toolbar"
        aria-label="Formato"
        className="flex flex-wrap items-center gap-0.5 py-1.5 border-b border-ink/10"
      >
        {editor && <Buttons editor={editor} state={state} isMac={isMac} tone="light" withHistory />}
      </div>


      <EditorContent editor={editor} />
      {/* Después de EditorContent: el menú se registra cuando la vista ya existe. */}
      {editor && (
        <BubbleMenu
          editor={editor}
          options={BUBBLE_OPTIONS}
          className="z-30"
        >
          {/* role y nombre en un div propio: el menú no siempre reenvía atributos */}
          <div role="toolbar" aria-label="Formato de la selección" className="flex items-stretch bg-ink shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
            <Buttons editor={editor} state={state} isMac={isMac} tone="dark" />
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
