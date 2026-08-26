"use client";

import React from "react";
import { motion } from "framer-motion";
import type { MolinoInterpretation } from "@/lib/engines/intelligence/types";
import MapHighlightText from "./MapHighlightText";
import { Sparkles, CornerDownRight, ArrowRight, HelpCircle } from "lucide-react";

export interface ChatTurnData {
  question: string;
  answer: MolinoInterpretation | null;
  loading: boolean;
  error: string | null;
}

interface ChatTurnItemProps {
  turn: ChatTurnData;
  index: number;
  onSelectSuggestion?: (question: string) => void;
  elementColor?: string;
}

export default function ChatTurnItem({
  turn,
  index,
  onSelectSuggestion,
  elementColor = "var(--color-accent-light, #D9805F)",
}: ChatTurnItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="py-6 sm:py-8 border-b border-paper/10 last:border-b-0 space-y-5"
    >
      {/* Tu pregunta */}
      <div className="flex items-start gap-3.5">
        <span
          className="w-3.5 h-px mt-[0.8em] shrink-0 bg-accent-light"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50 mb-1">
            Tu pregunta
          </p>
          <p className="text-base sm:text-lg font-medium text-paper leading-relaxed">
            {turn.question}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {turn.loading && (
        <div
          className="flex items-center gap-3 pl-4 sm:pl-7"
          role="status"
          aria-live="polite"
        >
          <span className="relative flex h-1.5 w-12 overflow-hidden rounded-full bg-paper/10">
            <motion.span
              className="absolute inset-y-0 w-1/2 rounded-full bg-accent-light"
              initial={{ x: "-100%" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <span className="text-xs font-mono text-paper/70">
            Cruzando tus datos y leyendo tu mapa…
          </span>
        </div>
      )}

      {/* Error state */}
      {turn.error && (
        <div
          role="alert"
          className="pl-4 sm:pl-7 text-xs text-red-300 bg-red-950/30 p-3 rounded-[--radius-sm] border border-red-500/20 leading-relaxed"
        >
          {turn.error}
        </div>
      )}

      {/* Respuesta de la IA: tipografía serif editorial con jerarquía pura */}
      {turn.answer && (
        <div className="pl-4 sm:pl-7 border-l-2 border-accent-light/40 space-y-4">
          {/* Cabecera de la respuesta */}
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-accent-light animate-pulse"
              aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-light font-bold">
              Molino
            </span>
          </div>

          {/* Texto principal en Serif generoso */}
          <div className="font-serif text-base sm:text-lg text-paper/95 leading-[1.8] space-y-3">
            <p>
              <MapHighlightText
                text={turn.answer.summary}
                highlightClassName="font-semibold text-accent-light bg-accent-light/10 px-1 py-0.5 rounded-[--radius-sm]"
              />
            </p>

            {turn.answer.alignment && (
              <p className="text-sm sm:text-base text-paper/75 italic font-sans leading-relaxed border-t border-paper/10 pt-3 mt-3">
                <MapHighlightText
                  text={turn.answer.alignment}
                  highlightClassName="font-semibold text-accent-light"
                />
              </p>
            )}

            {turn.answer.suggestedNextStep && (
              <div className="pt-2 flex items-start gap-2 text-sm text-accent-light font-sans font-medium leading-relaxed">
                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <MapHighlightText
                    text={turn.answer.suggestedNextStep}
                    highlightClassName="font-bold underline underline-offset-4 text-accent-light"
                  />
                </span>
              </div>
            )}
          </div>

          {/* Sugerencias contextuales de seguimiento */}
          {turn.answer.suggestedQuestions && turn.answer.suggestedQuestions.length > 0 && (
            <div className="mt-6 pt-5 border-t border-paper/10 space-y-2.5">
              <div className="flex items-center gap-1.5 text-paper/60 font-mono text-[11px] uppercase tracking-[0.2em]">
                <HelpCircle className="w-3.5 h-3.5 text-accent-light" />
                <span>Profundizar en este punto</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {turn.answer.suggestedQuestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectSuggestion && onSelectSuggestion(sug)}
                    className="inline-flex items-center gap-1.5 text-left text-xs sm:text-sm px-3.5 py-2 rounded-[--radius-md] border border-paper/15 bg-paper/[0.04] text-paper/90 hover:border-accent-light hover:text-accent-light hover:bg-paper/[0.08] active:scale-[0.98] transition-all"
                  >
                    <CornerDownRight className="w-3.5 h-3.5 text-accent-light shrink-0" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
