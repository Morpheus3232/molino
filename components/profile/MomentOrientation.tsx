"use client";

import { useMemo } from "react";
import type { DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import type { TimingResult } from "@/lib/engines/timingEngine";
import type { SynthesisResult } from "@/lib/api/client";
import { buildOrientation } from "@/lib/utils/orientation";
import EditorialSection from "@/components/ui/EditorialSection";

interface MomentOrientationProps {
  dailyEnergy: DailyEnergyResult;
  timing?: TimingResult | null;
  momentState: SynthesisResult["momentState"] | null;
  error?: boolean;
  onRetry?: () => void;
}

/**
 * TU MOMENTO / ORIENTACI&#211;N.
 *
 * `momentState` llega por props: lo calcula el mismo fetchSynthesis() que ya
 * dispara IntelligenceScreen (su &#250;nico consumidor), en vez de que este
 * componente dispare una segunda llamada id&#233;ntica a /api/synthesis/calculate.
 */
export default function MomentOrientation({ dailyEnergy, timing, momentState, error, onRetry }: MomentOrientationProps) {
  const orientation = useMemo(
    () => buildOrientation(dailyEnergy, momentState ?? undefined, timing),
    [dailyEnergy, momentState, timing]
  );

  if (!momentState) {
    return (
      <EditorialSection
        tone="ink"
        eyebrow="TU MOMENTO"
        title={<>{error ? "No disponible" : "Cargando..."}</>}
        intro={error ? "No pudimos cargar esta parte de tu mapa." : "Calculando tu momento actual..."}
      >
        <div className="pt-4">
          {error ? (
            <button
              type="button"
              onClick={onRetry}
              className="text-sm text-paper hover:underline"
            >
              Reintentar
            </button>
          ) : (
            <p className="text-sm text-paper/70">Un momento mientras preparamos tu orientaci&#243;n.</p>
          )}
        </div>
      </EditorialSection>
    );
  }

  return (
    <EditorialSection
      tone="ink"
      eyebrow="TU MOMENTO"
      title={<> {orientation.dateLabel.toUpperCase()}</>}
      intro={orientation.theme}
    >
      <div className="pt-4">
        <p className="text-base text-paper/75 leading-relaxed max-w-2xl">{orientation.expression}</p>

        <div className="mt-10 border-l-2 border-accent pl-5 sm:pl-8">
          <p className="label-micro text-accent-light font-semibold mb-2">ORIENTACI&#211;N</p>
          <p className="font-heading text-xl sm:text-2xl text-paper leading-relaxed max-w-2xl">
            {orientation.orientation}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-paper/15 border border-paper/15">
          {orientation.evidence.map((e) => (
            <div key={e.label} className="bg-ink px-5 py-4">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-paper/60 mb-1.5">
                {e.label}
              </p>
              <p className="text-sm text-paper/85 leading-snug">{e.value}</p>
            </div>
          ))}
        </div>
      </div>
    </EditorialSection>
  );
}
