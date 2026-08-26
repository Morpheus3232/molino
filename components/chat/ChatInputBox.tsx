"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, CornerDownLeft, Sparkles } from "lucide-react";

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
      className="relative rounded-[--radius-lg] border border-paper/15 bg-paper/[0.05] p-2.5 sm:p-3 transition-all focus-within:border-accent-light/60 focus-within:ring-2 focus-within:ring-accent-light/20 shadow-lg"
    >
      <div className="flex items-end gap-2 sm:gap-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isExhausted ? "Te quedaste sin preguntas. Recargá tu saldo para continuar." : placeholder}
          disabled={isLoading || isExhausted}
          className="w-full resize-none bg-transparent px-3 py-2 text-sm sm:text-base text-paper placeholder:text-paper/40 focus:outline-none disabled:opacity-50 min-h-[44px] max-h-[180px] font-sans leading-relaxed"
          aria-label="Escribí tu pregunta para Molino"
        />

        {isExhausted ? (
          <button
            type="button"
            onClick={onOpenReloadModal}
            className="shrink-0 min-h-[40px] px-4 rounded-[--radius-md] bg-accent-light text-ink font-heading text-xs uppercase tracking-wider font-bold hover:bg-accent-light/90 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recargar</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 h-10 w-10 rounded-[--radius-md] bg-accent-light text-ink flex items-center justify-center hover:bg-accent-light/90 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            aria-label="Enviar pregunta"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between px-3 pt-2 text-[11px] font-mono text-paper/40 select-none">
        <span>Molino lee tus coordenadas en cada consulta</span>
        <span className="hidden sm:inline">Enter para enviar · Shift+Enter para nueva línea</span>
      </div>
    </form>
  );
}
