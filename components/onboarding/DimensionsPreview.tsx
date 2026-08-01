"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { fetchSynthesis, type SynthesisResult } from "@/lib/api/client";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

const ProfileRadar = dynamic(() => import("@/components/charts/ProfileRadar"), {
  ssr: false,
  loading: () => <div className="h-80" aria-hidden="true" />,
});

interface DimensionsPreviewProps {
  /** Fecha en formato YYYY-MM-DD. Debe estar ya validada. */
  birthDate: string;
}

const DIMENSIONS_PREVIEW_CACHE = new Map<string, SynthesisResult['dimensions']>();

/**
 * Adelanto de "Tus dimensiones" en el onboarding: en cuanto la fecha es
 * valida se calcula todo en el navegador y se muestra el radar, sin esperar
 * a generar el perfil completo. Es la primera devolucion concreta que recibe
 * el usuario por haber puesto su fecha.
 */
export default function DimensionsPreview({ birthDate }: DimensionsPreviewProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<SynthesisResult['dimensions'] | null>(
    DIMENSIONS_PREVIEW_CACHE.get(birthDate) || null
  );

  const profile = useMemo(() => calculateUserProfile("", birthDate), [birthDate]);
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] ?? "var(--color-accent)";

  useEffect(() => {
    if (DIMENSIONS_PREVIEW_CACHE.has(birthDate)) {
      setDimensions(DIMENSIONS_PREVIEW_CACHE.get(birthDate) || null);
      return;
    }

    let cancelled = false;
    fetchSynthesis(birthDate, "")
      .then((data) => {
        if (!cancelled) {
          const dims = data.dimensions;
          DIMENSIONS_PREVIEW_CACHE.set(birthDate, dims);
          setDimensions(dims);
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
  }, [birthDate]);

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
            <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-accent mb-2">
              Adelanto
            </p>
            <h2
              id="dimensions-preview-heading"
              className="font-display text-2xl sm:text-3xl tracking-tight text-foreground"
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
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-accent mb-2">
            Adelanto
          </p>
          <h2
            id="dimensions-preview-heading"
            className="font-display text-2xl sm:text-3xl tracking-tight text-foreground"
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
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted mt-0.5 truncate">
                      {dim.influences.filter(Boolean).join(" + ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Barra de nivel: el color tambien esta acompanado por
                        el numero, no es el unico indicador. */}
                    <span className="hidden sm:block w-20 h-1.5 rounded-sm bg-ink/10 overflow-hidden">
                      <span
                        className="block h-full rounded-sm"
                        style={{ width: `${dim.value}%`, backgroundColor: elementColor }}
                      />
                    </span>
                    <span className="text-base font-semibold tabular-nums" style={{ color: elementColor }}>
                      {dim.value}
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
