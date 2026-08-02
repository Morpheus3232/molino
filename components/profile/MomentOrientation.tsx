"use client";

import { useMemo, useState, useEffect } from "react";
import type { UserProfile } from "@/types/user";
import type { DailyEnergyResult } from "@/lib/engines/dailyEnergyEngine";
import type { TimingResult } from "@/lib/engines/timingEngine";
import { buildOrientation } from "@/lib/utils/orientation";
import { fetchSynthesis, type SynthesisResult } from "@/lib/api/client";
import EditorialSection from "@/components/ui/EditorialSection";

interface MomentOrientationProps {
  profile: UserProfile;
  dailyEnergy: DailyEnergyResult;
  timing?: TimingResult | null;
}

const MOMENT_CACHE = new Map<string, SynthesisResult["momentState"]>();

/**
 * TU MOMENTO / ORIENTACI&#211;N.
 *
 * Una sola respuesta editorial: qu&#233; conviene tener en cuenta ahora. Reutiliza
 * la energ&#237;a diaria, el estado de momento y el timing que Molino ya calcula.
 */
export default function MomentOrientation({ profile, dailyEnergy, timing }: MomentOrientationProps) {
  const cacheKey = `${profile.birthDate || ""}:${profile.name || ""}`;
  const [momentState, setMomentState] = useState<SynthesisResult["momentState"] | null>(
    MOMENT_CACHE.get(cacheKey) || null
  );

  useEffect(() => {
    if (MOMENT_CACHE.has(cacheKey)) {
      setMomentState(MOMENT_CACHE.get(cacheKey) || null);
      return;
    }

    let cancelled = false;
    fetchSynthesis(profile.birthDate || "", profile.name || "", true)
      .then((data) => {
        if (!cancelled && data.momentState) {
          MOMENT_CACHE.set(cacheKey, data.momentState);
          setMomentState(data.momentState);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("MomentOrientation: error fetching moment state:", err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  const orientation = useMemo(
    () => buildOrientation(dailyEnergy, momentState ?? undefined, timing),
    [dailyEnergy, momentState, timing]
  );

  if (!momentState) {
    return (
      <EditorialSection
        tone="ink"
        eyebrow="TU MOMENTO"
        title={<>Cargando...</>}
        intro="Calculando tu momento actual..."
      >
        <div className="pt-4">
          <p className="text-sm text-paper/70">Un momento mientras preparamos tu orientaci&#243;n.</p>
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
