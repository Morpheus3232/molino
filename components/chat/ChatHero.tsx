"use client";

import React, { useMemo } from "react";
import PersonalSigil from "@/components/ui/PersonalSigil";
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
  const { birthDay, birthMonth } = useMemo(() => {
    const parts = (profile.birthDate || "").split("-").map(Number);
    return {
      birthDay: Number.isFinite(parts[2]) ? parts[2] : 1,
      birthMonth: Number.isFinite(parts[1]) ? parts[1] : 1,
    };
  }, [profile.birthDate]);

  const hookData = useMemo(() => generateChatContextualHook(profile), [profile]);

  return (
    <div className="relative overflow-hidden rounded-[--radius-xl] bg-ink text-paper p-6 sm:p-10 lg:p-12 border border-ink/20 shadow-xl select-none">
      {/* Sello Personal determinístico grande centrado de fondo (20% opacidad) */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 880 880"
          className="w-[580px] h-[580px] sm:w-[840px] sm:h-[840px] max-w-none text-paper animate-pulse-slow"
        >
          <PersonalSigil
            lifePath={profile.lifePath || 4}
            birthDay={birthDay}
            birthMonth={birthMonth}
            width={880}
            height={880}
          />
        </svg>
      </div>

      {/* Contenido frontal */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Micro-etiqueta superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[--radius-sm] bg-paper/10 border border-paper/15 text-accent-light text-[11px] font-mono uppercase tracking-[0.25em] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-ping" />
          La IA ya te conoce
        </div>

        {/* Display Title */}
        <h2 className="font-display text-[clamp(2.1rem,5.5vw,3.5rem)] leading-[0.94] tracking-tight uppercase text-paper max-w-2xl mx-auto">
          Ya conozco tu mapa.
          <br />
          <span className="text-accent-light italic font-normal">
            Preguntá lo que necesites.
          </span>
        </h2>

        {/* Línea contextual automática que demuestra conocimiento del mapa */}
        <p className="mt-5 text-sm sm:text-base text-paper/85 max-w-xl mx-auto leading-relaxed font-sans">
          <MapHighlightText
            text={hookData.hookSentence}
            highlightClassName="font-semibold text-accent-light"
          />
        </p>

        {/* Coordenadas simbólicas cargadas en memoria */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-paper/70">
          <span className="px-2.5 py-1 rounded-[--radius-sm] bg-paper/5 border border-paper/10">
            Camino de Vida {profile.lifePath}
          </span>
          <span className="px-2.5 py-1 rounded-[--radius-sm] bg-paper/5 border border-paper/10">
            Sol en {profile.sunSign}
          </span>
          {hookData.moonSign && (
            <span className="px-2.5 py-1 rounded-[--radius-sm] bg-paper/5 border border-paper/10">
              Luna en {hookData.moonSign}
            </span>
          )}
          {profile.chineseZodiac && (
            <span className="px-2.5 py-1 rounded-[--radius-sm] bg-paper/5 border border-paper/10">
              {profile.chineseZodiac} ({profile.chineseZodiacInfo?.element || "Signo"})
            </span>
          )}
          <span className="px-2.5 py-1 rounded-[--radius-sm] bg-accent-light/10 text-accent-light border border-accent-light/20">
            Año Personal {hookData.personalYear}
          </span>
        </div>

        {/* Preguntas de inicio rápido sugeridas si se requiere */}
        {!compact && onSelectStarter && (
          <div className="mt-8 pt-6 border-t border-paper/10 text-left">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50 text-center mb-3">
              Preguntas para empezar
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {hookData.suggestedStarters.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onSelectStarter(q)}
                  className="text-left text-xs sm:text-sm px-3.5 py-2 rounded-[--radius-md] border border-paper/15 bg-paper/[0.04] text-paper/90 hover:border-accent-light hover:text-accent-light hover:bg-paper/[0.08] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
