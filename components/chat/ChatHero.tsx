"use client";
import { useL } from "@/lib/i18n/useL";

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
  const L = useL();
  const hookData = useMemo(() => generateChatContextualHook(profile), [profile]);

  const coords = [
    L(`Camino de Vida ${profile.lifePath}`, `Life Path ${L.t(profile.lifePath)}`),
    L(`Sol en ${profile.sunSign}`, `Sun in ${L.t(profile.sunSign)}`),
    ...(hookData.moonSign ? [L(`Luna en ${hookData.moonSign}`, `Moon in ${L.t(hookData.moonSign)}`)] : []),
    ...(profile.chineseZodiac ? [L(`${profile.chineseZodiac} de ${profile.chineseZodiacInfo?.element || ""}`, `${L.t(profile.chineseZodiacInfo?.element || "")} ${L.t(profile.chineseZodiac)}`).trim()] : []),
    L(`Año personal ${hookData.personalYear}`, `Personal year ${hookData.personalYear}`),
  ];

  return (
    <div className="select-none">
      <h2 className="font-display font-normal text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.04] tracking-tight text-foreground max-w-2xl">{L(<>
        Tu mapa ya está
        <span className="block">sobre la mesa.</span>
      </>, <>Your map is already<span className="block">on the table.</span></>)}</h2>

      {/* Línea contextual: demuestra que Molino ya leyó tu mapa */}
      <p className="mt-5 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed">
        <MapHighlightText text={hookData.hookSentence} highlightClassName="text-foreground font-semibold" />
      </p>

      {/* Lo que Molino tiene a mano en cada respuesta */}
      <div className="mt-6">
        <p className="text-sm text-muted label-caps mb-2">{L("Molino responde con", "Molino answers with")}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-base text-foreground">
          {coords.map((c) => (
            <li key={c}>{L.t(c)}</li>
          ))}
        </ul>
      </div>

      {/* Preguntas para empezar */}
      {!compact && onSelectStarter && (
        <div className="mt-10">
          <p className="text-sm text-muted label-caps mb-2">{L("Para empezar, elegí una", "To start, pick one")}</p>
          <ul className="border-t border-ink/15">
            {hookData.suggestedStarters.map((q) => (
              <li key={q} className="border-b border-ink/15">
                <button
                  type="button"
                  onClick={() => onSelectStarter(q)}
                  className="group w-full flex items-baseline justify-between gap-4 py-4 text-left font-display text-xl sm:text-2xl leading-snug text-foreground hover:bg-ink/[0.03] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                >{L(<>
                  <span className="group-hover:underline underline-offset-4 decoration-1">{L.t(q)}</span>
                  <span className="shrink-0 text-base text-muted group-hover:text-foreground" aria-hidden="true">Preguntar</span>
                </>, <><span className="group-hover:underline underline-offset-4 decoration-1">{L.t(q)}</span><span className="shrink-0 text-base text-muted group-hover:text-foreground" aria-hidden="true">Ask</span></>)}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
