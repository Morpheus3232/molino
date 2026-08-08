"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { buildIdentityProfile } from "@/lib/engines/perspectivesEngine";
import { fetchConvergence, type ConvergenceResult } from "@/lib/api/client";
import { useCachedFetch } from "@/lib/hooks/useCachedFetch";
import EditorialSection from "@/components/ui/EditorialSection";

interface ConvergentSectionProps {
  profile: UserProfile;
}

const CONVERGENCE_CACHE = new Map<string, ConvergenceResult>();

const SYSTEM_COLORS: Record<string, string> = {
  Numerología: "var(--element-fire)",
  Astrología: "var(--layer-astrology)",
  "Zodiaco Chino": "var(--layer-moment)",
};

/**
 * Convergencia cualitativa.
 *
 * Reutiliza los ConvergencePoint[] que ya calcula buildIdentityProfile
 * (perspectivesEngine): cuándo distintos sistemas apuntan a una misma
 * dirección. Sin scores, sin porcentajes: solo el tema, los sistemas y la
 * explicación. Las capas numéricas de convergentEngine quedan como evidencia
 * discreta debajo.
 */
export default function ConvergentSection({ profile }: ConvergentSectionProps) {
  const identityProfile = useMemo(() => buildIdentityProfile(profile), [profile]);

  const cacheKey = `${profile.birthDate || ''}:${profile.name || ''}`;
  const { data: convergence, error: convergenceError, retry: retryConvergence } = useCachedFetch(
    CONVERGENCE_CACHE,
    cacheKey,
    () => fetchConvergence(profile.birthDate || '', profile.name || '').then((data) => data.convergence)
  );

  if (!convergence) {
    return (
      <EditorialSection
        tone="paperAlt"
        eyebrow="CONVERGENCIA"
        title={<>TRES LECTURAS.<br />UNA MISMA DIRECCIÓN.</>}
        intro="Distintos sistemas pueden llegar al mismo punto sobre tu perfil. Cuando lo hacen, ese punto vale la pena mirarlo."
      >
        <div className="pt-4">
          {convergenceError ? (
            <div role="alert">
              <p className="text-sm text-muted mb-3">No pudimos cargar esta parte de tu mapa.</p>
              <button
                type="button"
                onClick={retryConvergence}
                className="text-sm text-accent hover:underline"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted">Calculando convergencia...</p>
          )}
        </div>
      </EditorialSection>
    );
  }

  return (
    <EditorialSection
      tone="paperAlt"
      eyebrow="CONVERGENCIA"
      title={<>TRES LECTURAS.<br />UNA MISMA DIRECCIÓN.</>}
      intro="Distintos sistemas pueden llegar al mismo punto sobre tu perfil. Cuando lo hacen, ese punto vale la pena mirarlo."
    >
      <div className="pt-4">
        {/* Puntos de convergencia — cualitativos, explicables */}
        {identityProfile.convergences.map((conv, i) => (
          <motion.div
            key={`${conv.theme}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="py-10 lg:py-12 border-b border-ink/10"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="w-8 h-px bg-ink/15 shrink-0" aria-hidden="true" />
              <span className="label-micro text-accent font-semibold">CONVERGENCIA</span>
            </div>

            <p className="font-heading text-2xl sm:text-4xl tracking-tight text-foreground leading-[1.05] mb-5 uppercase">
              {conv.theme}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {conv.systems.map((sys) => (
                <span
                  key={sys}
                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-ink/10 bg-background"
                >
                  <span
                    className="w-1.5 h-1.5 shrink-0"
                    style={{ backgroundColor: SYSTEM_COLORS[sys] || "var(--ink)" }}
                    aria-hidden="true"
                  />
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-foreground">
                    {sys}
                  </span>
                </span>
              ))}
            </div>

            <p className="text-base text-muted leading-relaxed max-w-2xl">{conv.explanation}</p>
          </motion.div>
        ))}

        {/* Evidencia — las capas que alimentan la lectura */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="pt-10 lg:pt-12"
        >
          <p className="label-micro text-muted mb-6">
            TUS CAPAS · {convergence.convergentCount} DE {convergence.totalLayers} ALINEADAS
          </p>
          <div>
            {convergence.layers.map((layer, i) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-baseline justify-between gap-4 py-3.5 border-b border-ink/10 last:border-b-0"
              >
                <span className="text-sm text-muted">{layer.name}</span>
                <span className="font-heading text-lg text-foreground">{layer.value}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted italic leading-relaxed max-w-xl">
            La lectura conecta sistemas simbólicos; no es una medición ni una predicción.
          </p>
        </motion.div>
      </div>
    </EditorialSection>
  );
}
