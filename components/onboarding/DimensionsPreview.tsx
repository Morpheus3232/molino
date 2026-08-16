"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { fetchSynthesis, type SynthesisResult } from "@/lib/api/client";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { getScoreLabel } from "@/lib/utils/score";

const ProfileRadar = dynamic(() => import("@/components/charts/ProfileRadar"), {
  ssr: false,
  loading: () => <div className="h-80" aria-hidden="true" />,
});

type Dimensions = SynthesisResult["dimensions"];

interface DimensionsPreviewProps {
  /** Fecha en formato YYYY-MM-DD. Requerida solo si no se pasan `dimensions` ya calculadas. */
  birthDate?: string;
  /** Dimensiones ya calculadas (p.ej. buildDimensions(profile) en Mi Mapa). Si vienen, no hay fetch/cache/loading. */
  dimensions?: Dimensions;
  /** Color del elemento para el radar. Si no se pasa, se deriva de birthDate. */
  elementColor?: string;
  /** Filas clickeables tipo accordion (onboarding) o siempre expandidas (Mi Mapa). Default true. */
  expandable?: boolean;
}

const DIMENSIONS_PREVIEW_CACHE = new Map<string, Dimensions>();

/**
 * "Tus dimensiones": radar + desglose. En el onboarding calcula todo desde
 * `birthDate` (fetch en cliente, con cache y loading state) porque el perfil
 * recién se está armando. Cuando el perfil ya existe (Mi Mapa) se le pasan
 * `dimensions` directo y ese camino se salta entero.
 */
export default function DimensionsPreview({
  birthDate,
  dimensions: dimensionsProp,
  elementColor: elementColorProp,
  expandable = true,
}: DimensionsPreviewProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fetchedDimensions, setFetchedDimensions] = useState<Dimensions | null>(
    dimensionsProp ?? (birthDate ? DIMENSIONS_PREVIEW_CACHE.get(birthDate) ?? null : null)
  );

  const elementColor = useMemo(() => {
    if (elementColorProp) return elementColorProp;
    if (!birthDate) return "var(--color-accent)";
    const profile = calculateUserProfile("", birthDate);
    const element = typeof profile.element === "string" ? profile.element : "";
    return ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] ?? "var(--color-accent)";
  }, [elementColorProp, birthDate]);

  useEffect(() => {
    if (dimensionsProp || !birthDate) return;

    if (DIMENSIONS_PREVIEW_CACHE.has(birthDate)) {
      setFetchedDimensions(DIMENSIONS_PREVIEW_CACHE.get(birthDate) || null);
      return;
    }

    let cancelled = false;
    fetchSynthesis(birthDate, "")
      .then((data) => {
        if (!cancelled) {
          // Sin nombre, `dimensions` (Expresión/Alma/Personalidad) colapsa a
          // un solo valor repetido — ver el comentario de buildDateDimensions
          // en synthesisEngine.ts. `dateDimensions` es la variante pensada
          // para depender solo de la fecha, que es todo lo que hay en este
          // punto del onboarding.
          const dims = data.dateDimensions;
          DIMENSIONS_PREVIEW_CACHE.set(birthDate, dims);
          setFetchedDimensions(dims);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("DimensionsPreview: error fetching synthesis:", err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [birthDate, dimensionsProp]);

  const dimensions = dimensionsProp ?? fetchedDimensions;

  const radarData = useMemo(
    () => (dimensions || []).map((d) => ({ subject: d.dimension, value: d.value })),
    [dimensions]
  );

  if (!dimensions) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-10"
        aria-labelledby="dimensions-preview-heading"
      >
        <div className="rounded-lg border border-border bg-card shadow-md overflow-hidden">
          <div className="px-6 pt-6 pb-2 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              Adelanto
            </p>
            <h2
              id="dimensions-preview-heading"
              className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground"
            >
              TUS DIMENSIONES
            </h2>
            <p className="text-sm text-muted mt-2">
              Una síntesis simbólica, no una medición científica.
            </p>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-muted">Calculando dimensiones...</p>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-10"
      aria-labelledby="dimensions-preview-heading"
    >
      <div className="rounded-lg border border-border bg-card shadow-md overflow-hidden">
        <div className="px-6 pt-6 pb-2 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            Adelanto
          </p>
          <h2
            id="dimensions-preview-heading"
            className="font-heading text-2xl sm:text-3xl tracking-tight text-foreground"
          >
            TUS DIMENSIONES
          </h2>
          <p className="text-sm text-muted mt-2">
            Una síntesis simbólica, no una medición científica.
          </p>
        </div>

        <ProfileRadar data={radarData} color={elementColor} />

        <div className="border-t border-border">
          {dimensions.map((dim) => {
            if (!expandable) {
              return (
                <div key={dim.dimension} className="border-b border-border last:border-b-0 px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{dim.dimension}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mt-0.5 truncate">
                        {dim.influences.filter(Boolean).join(" + ")}
                      </p>
                    </div>
                    <span
                      className="text-xs uppercase tracking-[0.2em] font-medium shrink-0"
                      style={{ color: elementColor }}
                    >
                      {getScoreLabel(dim.value)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{dim.explanation}</p>
                </div>
              );
            }

            const isOpen = expanded === dim.dimension;
            return (
              <div key={dim.dimension} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : dim.dimension)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-ink/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                      {dim.dimension}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mt-0.5 truncate">
                      {dim.influences.filter(Boolean).join(" + ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: elementColor }}>
                      {getScoreLabel(dim.value)}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-4 text-sm text-muted leading-relaxed">{dim.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
