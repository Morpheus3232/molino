"use client";

import React from "react";
import { motion } from "framer-motion";
import type { MolinoInterpretation } from "@/lib/engines/intelligence/types";
import MapHighlightText from "./MapHighlightText";
import { CornerDownRight } from "lucide-react";

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
}: ChatTurnItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="py-8 sm:py-10 border-b border-ink/15 last:border-b-0 space-y-6"
    >
      {/* Tu pregunta */}
      <div>
        <p className="text-sm text-muted mb-2 label-caps">
          Pregunta {index + 1}
        </p>
        <p className="font-display text-2xl sm:text-3xl text-foreground leading-snug">
          {turn.question}
        </p>
      </div>

      {/* Mientras responde */}
      {turn.loading && (
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          <span className="relative flex h-px w-16 overflow-hidden bg-ink/15">
            <motion.span
              className="absolute inset-y-0 w-1/2 bg-ink"
              initial={{ x: "-100%" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <span className="text-base text-muted italic">Molino está leyendo tu mapa…</span>
        </div>
      )}

      {/* Error */}
      {turn.error && (
        <p role="alert" className="text-base text-vermilion border-l-2 border-vermilion pl-4 leading-relaxed">
          {turn.error}
        </p>
      )}

      {/* Respuesta */}
      {turn.answer && (
        <div className="border-l-2 border-ink pl-5 sm:pl-8 space-y-5">
          <p className="text-sm text-muted label-caps">Molino responde</p>

          <p className="text-lg sm:text-xl text-foreground leading-[1.7] max-w-2xl">
            <MapHighlightText
              text={turn.answer.summary}
              highlightClassName="font-semibold text-foreground underline decoration-vermilion/60 decoration-2 underline-offset-4"
            />
          </p>

          {turn.answer.alignment && (
            <p className="text-base sm:text-lg text-muted italic leading-relaxed max-w-2xl">
              <MapHighlightText text={turn.answer.alignment} highlightClassName="font-semibold not-italic text-foreground" />
            </p>
          )}

          {turn.answer.suggestedNextStep && (
            <div className="border-t border-ink/15 pt-4 max-w-2xl">
              <p className="text-sm text-muted label-caps mb-1">Para hacer</p>
              <p className="text-base sm:text-lg text-foreground leading-relaxed">
                <MapHighlightText text={turn.answer.suggestedNextStep} highlightClassName="font-semibold" />
              </p>
            </div>
          )}

          {/* Seguir por este lado */}
          {turn.answer.suggestedQuestions && turn.answer.suggestedQuestions.length > 0 && (
            <div className="pt-2">
              <p className="text-sm text-muted label-caps mb-2">Seguir por acá</p>
              <ul className="border-t border-ink/15">
                {turn.answer.suggestedQuestions.map((sug, i) => (
                  <li key={i} className="border-b border-ink/15">
                    <button
                      type="button"
                      onClick={() => onSelectSuggestion && onSelectSuggestion(sug)}
                      className="group w-full flex items-start gap-3 py-3 text-left text-base sm:text-lg text-foreground hover:bg-ink/[0.03] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                    >
                      <CornerDownRight className="w-4 h-4 mt-1.5 shrink-0 text-muted group-hover:text-foreground" aria-hidden="true" />
                      <span className="group-hover:underline underline-offset-4">{sug}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
