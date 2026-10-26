/**
 * El diario se guarda como texto plano con un markdown mínimo, y se edita con
 * formato a la vista (Tiptap). Estas funciones pasan de uno al otro:
 *
 *   **negrita**   *cursiva*   ==resaltado==
 *   > cita        - viñeta    1. lista numerada
 *
 * Párrafos separados por una línea en blanco; un salto de línea dentro de un
 * párrafo es un salto manual. Así una página vieja (texto sin marcas) se abre
 * igual que siempre, y lo guardado sigue siendo legible en cualquier lado.
 */

export type BlockKind = "p" | "quote" | "ul" | "ol";
export interface Block {
  kind: BlockKind;
  lines: string[];
}

const QUOTE = /^>\s?/;
const UL = /^[-•]\s+/;
const OL = /^\d+[.)]\s+/;

function kindOf(raw: string): BlockKind {
  if (QUOTE.test(raw)) return "quote";
  if (UL.test(raw)) return "ul";
  if (OL.test(raw)) return "ol";
  return "p";
}

function stripPrefix(raw: string, kind: BlockKind): string {
  if (kind === "quote") return raw.replace(QUOTE, "");
  if (kind === "ul") return raw.replace(UL, "");
  if (kind === "ol") return raw.replace(OL, "");
  return raw;
}

/** Corta el texto en bloques: párrafos, citas y listas. */
export function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let open: Block | null = null;
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    if (raw.trim() === "") {
      open = null; // corte de párrafo (o de cita/lista)
      continue;
    }
    const kind = kindOf(raw);
    const line = stripPrefix(raw, kind);
    if (open && open.kind === kind) open.lines.push(line);
    else {
      open = { kind, lines: [line] };
      blocks.push(open);
    }
  }
  return blocks;
}

/* ─────────────────────────── Marcas en línea ─────────────────────────── */

export type InlineToken = { text: string; bold?: boolean; italic?: boolean; highlight?: boolean };

const INLINE = /(\*\*\*(?=\S)[\s\S]*?\S\*\*\*|\*\*(?=\S)[\s\S]*?\S\*\*|==(?=\S)[\s\S]*?\S==|\*(?=[^\s*])[^*]*?[^\s*]\*|\*[^\s*]\*)/;

/** Parte una línea en trozos con sus marcas (se pueden combinar: ***ambas***, ==**resaltada y en negrita**==). */
export function parseInline(text: string, marks: Omit<InlineToken, "text"> = {}): InlineToken[] {
  const out: InlineToken[] = [];
  let rest = text;
  while (rest) {
    const m = INLINE.exec(rest);
    if (!m) {
      out.push({ text: rest, ...marks });
      break;
    }
    if (m.index > 0) out.push({ text: rest.slice(0, m.index), ...marks });
    const tok = m[0];
    if (tok.startsWith("***")) out.push(...parseInline(tok.slice(3, -3), { ...marks, bold: true, italic: true }));
    else if (tok.startsWith("**")) out.push(...parseInline(tok.slice(2, -2), { ...marks, bold: true }));
    else if (tok.startsWith("==")) out.push(...parseInline(tok.slice(2, -2), { ...marks, highlight: true }));
    else out.push(...parseInline(tok.slice(1, -1), { ...marks, italic: true }));
    rest = rest.slice(m.index + tok.length);
  }
  return out.filter((t) => t.text);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inlineToHtml(line: string): string {
  return parseInline(line)
    .map((t) => {
      let h = esc(t.text);
      if (t.italic) h = `<em>${h}</em>`;
      if (t.bold) h = `<strong>${h}</strong>`;
      if (t.highlight) h = `<mark>${h}</mark>`;
      return h;
    })
    .join("");
}

/** Texto guardado → HTML para abrirlo en el editor. */
export function markdownToHtml(md: string): string {
  return toBlocks(md)
    .map((b) => {
      if (b.kind === "ul" || b.kind === "ol") {
        const tag = b.kind;
        return `<${tag}>${b.lines.map((l) => `<li><p>${inlineToHtml(l)}</p></li>`).join("")}</${tag}>`;
      }
      const p = `<p>${b.lines.map(inlineToHtml).join("<br>")}</p>`;
      return b.kind === "quote" ? `<blockquote>${p}</blockquote>` : p;
    })
    .join("");
}

/* ─────────────────────────── Del editor al texto ─────────────────────────── */

export interface PMNode {
  type: string;
  text?: string;
  marks?: { type: string }[];
  content?: PMNode[];
}

function markSet(n: PMNode) {
  const t = new Set((n.marks ?? []).map((m) => m.type));
  return { bold: t.has("bold"), italic: t.has("italic"), highlight: t.has("highlight") };
}

/** Contenido en línea de un párrafo → texto con marcas. */
function inlineToMarkdown(nodes: PMNode[] = []): string {
  // Agrupa trozos seguidos con las mismas marcas para no cortar "**a****b**".
  const runs: { text: string; bold: boolean; italic: boolean; highlight: boolean }[] = [];
  for (const n of nodes) {
    if (n.type === "hardBreak") {
      runs.push({ text: "\n", bold: false, italic: false, highlight: false });
      continue;
    }
    if (n.type !== "text" || !n.text) continue;
    const m = markSet(n);
    const last = runs[runs.length - 1];
    if (last && last.text !== "\n" && last.bold === m.bold && last.italic === m.italic && last.highlight === m.highlight) last.text += n.text;
    else runs.push({ text: n.text, ...m });
  }
  return runs
    .map((r) => {
      if (r.text === "\n" || (!r.bold && !r.italic && !r.highlight)) return r.text;
      // Los espacios de los bordes quedan afuera de las marcas.
      const lead = r.text.match(/^\s*/)?.[0] ?? "";
      const trail = r.text.match(/\s*$/)?.[0] ?? "";
      const core = r.text.slice(lead.length, r.text.length - trail.length);
      if (!core) return r.text;
      let s = core;
      if (r.italic) s = `*${s}*`;
      if (r.bold) s = `**${s}**`;
      if (r.highlight) s = `==${s}==`;
      return lead + s + trail;
    })
    .join("");
}

function blockText(n: PMNode): string {
  return (n.content ?? []).map((c) => (c.type === "paragraph" ? inlineToMarkdown(c.content) : blockText(c))).join("\n");
}

/** Documento del editor (JSON de Tiptap) → texto para guardar. */
export function docToMarkdown(doc: PMNode): string {
  const parts: string[] = [];
  for (const n of doc.content ?? []) {
    if (n.type === "paragraph") parts.push(inlineToMarkdown(n.content));
    else if (n.type === "blockquote")
      parts.push(
        blockText(n)
          .split("\n")
          .map((l) => `> ${l}`.trimEnd())
          .join("\n"),
      );
    else if (n.type === "bulletList" || n.type === "orderedList")
      parts.push(
        (n.content ?? [])
          .map((li, i) => `${n.type === "bulletList" ? "-" : `${i + 1}.`} ${blockText(li).replace(/\n/g, " ")}`)
          .join("\n"),
      );
    else parts.push(blockText(n));
  }
  return parts
    .map((p) => p.replace(/\s+$/g, ""))
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

/** Texto sin marcas (para resúmenes y buscadores). */
export function plainText(md: string): string {
  return toBlocks(md)
    .map((b) => b.lines.map((l) => parseInline(l).map((t) => t.text).join("")).join("\n"))
    .join("\n\n");
}
