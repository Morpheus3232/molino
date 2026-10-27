"use client";
import { useL } from "@/lib/i18n/useL";

import { Link } from "@/lib/i18n/navigation";
import { useProfile } from "@/lib/hooks/useProfile";
import { ANIMAL_PROFILES, type Animal } from "@/lib/data/animalRelations";

interface ProfileBridgeProps {
  /** Único CTA contextual — a lo sumo un link hacia una superficie real. */
  cta?: { label: string; href: string };
}

/**
 * Puente perfil ↔ Academia. Deliberadamente mínimo: una línea "En tu mapa" +
 * como máximo un link. Sin perfil no renderiza nada — no hay bloque vacío
 * ni se fuerza a crear un perfil para leer la guía.
 */
export default function ProfileBridge({ cta }: ProfileBridgeProps) {
  const L = useL();
  const { profile, mounted } = useProfile();

  if (!mounted || !profile) return null;

  const animal = profile.chineseZodiac as Animal | undefined;
  const emoji = animal ? ANIMAL_PROFILES[animal]?.emoji : undefined;

  const parts = [
    emoji && animal ? `${emoji} ${animal}` : animal,
    profile.lifePath ? L(`Camino de Vida ${profile.lifePath}`, `Life Path ${profile.lifePath}`) : null,
    profile.sunSign || null,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <div className="rounded-md border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p className="text-sm text-muted font-semibold mb-1 label-caps">{L("En tu mapa", "In your map")}</p>
        <p className="text-sm text-foreground font-medium">{parts.join(" · ")}</p>
      </div>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors shrink-0"
        >
          {cta.label} →
        </Link>
      )}
    </div>
  );
}
