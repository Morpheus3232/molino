"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/types/user";
import { buildBirthGrid, getMissingReading } from "@/lib/engines/birthGridEngine";
import EditorialSection from "@/components/ui/EditorialSection";

/**
 * "Tu cuadro de nacimiento" — reemplaza al radar de dimensiones.
 *
 * El radar anterior graficaba aritmética arbitraria (`lifePath * 10`,
 * `50 + (lp % 5) * 10`) y trataba etiquetas ordinales como magnitudes. Acá
 * cada casilla es un conteo: cuántas veces aparece ese dígito en la fecha.
 * El lector puede rehacerlo contando los dígitos que están impresos arriba.
 *
 * Estructura: insumo (los dígitos) → distribución (la grilla y la lista de
 * presencia) → lectura (las líneas). Una sola progresión, de lo verificable
 * a lo interpretado.
 */
export default function BirthGridSection({ profile }: { profile: UserProfile }) {
  const grid = useMemo(() => {
    const fecha = typeof profile.birthDate === "string" ? profile.birthDate : "";
    return fecha ? buildBirthGrid(fecha) : null;
  }, [profile.birthDate]);

  if (!grid || grid.digits.length === 0) return null;

  const { digits, grid: casillas, counts, missing, repeated, lines } = grid;

  // Antes eran dos listas separadas ("lo que se repite" / "lo que no
  // aparece") con el mismo formato: dos escaneos para leer una sola
  // distribución. Ahora es una sola lista ordenada por presencia, con un
  // corte visual donde empieza lo ausente.
  const presentes = Object.entries(counts)
    .map(([d, c]) => ({ digit: Number(d), count: c }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count || a.digit - b.digit);

  const maxCount = Math.max(...presentes.map((e) => e.count), 1);

  return (
    <EditorialSection
      tone="paperAlt"
      eyebrow="TU CUADRO DE NACIMIENTO"
      title={<>LOS DÍGITOS<br />DE TU FECHA.</>}
      intro="Se cuenta cuántas veces aparece cada dígito del 1 al 9 en tu fecha y se ubica en la grilla Lo Shu. Podés rehacer la cuenta a mano."
    >
      <div className="pt-4">
        {/* 1 — El insumo, en crudo y antes que nada. */}
        <div className="mb-10 pb-8 border-b border-ink/10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Los dígitos de tu fecha
          </p>
          <p className="font-mono text-3xl sm:text-4xl text-foreground tracking-[0.28em] tabular-nums">
            {digits.join(" ")}
          </p>
          <p className="mt-3 text-sm text-muted">
            {digits.length} dígitos. Los ceros no se colocan: la grilla va del 1 al 9.
          </p>
        </div>

        {/* 2 — La distribución: grilla y lista, dos vistas del mismo dato. */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start mb-12">
          <div>
            <div className="grid grid-cols-3 border-t border-l border-ink/15">
              {casillas.flat().map((c) => {
                const presente = c.count > 0;
                return (
                  <div
                    key={c.digit}
                    className="border-r border-b border-ink/15 aspect-square flex flex-col items-center justify-center gap-1"
                    style={
                      presente
                        ? {
                            backgroundColor: `rgb(var(--color-accent-rgb) / ${
                              0.05 + (c.count / maxCount) * 0.15
                            })`,
                          }
                        : undefined
                    }
                    title={`${c.digit} · ${c.meaning}`}
                  >
                    {/* Un solo dígito. Repetirlo ("99" para el 9 dos veces)
                        se leía como noventa y nueve. */}
                    <span
                      className={`font-display text-3xl sm:text-4xl leading-none ${
                        presente ? "text-foreground" : "text-ink/20"
                      }`}
                    >
                      {c.digit}
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        presente ? "text-accent" : "text-ink/25"
                      }`}
                    >
                      {presente ? `×${c.count}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-xs text-muted">Disposición Lo Shu</p>
          </div>

          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Qué aparece y qué falta
            </p>
            <ul className="border-t border-ink/10">
              {presentes.map((e) => (
                <li
                  key={e.digit}
                  className="flex items-baseline gap-4 py-3 border-b border-ink/10"
                >
                  <span className="font-mono text-sm text-accent tabular-nums shrink-0 w-10">
                    {e.digit}
                    <span className="text-muted"> ×{e.count}</span>
                  </span>
                  <span className="text-sm text-foreground">{getMissingReading(e.digit)}</span>
                </li>
              ))}
              {missing.map((d, i) => (
                <li
                  key={d}
                  className={`flex items-baseline gap-4 py-3 border-b border-ink/10 ${
                    i === 0 ? "border-t border-t-ink/25 pt-4" : ""
                  }`}
                >
                  <span className="font-mono text-sm text-ink/30 tabular-nums shrink-0 w-10">
                    {d}
                    <span className="sr-only"> ausente</span>
                  </span>
                  <span className="text-sm text-muted">{getMissingReading(d)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              {presentes.length} dígitos presentes
              {repeated.length > 0
                ? `, ${repeated.length} repetido${repeated.length > 1 ? "s" : ""}`
                : ""}
              {missing.length > 0 ? ` · ${missing.length} en gris no aparecen` : ""}
            </p>
          </div>
        </div>

        {/* 3 — La lectura, ya interpretada, al final. */}
        {lines.length > 0 && (
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Líneas de la grilla
            </p>
            <ul className="border-t border-ink/10">
              {lines.map((l) => (
                <li key={l.name} className="py-5 border-b border-ink/10">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span
                      className={`font-mono text-sm tabular-nums shrink-0 ${
                        l.state === "full" ? "text-accent" : "text-ink/30"
                      }`}
                    >
                      {l.digits.join("-")}
                    </span>
                    <span className="font-heading text-base font-bold text-foreground">
                      {l.name}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                      {l.state === "full" ? "completa" : "vacía"} · {l.kind}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">{l.reading}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10 text-xs text-muted italic max-w-xl">
          El conteo es aritmética verificable. Las lecturas de repeticiones,
          ausencias y líneas son interpretación de una tradición numerológica,
          no una medición de tu persona.
        </p>
      </div>
    </EditorialSection>
  );
}
