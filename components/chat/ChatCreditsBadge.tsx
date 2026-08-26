"use client";

import React from "react";
import { Sparkles, PlusCircle } from "lucide-react";

interface ChatCreditsBadgeProps {
  remaining: number;
  total: number;
  isLow: boolean;
  isExhausted: boolean;
  onOpenReloadModal: () => void;
}

export default function ChatCreditsBadge({
  remaining,
  isLow,
  isExhausted,
  onOpenReloadModal,
}: ChatCreditsBadgeProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 flex-wrap">
        {isExhausted ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[--radius-sm] font-mono text-xs font-bold uppercase tracking-wider bg-red-500/15 text-red-300 border border-red-500/30">
            Sin preguntas restantes
          </span>
        ) : isLow ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[--radius-sm] font-mono text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
            Te quedan {remaining} {remaining === 1 ? "pregunta" : "preguntas"}
          </span>
        ) : null}

        <span className="font-mono text-xs text-paper/70 bg-paper/[0.06] px-3 py-1 rounded-[--radius-sm] border border-paper/10">
          Preguntas restantes:{" "}
          <strong className="text-paper font-bold">{remaining}</strong>
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenReloadModal}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-light hover:text-paper bg-accent-light/10 hover:bg-accent-light/20 px-3 py-1 rounded-[--radius-sm] border border-accent-light/30 transition-colors"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        <span>Recargar saldo</span>
      </button>
    </div>
  );
}
