"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/user";
import { buildTensions } from "@/lib/engines/synthesisEngine";
import ProfileShareCard, { type ShareVariant } from "@/components/profile/ProfileShareCard";

interface ProfileSharePanelProps {
  profile: UserProfile;
}

const VARIANT_LABELS: Record<ShareVariant, string> = {
  complete: "Mapa completo",
  pattern: "Patrón central",
  tension: "Tensión",
  year: "Año personal",
};

/**
 * Panel de selección de las 4 tarjetas compartibles del mapa. Clon de
 * AtlasSharePanel.tsx (chips + card seleccionada) — la variante "tension"
 * solo aparece si el perfil tiene una tensión real (buildTensions no
 * inventa una cuando no la hay, así que tampoco se ofrece para compartir
 * algo que no existe).
 */
export default function ProfileSharePanel({ profile }: ProfileSharePanelProps) {
  const hasTension = buildTensions(profile).length > 0;
  const variants: ShareVariant[] = hasTension
    ? ["complete", "pattern", "tension", "year"]
    : ["complete", "pattern", "year"];

  const [selected, setSelected] = useState<ShareVariant>(variants[0]);

  return (
    <section className="mt-10 pt-8 border-t border-ink/10" aria-label="Compartir tu mapa">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-px bg-border" aria-hidden="true" />
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Compartir</h2>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setSelected(v)}
            aria-pressed={selected === v}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
              selected === v
                ? "border-accent bg-accent/10 text-foreground"
                : "border-ink/10 text-muted hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {VARIANT_LABELS[v]}
          </button>
        ))}
      </div>

      <ProfileShareCard profile={profile} variant={selected} />
    </section>
  );
}
