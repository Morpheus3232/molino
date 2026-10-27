"use client";
import { useL } from "@/lib/i18n/useL";

import React, { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputBoxProps {
  input: string;
  onChange: (value: string) => void;
  onSubmit: (question: string) => void;
  isLoading: boolean;
  isExhausted: boolean;
  placeholder?: string;
  onOpenReloadModal?: () => void;
}

export default function ChatInputBox({
  input,
  onChange,
  onSubmit,
  isLoading,
  isExhausted,
  placeholder = "Escribí tu pregunta…",
  onOpenReloadModal,
}: ChatInputBoxProps) {
  const L = useL();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExhausted) {
      if (onOpenReloadModal) onOpenReloadModal();
      return;
    }
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border-2 border-ink bg-background p-2.5 sm:p-3 transition-shadow focus-within:shadow-[4px_4px_0_0_rgb(var(--color-ink-rgb))]"
    >
      <div className="flex items-end gap-2 sm:gap-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isExhausted ? L("Te quedaste sin preguntas. Recargá tu saldo para continuar.", "You're out of questions. Top up your balance to continue.") : placeholder}
          disabled={isLoading || isExhausted}
          className="w-full resize-none bg-transparent px-3 py-2 text-lg sm:text-xl text-foreground placeholder:text-muted/70 focus:outline-none disabled:opacity-50 min-h-[48px] max-h-[180px] font-display leading-relaxed"
          aria-label={L("Escribí tu pregunta para Molino", "Write your question for Molino")}
        />

        {isExhausted ? (
          <button
            type="button"
            onClick={onOpenReloadModal}
            className="shrink-0 min-h-[44px] px-5 bg-vermilion text-paper text-sm font-bold hover:bg-vermilion-hover transition-colors flex items-center gap-1.5 label-caps"
          >{L(<>
            <span>Recargar</span>
          </>, <><span>Top up</span></>)}</button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 h-11 w-11 bg-ink text-paper flex items-center justify-center hover:bg-vermilion active:scale-95 disabled:opacity-25 disabled:pointer-events-none transition-colors"
            aria-label={L("Enviar pregunta", "Send question")}
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between px-3 pt-2 text-sm text-muted select-none">{L(<>
        <span>Molino lee tus coordenadas en cada consulta</span>
        <span className="hidden sm:inline">Enter envía; Shift+Enter, nueva línea</span>
      </>, <><span>Molino reads your coordinates on every question</span><span className="hidden sm:inline">Enter sends; Shift+Enter, new line</span></>)}</div>
    </form>
  );
}
