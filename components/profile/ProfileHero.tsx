"use client";

import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import { buildIdentitySentence } from "@/lib/engines/identityEngine";
import Button from "@/components/ui/Button";

interface ProfileHeroProps {
  profile: UserProfile;
  onEdit?: () => void;
  onShare?: () => void;
}

export default function ProfileHero({ profile, onEdit, onShare }: ProfileHeroProps) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];
  const identitySentence = buildIdentitySentence(profile);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-card-border bg-card p-8 md:p-12">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="badge">Personal Intelligence</span>
            {profile.birthTime && <span className="badge">Birth time available</span>}
          </div>

          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground tracking-tight md:text-5xl">
              {profile.name.toUpperCase()}
            </h1>
            <p className="mt-2 text-sm text-muted md:text-base">
              {profile.birthDate}
              {profile.birthPlace ? ` · ${profile.birthPlace}` : ""}
              {profile.birthTime ? ` · ${profile.birthTime}` : ""}
            </p>
          </div>

          <p className="text-lg text-muted md:text-xl">{identitySentence}</p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-background px-4 py-2 text-sm text-foreground">
              📚 Numerología
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-background px-4 py-2 text-sm text-foreground">
              🌌 Astrología
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-background px-4 py-2 text-sm text-foreground">
              🐉 Zodiaco Chino
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Arquetipo</p>
            <p className="font-serif text-2xl font-bold" style={{ color: archetype.color || "#D4A843" }}>
              {archetype.name}
            </p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="secondary" onClick={onEdit} className="text-sm">
                Editar
              </Button>
            )}
            {onShare && (
              <Button variant="secondary" onClick={onShare} className="text-sm">
                Compartir
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
