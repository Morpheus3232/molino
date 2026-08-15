"use client";

import { useMemo } from "react";
import { CalendarRange } from "lucide-react";
import type { UserProfile } from "@/types/user";
import { buildPersonalTimelineRange } from "@/lib/engines/personalTimelineEngine";
import { usePremiumAccess } from "@/lib/hooks/usePremiumAccess";
import { ANIMAL_EMOJIS, type ChineseAnimal } from "@/lib/data/facts/chinese-zodiac-facts";

interface AnnualCyclesPreviewProps {
  profile: UserProfile;
}

const START_YEAR = 2026;
const END_YEAR = 2030;

export default function AnnualCyclesPreview({ profile }: AnnualCyclesPreviewProps) {
  const { isPremium } = usePremiumAccess(profile.name, profile.birthDate);

  const cycles = useMemo(
    () => buildPersonalTimelineRange(profile, START_YEAR, END_YEAR),
    [profile],
  );

  // Server-side gating is the real boundary for anything paid; this is only
  // about not showing the 2026-2030 breakdown to someone who hasn't unlocked
  // it yet. No second sales pitch here — PremiumGate above already made
  // that case (same pattern as ChatWithMolino).
  if (isPremium === false) {
    return (
      <div className="max-w-2xl">
        <p className="text-sm text-muted leading-relaxed max-w-xl">
          Los ciclos anuales {START_YEAR}–{END_YEAR} forman parte de tu síntesis completa — desbloqueala arriba para acceder.
        </p>
      </div>
    );
  }

  if (isPremium === null) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-ink/10">
        <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
          <CalendarRange className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
            Ciclos Anuales {START_YEAR}–{END_YEAR}
          </h3>
          <p className="text-xs text-muted">
            Tu año personal y el animal de cada año, cinco años hacia adelante.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {cycles.map((c) => (
          <div
            key={c.year}
            className="rounded-2xl border border-ink/5 bg-background p-3 sm:p-4 flex flex-col justify-between hover:border-accent/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted font-mono mb-2">
                <span className="font-bold text-foreground">{c.year}</span>
                <span aria-hidden="true">{ANIMAL_EMOJIS[c.yearAnimal as ChineseAnimal] || "✨"}</span>
              </div>

              <div className="flex items-baseline gap-1.5 my-1">
                <span className="font-display text-xl text-foreground font-bold">
                  {c.personalYear}
                </span>
                <span className="font-mono text-[10px] text-muted">Año personal</span>
              </div>
            </div>

            <p className="mt-3 pt-2.5 border-t border-ink/5 text-[11px] text-muted leading-snug">
              {c.cycleLabel}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
