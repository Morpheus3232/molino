"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/types/user";
import { buildConvergence } from "@/lib/engines/convergentEngine";
import EditorialSection from "@/components/ui/EditorialSection";

/**
 * "Dónde coinciden tus sistemas" — la respuesta más directa a "¿cómo estoy
 * configurado?": no qué dice cada sistema por separado, sino dónde dos
 * sistemas que se calculan por caminos distintos dan el mismo resultado.
 *
 * `convergentEngine` ya computaba esto y no lo consumía nadie en el repo.
 *
 * Cada coincidencia se muestra con la REGLA que la produjo al lado, en mono.
 * Ese es el diferencial del producto: el hallazgo es verificable a ojo, sin
 * pedirle al lector que confíe en el resultado.
 */
export default function ConvergenceSection({ profile }: { profile: UserProfile }) {
  const convergence = useMemo(() => {
    try {
      return buildConvergence(profile);
    } catch {
      return null;
    }
  }, [profile]);

  // Silencio explícito: si el cálculo falla no desaparece la sección sin
  // explicación (el patrón que la auditoría marcó en AtlasAffinitySummary),
  // simplemente no se monta porque no hay nada verdadero que decir.
  if (!convergence) return null;

  const { layers, matches, convergentCount, convergenceLevel, insight } = convergence;
  const totalPosibles = 4;

  return (
    <EditorialSection
      tone="paper"
      numeral="02"
      eyebrow="DONDE COINCIDEN TUS SISTEMAS"
      title={
        convergentCount > 0 ? (
          <>
            {convergentCount === 1 ? "UN SISTEMA" : `${convergentCount} SISTEMAS`}
            <br />
            SE REPITEN.
          </>
        ) : (
          <>
            CADA SISTEMA
            <br />
            APUNTA A OTRO LADO.
          </>
        )
      }
      intro={insight}
    >
      <div className="pt-4">
        {/* Las cinco capas que entran al cruce, con su valor. Es el insumo:
            se muestra antes que el resultado para que el cruce se pueda
            seguir. */}
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
          Las capas que se cruzan
        </h3>
        <ul className="border-t border-ink/10 mb-12">
          {layers.map((layer) => {
            const participa = matches.some((m) => m.between.includes(layer.id));
            return (
              <li
                key={layer.id}
                className="flex items-baseline justify-between gap-4 py-3 border-b border-ink/10"
              >
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  {layer.name}
                </span>
                <span
                  className={`font-heading text-base ${
                    participa ? "text-accent font-bold" : "text-foreground"
                  }`}
                >
                  {layer.value}
                </span>
              </li>
            );
          })}
        </ul>

        {matches.length > 0 ? (
          <>
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Coincidencias encontradas
              </h3>
              <span className="font-mono text-xs text-muted tabular-nums">
                {convergentCount} de {totalPosibles}
              </span>
            </div>

            <ul className="border-t border-ink/10">
              {matches.map((m, i) => (
                <li key={m.rule} className="flex items-baseline gap-4 py-5 border-b border-ink/10">
                  <span className="font-mono text-xs text-ink/30 tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-base text-foreground leading-relaxed">{m.label}</p>
                    {/* La regla: lo que hace el hallazgo comprobable. */}
                    <p className="mt-1.5 font-mono text-xs text-accent">{m.rule}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-base text-muted leading-relaxed max-w-xl border-t border-ink/10 pt-6">
            No hay coincidencias entre tus capas este año. El cruce se recalcula
            cada 1 de enero, cuando cambian el animal del año y tu año personal.
          </p>
        )}

        <p className="mt-10 text-xs text-muted italic max-w-xl">
          {convergenceLevel === "strong"
            ? "Una resonancia alta no predice nada: describe que varios sistemas culturales distintos, calculados por separado, dieron el mismo número o el mismo animal."
            : "Estas coincidencias son lecturas culturales, no mediciones. Lo verificable es la aritmética: cada regla de arriba se puede comprobar a mano."}
        </p>
      </div>
    </EditorialSection>
  );
}
