import type { ReactNode } from "react";

/**
 * Renderiza el texto de /privacidad y /terminos. Antes se imprimía el string
 * crudo con whitespace-pre-line: los **negrita** salían con asteriscos y las
 * tablas como filas de "|". Entiende solo lo que esas páginas usan: párrafos,
 * listas "- ", tablas "| a | b |", **negrita** y `código`.
 */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="font-mono text-[0.9em]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

export default function LegalText({ body }: { body: string }) {
  const blocks: ReactNode[] = [];
  const lines = body.split("\n");

  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.trimStart().startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith("|")) rows.push(lines[i++]);
      const [head, ...rest] = rows.filter((r) => !/^\s*\|[\s:|-]+\|\s*$/.test(r));
      const headers = cells(head);
      blocks.push(
        // En celular, una tarjeta por fila: tres columnas no entran en 390px.
        <div key={`m${i}`} className="sm:hidden divide-y divide-ink/10 border-y border-ink/10">
          {rest.map((r, k) => {
            const [first, ...others] = cells(r);
            return (
              <div key={k} className="py-3 space-y-1">
                <p className="font-semibold text-foreground">{inline(first)}</p>
                {others.map((c, j) => (
                  <p key={j}><span className="text-muted">{headers[j + 1]}: </span>{inline(c)}</p>
                ))}
              </div>
            );
          })}
        </div>,
        <div key={i} className="hidden sm:block">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr>{headers.map((c, j) => <th key={j} className="border-b border-ink/15 py-2 pr-3 font-semibold text-foreground">{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {rest.map((r, k) => (
                <tr key={k}>{cells(r).map((c, j) => <td key={j} className="border-b border-ink/10 py-2 pr-3 align-top">{inline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) items.push(lines[i++].slice(2));
      blocks.push(
        <ul key={i} className="list-disc pl-5 space-y-1">
          {items.map((it, k) => <li key={k}>{inline(it)}</li>)}
        </ul>,
      );
      continue;
    }

    blocks.push(<p key={i}>{inline(line)}</p>);
    i++;
  }

  return <div className="space-y-3">{blocks}</div>;
}
