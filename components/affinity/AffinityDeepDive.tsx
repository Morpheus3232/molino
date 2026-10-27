"use client";
import { useL } from "@/lib/i18n/useL";

import { type AffinityResult } from "@/lib/engines/affinityEngine";
import type { EntityType, SymbolicEntity } from "@/lib/data/symbolic-entities";
import type { UserProfile } from "@/types/user";

/**
 * Debajo del veredicto: por qué la tradición lee así este par de signos y,
 * si la entidad tiene otros hitos fechados, cuáles son. Los datos del
 * origen ya están en la ficha (AffinityEditorialContent): no se repiten.
 */
export default function AffinityDeepDive({
  result,
  showOtherEvents,
  onToggleOtherEvents,
}: {
  result: AffinityResult;
  entity: SymbolicEntity;
  meta?: { label: string; plural: string; icon: string; description: string };
  type?: EntityType;
  profile?: UserProfile;
  showOtherEvents: boolean;
  onToggleOtherEvents: () => void;
}) {
  const L = useL();
  const otherEvents = result.otherEvents ?? [];

  return (
    <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
      <div className="lg:col-span-7">
        <p className="text-sm text-muted label-caps mb-3">{L("Por qué se lee así", "Why it reads this way")}</p>
        <p className="text-lg text-foreground/90 leading-relaxed">{result.summary}</p>
        {result.tradition && <p className="mt-4 text-base text-muted italic leading-relaxed">{result.tradition}</p>}
        <p className="mt-4 text-base text-muted leading-relaxed">{result.methodNote}</p>
      </div>

      {otherEvents.length > 0 && (
        <div className="lg:col-span-5">
          <button
            type="button"
            onClick={onToggleOtherEvents}
            aria-expanded={showOtherEvents}
            className="w-full flex items-baseline justify-between gap-4 text-left border-b-2 border-ink pb-2"
          >
            <span className="text-sm text-muted label-caps">
              {otherEvents.length === 1 ? L("Otro hito documentado", "Another documented milestone") : L(`Otros ${otherEvents.length} hitos documentados`, `${otherEvents.length} other documented milestones`)}
            </span>
            <span className="text-sm text-foreground underline underline-offset-4">{showOtherEvents ? L("Ocultar", "Hide") : L("Ver", "Show")}</span>
          </button>
          {showOtherEvents && (
            <ul className="divide-y divide-ink/15">
              {otherEvents.map((e) => (
                <li key={e.id} className="py-4">
                  <p className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-xl text-foreground">{e.label}</span>
                    <span className="text-base text-muted tabular-nums">
                      {e.year}
                      {e.calculatedAnimal ? ` · ${e.calculatedAnimal}` : ""}
                    </span>
                  </p>
                  <p className="mt-1 text-base text-muted leading-relaxed">{e.description}</p>
                  <p className="mt-1 text-sm text-muted">{L(<>Fuente: {e.source}{e.isApproximate ? " · año documentado" : ""}</>, <>Source: {e.source}{e.isApproximate ? " · year documented" : ""}</>)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
