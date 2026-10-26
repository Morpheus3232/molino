"use client";

import React, { useMemo } from "react";
import type { UserProfile } from "@/types/user";
import { generateChatContextualHook } from "@/lib/engines/chatContextualHook";
import MapHighlightText from "./MapHighlightText";

interface ChatHeroProps {
  profile: UserProfile;
  onSelectStarter?: (question: string) => void;
  compact?: boolean;
}

export default function ChatHero({
  profile,
  onSelectStarter,
  compact = false,
}: ChatHeroProps) {
  const hookData = useMemo(() => generateChatContextualHook(profile), [profile]);

  const coords = [
    `Camino de Vida ${profile.lifePath}`,
    `Sol en ${profile.sunSign}`,
    ...(hookData.moonSign ? [`Luna en ${hookData.moonSign}`] : []),
    ...(profile.chineseZodiac ? [`${profile.chineseZodiac} de ${profile.chineseZodiacInfo?.element || ""}`.trim()] : []),
    `Año personal ${hookData.personalYear}`,
  ];

  return (
    <div className="select-none">
      <h2 className="font-display font-normal text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.04] tracking-tight text-foreground max-w-2xl">
        Tu mapa ya está
        <span className="block">sobre la mesa.</span>
      </h2>

      {/* Línea contextual: demuestra que Molino ya leyó tu mapa */}
      <p className="mt-5 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed">
        <MapHighlightText text={hookData.hookSentence} highlightClassName="text-foreground font-semibold" />
      </p>

      {/* Lo que Molino tiene a mano en cada respuesta */}
      <div className="mt-6">
        <p className="text-sm text-muted label-caps mb-2">Molino responde con</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-base text-foreground">
          {coords.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Preguntas para empezar */}
      {!compact && onSelectStarter && (
        <div className="mt-10">
          <p className="text-sm text-muted label-caps mb-2">Para empezar, elegí una</p>
          <ul className="border-t border-ink/15">
            {hookData.suggestedStarters.map((q) => (
              <li key={q} className="border-b border-ink/15">
                <button
                  type="button"
                  onClick={() => onSelectStarter(q)}
                  className="group w-full flex items-baseline justify-between gap-4 py-4 text-left font-display text-xl sm:text-2xl leading-snug text-foreground hover:bg-ink/[0.03] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                >
                  <span className="group-hover:underline underline-offset-4 decoration-1">{q}</span>
                  <span className="shrink-0 text-base text-muted group-hover:text-foreground" aria-hidden="true">Preguntar</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
