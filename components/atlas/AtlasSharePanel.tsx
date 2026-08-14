"use client";

import { useState } from "react";
import type { LightweightEntity } from "@/types/atlas";
import AtlasShareCard from "@/components/atlas/AtlasShareCard";

interface AtlasSharePanelProps {
  entities: LightweightEntity[];
  category: string;
}

/**
 * Lets the user pick an entity from the current Atlas category and generate a
 * shareable/downloadable card for it. Client-only; receives LightweightEntity[]
 * from the Server Component. On-demand rendering (no image cost at load).
 */
export default function AtlasSharePanel({ entities, category }: AtlasSharePanelProps) {
  const [selectedId, setSelectedId] = useState(entities[0]?.id ?? "");
  const selected = entities.find((e) => e.id === selectedId) ?? entities[0];

  if (!selected) return null;

  return (
    <section className="mt-14 pt-10 border-t border-ink/10" aria-label="Compartir">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-px bg-border" aria-hidden="true" />
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Compartir</h2>
      </div>

      {entities.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {entities.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelectedId(e.id)}
              aria-pressed={selectedId === e.id}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                selectedId === e.id
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-ink/10 text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
      )}

      <AtlasShareCard
        entity={selected}
        headline={`${selected.animal}`}
        subline="Afinidad simbólica según el zodíaco chino"
        url={`${typeof window !== "undefined" ? window.location.origin : ""}/affinity/${category}/${selected.id}`}
      />
    </section>
  );
}
