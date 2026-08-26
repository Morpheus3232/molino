"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Check, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { RELOAD_PACK_PRICE_USD, RELOAD_PACK_QUESTIONS } from "@/lib/session/chatCredits";

interface ChatReloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReload: (questionsCount: number) => void;
  profileName?: string;
  birthDate?: string;
}

export default function ChatReloadModal({
  isOpen,
  onClose,
  onConfirmReload,
  profileName,
  birthDate,
}: ChatReloadModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReload = async () => {
    setLoading(true);
    setError(null);
    try {
      // Direct client-side credit update & reload confirmation
      // (Future extension can redirect to MP preference when live backend endpoint is ready)
      await new Promise((r) => setTimeout(r, 600));
      onConfirmReload(RELOAD_PACK_QUESTIONS);
      onClose();
    } catch (err) {
      setError("No pudimos procesar la recarga. Por favor intentá de nuevo.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/80 backdrop-blur-sm">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
          aria-hidden="true"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reload-modal-title"
          className="relative w-full max-w-lg rounded-[--radius-xl] bg-ink text-paper border border-paper/15 p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-paper/60 hover:text-paper rounded-[--radius-sm] hover:bg-paper/10 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[--radius-sm] bg-accent-light/10 border border-accent-light/20 text-accent-light font-mono text-xs uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Saldo Molino
          </div>

          {/* Título y descripción */}
          <h3
            id="reload-modal-title"
            className="font-display text-2xl sm:text-3xl text-paper uppercase tracking-tight leading-tight"
          >
            Te quedaste sin saldo Molino
          </h3>

          <p className="mt-3 text-sm text-paper/80 leading-relaxed font-sans">
            Usaste todas tus preguntas incluidas. Podés recargar para seguir explorando tu mapa y consultando tus decisiones.
          </p>

          {/* Card de recarga destacada */}
          <div className="mt-6 p-5 rounded-[--radius-lg] bg-paper/[0.06] border border-accent-light/30 space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="font-heading text-lg font-bold text-paper block">
                  Pack de {RELOAD_PACK_QUESTIONS} preguntas adicionales
                </span>
                <span className="text-xs text-paper/70 block mt-0.5">
                  Consultas profundas sin límite de tiempo sobre tus ciclos y arquetipo.
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-display text-2xl font-bold text-accent-light">
                  ${RELOAD_PACK_PRICE_USD.toFixed(2)}
                </span>
                <span className="text-[11px] font-mono text-paper/60 block">USD · Único</span>
              </div>
            </div>

            <ul className="pt-3 border-t border-paper/10 space-y-1.5 text-xs text-paper/85">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-accent-light shrink-0" />
                <span>28 preguntas nuevas añadidas inmediatamente</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-accent-light shrink-0" />
                <span>La IA conserva todo el contexto de tu mapa y tu sesión</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-light shrink-0" />
                <span>Sin suscripciones automáticas ni cobros recurrentes</span>
              </li>
            </ul>
          </div>

          {error && (
            <p className="mt-4 text-xs text-red-400 bg-red-950/40 p-2.5 rounded-[--radius-sm] border border-red-500/20">
              {error}
            </p>
          )}

          {/* Botón de Recargar */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleReload}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[--radius-md] bg-accent-light text-ink font-heading text-sm font-bold uppercase tracking-wider hover:bg-accent-light/90 active:scale-[0.99] disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando recarga…</span>
                </>
              ) : (
                <>
                  <span>Recargar saldo · ${RELOAD_PACK_PRICE_USD.toFixed(2)} USD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Alternativa */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-paper/60 hover:text-paper font-mono underline underline-offset-4 transition-colors"
              >
                O podés volver más tarde. Tu mapa sigue acá.
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
