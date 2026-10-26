"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

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
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <p className="text-base text-muted">
        {isExhausted ? (
          <span className="text-vermilion font-semibold">Te quedaste sin preguntas.</span>
        ) : (
          <>
            Te quedan{" "}
            <strong className={`font-display text-2xl font-normal tabular-nums ${isLow ? "text-vermilion" : "text-foreground"}`}>
              {remaining}
            </strong>{" "}
            {remaining === 1 ? "pregunta" : "preguntas"}
            {isLow && <span className="text-vermilion">, ya casi no quedan</span>}.
          </>
        )}
      </p>
      <button
        type="button"
        onClick={onOpenReloadModal}
        className="inline-flex items-center gap-1.5 text-base text-foreground underline underline-offset-4 hover:no-underline"
      >
        <PlusCircle className="w-4 h-4" aria-hidden="true" />
        <span>Recargar saldo</span>
      </button>
    </div>
  );
}
