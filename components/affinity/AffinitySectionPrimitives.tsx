"use client";

import { useMemo, useState } from "react";
import type { HistoricalEvent } from "@/lib/data/symbolic-entities";

export function SectionHeader({ title, id }: { title: string; id?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-px bg-border" aria-hidden="true" />
      <h2 id={id} className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
    </div>
  );
}

export function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-muted w-32 shrink-0">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}

export function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${months[monthIdx]} de ${year}`;
}

export function OtherEventCard({ event }: { event: HistoricalEvent }) {
  const { animal, isApproximate } = useMemo(() => {
    if (event.calculatedAnimal) {
      return { animal: event.calculatedAnimal, isApproximate: event.isApproximate ?? false };
    }
    return { animal: null, isApproximate: false };
  }, [event]);

  return (
    <div className="p-4 rounded-md bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{event.label}</span>
          <span className="text-xs text-muted">({event.year})</span>
        </div>
        {animal && (
          <span className="text-xs font-medium text-foreground">{animal}</span>
        )}
      </div>
      <p className="text-xs text-muted leading-relaxed">{event.description}</p>
      <div className="flex items-center gap-3 mt-2">
        <p className="text-xs text-muted">Fuente: {event.source}</p>
        {isApproximate && (
          <p className="text-xs text-muted">· Año documentado</p>
        )}
      </div>
    </div>
  );
}

/**
 * Collapsible section — always expanded on desktop (sm:), collapsed on mobile by default.
 * Tap to expand on mobile. Uses CSS transitions for smooth animation.
 */
export function CollapsibleSection({
  title,
  id,
  children,
  defaultOpen = false,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-ink/10 bg-transparent overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/20 transition-colors sm:pointer-events-none sm:cursor-default focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-t-2xl"
        aria-expanded={open}
        aria-controls={id}
      >
        <SectionHeader title={title} id={id} />
        <svg
          className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ml-4 sm:hidden ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} sm:max-h-none sm:opacity-100 transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
