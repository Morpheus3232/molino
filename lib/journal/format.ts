/**
 * Formato del diario sobre la selección de un textarea. Funciones puras: reciben
 * el texto y la selección y devuelven el texto nuevo con la selección ajustada,
 * así el editor solo aplica el resultado (y se prueban sin DOM).
 */

export interface Edit {
  value: string;
  start: number;
  end: number;
}

export type InlineMark = "**" | "*" | "==";

/** Envuelve la selección con la marca, o la quita si ya la tiene (adentro o alrededor). */
export function toggleWrap(value: string, start: number, end: number, mark: InlineMark): Edit {
  // Los espacios de los bordes quedan afuera: "**hola **" no es negrita.
  while (start < end && /\s/.test(value[start])) start++;
  while (end > start && /\s/.test(value[end - 1])) end--;
  if (start === end) return { value, start, end };

  const sel = value.slice(start, end);
  const n = mark.length;
  const isWrappedInside =
    sel.length > 2 * n && sel.startsWith(mark) && sel.endsWith(mark) && !(mark === "*" && sel.startsWith("**") && !sel.startsWith("***"));
  if (isWrappedInside) {
    const inner = sel.slice(n, -n);
    return { value: value.slice(0, start) + inner + value.slice(end), start, end: start + inner.length };
  }
  const before = value.slice(start - n, start);
  const after = value.slice(end, end + n);
  const surrounded =
    before === mark && after === mark && !(mark === "*" && (value[start - n - 1] === "*" || value[end + n] === "*"));
  if (surrounded) {
    return { value: value.slice(0, start - n) + sel + value.slice(end + n), start: start - n, end: end - n };
  }
  return { value: value.slice(0, start) + mark + sel + mark + value.slice(end), start: start + n, end: end + n };
}

/** Pone o saca "> " al principio de cada línea tocada por la selección. */
export function toggleQuote(value: string, start: number, end: number): Edit {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  let lineEnd = value.indexOf("\n", Math.max(end - (end > start && value[end - 1] === "\n" ? 1 : 0), start));
  if (lineEnd === -1) lineEnd = value.length;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const allQuoted = lines.filter((l) => l.trim()).every((l) => /^>\s?/.test(l));
  const next = lines.map((l) => (allQuoted ? l.replace(/^>\s?/, "") : l.trim() ? `> ${l}` : l)).join("\n");
  return { value: value.slice(0, lineStart) + next + value.slice(lineEnd), start: lineStart, end: lineStart + next.length };
}

/** Saca todas las marcas de la selección. */
export function clearFormat(value: string, start: number, end: number): Edit {
  const sel = value.slice(start, end);
  const clean = sel.replace(/\*\*|==/g, "").replace(/\*/g, "").replace(/^>\s?/gm, "");
  return { value: value.slice(0, start) + clean + value.slice(end), start, end: start + clean.length };
}

/** Inserta texto en el cursor, con un salto de párrafo si hace falta. */
export function insertAt(value: string, pos: number, text: string): Edit {
  const before = value.slice(0, pos);
  const sep = before.trim() === "" ? "" : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const next = before.trimEnd() === "" ? "" : before;
  const ins = (next ? sep : "") + text + " ";
  const v = next + ins + value.slice(pos);
  const p = next.length + ins.length;
  return { value: v, start: p, end: p };
}
