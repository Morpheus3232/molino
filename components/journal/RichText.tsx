import { useL } from "@/lib/i18n/useL";
import { Fragment, type ReactNode } from "react";
import { toBlocks, parseInline } from "@/lib/journal/markdown";

/**
 * Muestra una página del diario con su formato: negrita, cursiva, resaltado,
 * citas y listas (ver lib/journal/markdown.ts). Lo guardado es texto plano.
 */

export function renderInline(text: string): ReactNode[] {
  return parseInline(text).map((t, i) => {
    let node: ReactNode = t.text;
    if (t.italic) node = <em>{node}</em>;
    if (t.bold) node = <strong className="font-semibold text-foreground">{node}</strong>;
    if (t.highlight) node = <mark className="diary-mark">{node}</mark>;
    return <Fragment key={i}>{node}</Fragment>;
  });
}

const lines = (ls: string[]) =>
  ls.map((l, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {renderInline(l)}
    </Fragment>
  ));

export { toBlocks };

export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  const L = useL();
  return (
    <div className={`diary-prose ${className}`}>
      {toBlocks(text).map((b, bi) => {
        if (b.kind === "quote") return <blockquote key={bi}><p>{L.t(lines(b.lines))}</p></blockquote>;
        if (b.kind === "ul") return <ul key={bi}>{b.lines.map((l, li) => <li key={li}>{L.t(renderInline(l))}</li>)}</ul>;
        if (b.kind === "ol") return <ol key={bi}>{b.lines.map((l, li) => <li key={li}>{L.t(renderInline(l))}</li>)}</ol>;
        return <p key={bi}>{L.t(lines(b.lines))}</p>;
      })}
    </div>
  );
}
