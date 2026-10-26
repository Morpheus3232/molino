import { Fragment, type ReactNode } from "react";

/**
 * El formato del diario: un markdown mínimo que se escribe con la barra que
 * aparece al seleccionar texto (o con ⌘B, ⌘I, ⌘E).
 *
 *   **negrita**   *cursiva*   ==resaltado==   > cita (al principio de la línea)
 *
 * Se guarda como texto plano, así la entrada sigue siendo legible tal cual en
 * cualquier exportación, y acá se muestra con su forma.
 */

const INLINE = /(\*\*[^*\n]+?\*\*|==[^=\n]+?==|\*[^*\n]+?\*)/g;

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={i++} className="font-semibold text-foreground">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("==")) out.push(<mark key={i++} className="bg-vermilion/15 text-foreground px-0.5 -mx-0.5">{tok.slice(2, -2)}</mark>);
    else out.push(<em key={i++}>{tok.slice(1, -1)}</em>);
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block = { kind: "p" | "quote"; lines: string[] };

export function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const isQuote = /^>\s?/.test(raw);
    const line = isQuote ? raw.replace(/^>\s?/, "") : raw;
    const prev = blocks[blocks.length - 1];
    if (!isQuote && raw.trim() === "") {
      blocks.push({ kind: "p", lines: [] }); // corte de párrafo
      continue;
    }
    if (prev && prev.kind === (isQuote ? "quote" : "p") && prev.lines.length > 0) prev.lines.push(line);
    else blocks.push({ kind: isQuote ? "quote" : "p", lines: [line] });
  }
  return blocks.filter((b) => b.lines.length > 0);
}

export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = toBlocks(text);
  return (
    <div className={`space-y-4 [&_p]:text-inherit ${className}`}>
      {blocks.map((b, bi) =>
        b.kind === "quote" ? (
          <blockquote key={bi} className="border-l-2 border-vermilion pl-5 italic text-foreground/90">
            {b.lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l)}
              </Fragment>
            ))}
          </blockquote>
        ) : (
          <p key={bi}>
            {b.lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l)}
              </Fragment>
            ))}
          </p>
        ),
      )}
    </div>
  );
}
