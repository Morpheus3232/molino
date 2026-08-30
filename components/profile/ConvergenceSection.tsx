"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/types/user";
import { buildSynthesis } from "@/lib/engines/synthesisEngine";
import EditorialSection from "@/components/ui/EditorialSection";

/**
 * "Dónde coinciden tus sistemas" — la lectura directa del MODELO PERSONAL
 * unificado (`buildSynthesis`): dónde dos o tres sistemas, calculados por
 * caminos distintos, apuntan a lo mismo (convergencias), dónde describen
 * dominios distintos sin chocar (diferencias), y qué NO se puede afirmar con
 * precisión para este perfil (incertidumbre).
 *
 * Cada fila muestra la EVIDENCIA en mono: la derivación es verificable a ojo,
 * sin pedirle al lector que confíe en el resultado. Misma fuente que consume
 * la Lectura paga y la IA — acá no se re-deriva nada.
 */
export default function ConvergenceSection({ profile }: { profile: UserProfile }) {
  const synth = useMemo(() => {
    try {
      return buildSynthesis(profile);
    } catch {
      return null;
    }
  }, [profile]);

  if (!synth) return null;

  const { convergences, differences, uncertainties, systemsEngaged } = synth;
  const n = convergences.length;

  return (
    <EditorialSection
      tone="paper"
      eyebrow="DONDE COINCIDEN TUS SISTEMAS"
      title={
        n > 0 ? (
          <>
            {n === 1 ? "UN CRUCE" : `${n} CRUCES`}
            <br />
            {n === 1 ? "REAL." : "REALES."}
          </>
        ) : (
          <>
            CADA SISTEMA
            <br />
            APUNTA A OTRO LADO.
          </>
        )
      }
      intro={
        n > 0
          ? `${systemsEngaged.join(", ")} se cruzan en tu mapa. Cuando sistemas que se calculan por separado dan el mismo resultado, estas tradiciones lo leen como un patrón más marcado — no como una predicción.`
          : "Ninguna de tus capas coincide con otra ahora: cada sistema apunta a algo distinto. En estas tradiciones eso se lee como un momento de exploración en varios frentes, no como una falta."
      }
    >
      <div className="pt-4">
        {n > 0 && (
          <>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Convergencias
            </h3>
            <ul className="border-t border-ink/10 mb-12">
              {convergences.map((c, i) => (
                <li
                  key={c.evidence}
                  className="flex items-baseline gap-4 py-5 border-b border-ink/10"
                >
                  <span className="font-mono text-xs text-ink/30 tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-1.5">
                      {c.systems.join(" × ")}
                    </p>
                    <p className="text-base text-foreground leading-relaxed">{c.statement}</p>
                    <p className="mt-1.5 font-mono text-xs text-muted">{c.evidence}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {differences.length > 0 && (
          <>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Diferencias (no son contradicciones)
            </h3>
            <ul className="border-t border-ink/10 mb-12">
              {differences.map((d) => (
                <li
                  key={d.evidence}
                  className="flex items-baseline gap-4 py-5 border-b border-ink/10"
                >
                  <span className="font-mono text-xs text-ink/30 shrink-0" aria-hidden="true">
                    ·
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted mb-1.5">
                      {d.systems.join(" × ")}
                    </p>
                    <p className="text-base text-foreground leading-relaxed">{d.statement}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {uncertainties.length > 0 && (
          <div className="mt-2 border-t border-ink/10 pt-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
              Lo que Molino no puede afirmar de vos
            </h3>
            <ul className="space-y-3">
              {uncertainties.map((u) => (
                <li key={u.field} className="text-sm text-muted leading-relaxed max-w-xl">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-foreground">
                    {u.field}
                  </span>
                  {" — "}
                  {u.note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </EditorialSection>
  );
}
