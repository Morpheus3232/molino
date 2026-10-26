import Link from "next/link";
import type { ReactNode } from "react";
import WheelMark from "@/components/knowledge/WheelMark";

/**
 * Piezas comunes de las fichas de Conocimiento (número, signo, animal), con
 * el mismo lenguaje que Mi Mapa y Mi Lectura: papel, filetes de tinta,
 * Garamond grande, bermellón solo para lo que relaciona, sin tarjetas con
 * sombra ni texturas.
 */

export const CONTAINER = "mx-auto max-w-8xl px-4 sm:px-8 lg:px-12";

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 && <span className="mx-2" aria-hidden="true">/</span>}
          {it.href ? (
            <Link href={it.href} className="underline decoration-ink/25 underline-offset-4 hover:text-foreground hover:decoration-foreground">
              {it.label}
            </Link>
          ) : (
            <span className="text-foreground" aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Fila de leyenda: una marca y lo que significa, como en Mi Mapa. */
export interface LegendRow {
  mark: ReactNode;
  text: ReactNode;
}

export const MARKS = {
  ink: <WheelMark part="outer" />,
  trine: <WheelMark part="trine" />,
  dashed: <WheelMark part="opposite" />,
  /** Cuadrado Lo Shu en miniatura: una casilla en tinta. */
  cell: (
    <svg viewBox="0 0 30 30" className="w-7 h-7 text-foreground" aria-hidden="true">
      <rect x="10.5" y="0.5" width="9" height="9" fill="currentColor" />
      <path d="M0.5 0.5h29v29h-29zM10.5 0.5v29M19.5 0.5v29M0.5 10.5h29M0.5 19.5h29" fill="none" stroke="currentColor" strokeOpacity="0.3" />
    </svg>
  ),
  /** Cuadrado Lo Shu en miniatura: una fila marcada. */
  row: (
    <svg viewBox="0 0 30 30" className="w-7 h-7 text-foreground" aria-hidden="true">
      <path d="M0.5 0.5h29v29h-29zM10.5 0.5v29M19.5 0.5v29M0.5 10.5h29M0.5 19.5h29" fill="none" stroke="currentColor" strokeOpacity="0.3" />
      <rect x="1.3" y="1.3" width="27.4" height="8.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
};

export function KnowledgeHero({
  crumbs,
  eyebrow,
  title,
  lead,
  meta,
  legend,
  aside,
  titleClassName,
}: {
  titleClassName?: string;
  crumbs: { href?: string; label: string }[];
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  meta?: ReactNode;
  legend?: LegendRow[];
  aside: ReactNode;
}) {
  return (
    <header className="border-b border-ink/10">
      <div className={`${CONTAINER} pt-12 sm:pt-16 pb-16 sm:pb-24`}>
        <Breadcrumb items={crumbs} />
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 items-center">
          <div className="lg:col-span-6">
            <p className="text-sm text-accent mb-4 label-caps">{eyebrow}</p>
            <h1 className={`font-display font-normal leading-[0.95] tracking-tight text-foreground ${titleClassName ?? "text-[clamp(3.5rem,9vw,7rem)]"}`}>
              {title}
            </h1>
            {lead && <p className="mt-6 text-xl sm:text-2xl text-foreground/85 leading-snug max-w-xl">{lead}</p>}
            {meta && <div className="mt-6 text-base text-muted">{meta}</div>}
            {legend && legend.length > 0 && (
              <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 max-w-xl">
                {legend.map((row, i) => (
                  <div key={i} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-3 items-start">
                    <dt className="pt-0.5" aria-hidden="true">{row.mark}</dt>
                    <dd className="text-base leading-snug text-muted">{row.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="lg:col-span-6">{aside}</div>
        </div>
      </div>
    </header>
  );
}

export function KnowledgeSection({
  label,
  title,
  intro,
  tone = "paper",
  children,
}: {
  label: string;
  title?: ReactNode;
  intro?: ReactNode;
  tone?: "paper" | "alt";
  children: ReactNode;
}) {
  return (
    <section className={`${tone === "alt" ? "bg-paper-alt/70" : "bg-background"} border-b border-ink/10`}>
      <div className={`${CONTAINER} py-16 sm:py-24`}>
        <p className="text-sm text-muted mb-3 label-caps">{label}</p>
        {title && <h2 className="section-title text-foreground max-w-3xl">{title}</h2>}
        {intro && <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl">{intro}</p>}
        <div className={title || intro ? "mt-10" : ""}>{children}</div>
      </div>
    </section>
  );
}

/** Columnas con filetes (rasgos, fortalezas, desafíos…). */
export function Columns({ cols }: { cols: { title: string; items?: string[]; body?: ReactNode }[] }) {
  const grid = cols.length === 2 ? "md:grid-cols-2" : cols.length === 3 ? "md:grid-cols-3" : cols.length >= 5 ? "sm:grid-cols-2 lg:grid-cols-5" : "md:grid-cols-4";
  return (
    <div className={`grid grid-cols-1 ${grid} gap-px bg-ink/15 border border-ink/15`}>
      {cols.map((c) => (
        <div key={c.title} className="bg-background p-6 sm:p-8">
          <h3 className="font-display font-normal text-2xl text-foreground">{c.title}</h3>
          {c.items && (
            <ul className="mt-4 space-y-2.5">
              {c.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-lg text-foreground/90 leading-snug">
                  <span className="w-3 h-px bg-ink/50 mt-[0.8em] shrink-0" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          )}
          {c.body && <div className="mt-3 text-lg text-foreground/85 leading-relaxed">{c.body}</div>}
        </div>
      ))}
    </div>
  );
}

/** Texto principal + lámina al costado. */
export function TextWithFigure({ children, figure }: { children: ReactNode; figure: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <div className="lg:col-span-7 space-y-6 text-lg sm:text-xl leading-relaxed text-foreground/90">{children}</div>
      <div className="lg:col-span-5">{figure}</div>
    </div>
  );
}

export function Closing({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="border-2 border-ink p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div className="max-w-xl">
        <h2 className="font-display font-normal text-3xl sm:text-4xl leading-tight text-foreground">{title}</h2>
        <p className="mt-3 text-lg text-muted leading-relaxed">{text}</p>
      </div>
      <Link
        href={href}
        className="shrink-0 inline-flex items-center justify-center px-8 py-4 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors label-caps"
      >
        {cta}
      </Link>
    </div>
  );
}

export function Note({ title = "Para tener en cuenta", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mt-10 max-w-3xl text-base text-muted leading-relaxed space-y-2">
      <p className="text-sm label-caps">{title}</p>
      {children}
    </div>
  );
}

export function PrevNext({
  prev,
  next,
  label = "Navegación",
}: {
  prev?: { href: string; name: ReactNode } | null;
  next?: { href: string; name: ReactNode } | null;
  label?: string;
}) {
  return (
    <nav aria-label={label} className="mt-14 grid grid-cols-2 border-t-2 border-ink">
      {prev ? (
        <Link href={prev.href} className="group py-6 pr-4">
          <span className="block text-sm text-muted label-caps">Anterior</span>
          <span className="mt-1 block font-display text-2xl sm:text-3xl text-foreground group-hover:underline underline-offset-4">
            {prev.name}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="group py-6 pl-4 text-right border-l border-ink/15">
          <span className="block text-sm text-muted label-caps">Siguiente</span>
          <span className="mt-1 block font-display text-2xl sm:text-3xl text-foreground group-hover:underline underline-offset-4">
            {next.name}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
