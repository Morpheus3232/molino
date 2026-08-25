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
 */
export default function BirthGridSection({ profile }: { profile: UserProfile }) {
  const grid = useMemo(() => {
    const fecha = typeof profile.birthDate === "string" ? profile.birthDate : "";
    return fecha ? buildBirthGrid(fecha) : null;
  }, [profile.birthDate]);

  if (!grid || grid.digits.length === 0) return null;

  const { digits, grid: casillas, missing, repeated, lines } = grid;
  const completas = lines.filter((l) => l.state === "full");
  const vacias = lines.filter((l) => l.state === "empty");
  const maxCount = Math.max(...Object.values(grid.counts), 1);

  return (
    <EditorialSection
      tone="paperAlt"
      numeral="01"
      eyebrow="TU CUADRO DE NACIMIENTO"
      title={<>LOS DÍGITOS<br />DE TU FECHA.</>}
      intro="Se cuenta cuántas veces aparece cada dígito del 1 al 9 en tu fecha de nacimiento y se ubica en la grilla Lo Shu. Podés rehacer la cuenta a mano con los dígitos de acá abajo."
    >
      <div className="pt-4">
        {/* Los dígitos en crudo: el insumo, antes del resultado. Sin esto la
            grilla sería otra caja negra. */}
        <div className="mb-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Los dígitos que se cuentan
          </h3>
          <p className="font-mono text-2xl sm:text-3xl text-foreground tracking-[0.3em] tabular-nums">
            {digits.join(" ")}
          </p>
          <p className="mt-2 text-xs text-muted">
            {digits.length} dígitos. Los ceros no se colocan: la grilla va del 1 al 9.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-start">
          {/* La grilla 3×3 */}
          <div>
            <div className="grid grid-cols-3 border-t border-l border-ink/15 w-full max-w-[300px]">
              {casillas.flat().map((c) => {
                const presente = c.count > 0;
                return (
                  <div
                    key={c.digit}
                    className="relative border-r border-b border-ink/15 aspect-square flex flex-col items-center justify-center"
                    // La intensidad codifica el conteo, que es un dato real.
                    style={
                      presente
                        ? { backgroundColor: `rgb(var(--color-accent-rgb) / ${0.06 + (c.count / maxCount) * 0.16})` }
                        : undefined
                    }
                    title={`${c.digit}: ${c.meaning}`}
                  >
                    <span
                      className={`font-display text-3xl sm:text-4xl leading-none ${
                        presente ? "text-accent" : "text-ink/20"
                      }`}
                    >
                      {presente ? String(c.digit).repeat(c.count) : c.digit}
                    </span>
                    <span className="mt-1.5 font-mono text-xs text-muted tabular-nums">
                      {c.count > 0 ? `×${c.count}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-xs text-muted">
              Disposición Lo Shu · en gris, los dígitos que no aparecen
            </p>
          </div>

          {/* Lecturas */}
          <div className="min-w-0">
            {repeated.length > 0 && (
              <div className="mb-8">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                  Lo que se repite
                </h3>
                <ul className="border-t border-ink/10">
                  {repeated.map((r) => (
                    <li
                      key={r.digit}
                      className="flex items-baseline gap-4 py-3 border-b border-ink/10"
                    >
                      <span className="font-mono text-sm text-accent tabular-nums shrink-0">
                        {r.digit}×{r.count}
                      </span>
                      <span className="text-sm text-foreground">{getMissingReading(r.digit)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {missing.length > 0 && (
              <div className="mb-8">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                  Lo que no aparece
                </h3>
                <ul className="border-t border-ink/10">
                  {missing.map((d) => (
                    <li key={d} className="flex items-baseline gap-4 py-3 border-b border-ink/10">
                      <span className="font-mono text-sm text-muted tabular-nums shrink-0">{d}</span>
                      <span className="text-sm text-muted">{getMissingReading(d)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(completas.length > 0 || vacias.length > 0) && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                  Líneas completas y vacías
                </h3>
                <ul className="border-t border-ink/10">
                  {[...completas, ...vacias].map((l) => (
                    <li key={l.name} className="py-4 border-b border-ink/10">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="font-mono text-xs tabular-nums text-accent">
                          {l.digits.join("-")}
                        </span>
                        <span className="font-heading text-sm font-bold text-foreground">
                          {l.name}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                          {l.state === "full" ? "completa" : "vacía"} · {l.kind}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted leading-relaxed">{l.reading}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="mt-10 text-xs text-muted italic max-w-xl">
          El conteo es aritmética verificable. Las lecturas de repeticiones,
          ausencias y líneas son interpretación de una tradición numerológica,
          no una medición de tu persona.
        </p>
      </div>
    </EditorialSection>
  );
}
