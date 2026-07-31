"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/types/user";
import type { DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import type { TimingResult } from "@/lib/engines/timingEngine";
import { buildMomentState } from "@/lib/engines/synthesisEngine";
import { buildOrientation } from "@/lib/utils/orientation";
import EditorialSection from "@/components/ui/EditorialSection";

interface MomentOrientationProps {
  profile: UserProfile;
  dailyEnergy: DailyEnergyResult;
  timing?: TimingResult | null;
}

/**
 * TU MOMENTO / ORIENTACIÓN.
 *
 * Una sola respuesta editorial: qué conviene tener en cuenta ahora. Reutiliza
 * la energía diaria, el estado de momento y el timing que Molino ya calcula.
 */
export default function MomentOrientation({ profile, dailyEnergy, timing }: MomentOrientationProps) {
  const momentState = useMemo(
    () => buildMomentState(profile, dailyEnergy.overallScore, dailyEnergy.theme),
    [profile, dailyEnergy]
  );
  const orientation = useMemo(
    () => buildOrientation(dailyEnergy, momentState, timing),
    [dailyEnergy, momentState, timing]
  );

  return (
    <EditorialSection
      tone="ink"
      eyebrow="TU MOMENTO"
      title={<>{orientation.dateLabel.toUpperCase()}</>}
      intro={orientation.theme}
    >
      <div className="pt-4">
        <p className="text-base text-paper/75 leading-relaxed max-w-2xl">{orientation.expression}</p>

        <div className="mt-10 border-l-2 border-accent pl-5 sm:pl-8">
          <p className="label-micro text-accent font-semibold mb-2">ORIENTACIÓN</p>
          <p className="font-heading text-xl sm:text-2xl text-paper leading-relaxed max-w-2xl">
            {orientation.orientation}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-paper/15 border border-paper/15">
          {orientation.evidence.map((e) => (
            <div key={e.label} className="bg-ink px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/40 mb-1.5">
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
