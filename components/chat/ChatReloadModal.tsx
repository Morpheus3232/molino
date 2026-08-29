"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, ShieldCheck } from "lucide-react";
import { RELOAD_PACK_PRICE_USD, RELOAD_PACK_QUESTIONS } from "@/lib/session/chatCredits";

interface ChatReloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName?: string;
  birthDate?: string;
}

export default function ChatReloadModal({
  isOpen,
  onClose,
  profileName,
  birthDate,
}: ChatReloadModalProps) {
  if (!isOpen) return null;


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
            Usaste las 50 preguntas incluidas en tu acceso. El pack de recarga todavía no está
            a la venta: cuando lo esté, lo vas a poder comprar desde acá. Mientras tanto tu mapa, tu lectura y todo lo
            que ya generaste siguen disponibles.
          </p>

          <div className="mt-6 p-5 rounded-[--radius-lg] bg-paper/[0.06] border border-paper/15 space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="font-heading text-lg font-bold text-paper block">
                  Pack de {RELOAD_PACK_QUESTIONS} preguntas adicionales
                </span>
                <span className="text-xs text-paper/70 block mt-0.5">
                  Precio previsto. Todavía no se puede comprar.
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-display text-2xl font-bold text-paper/50">
                  ${RELOAD_PACK_PRICE_USD.toFixed(2)}
                </span>
                <span className="text-[11px] font-mono text-paper/50 block">USD · Único</span>
              </div>
            </div>

            <ul className="pt-3 border-t border-paper/10 space-y-1.5 text-xs text-paper/85">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-paper/60 shrink-0" />
                <span>Sin suscripciones automáticas ni cobros recurrentes</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[--radius-md] border border-paper/25 text-paper font-heading text-sm font-bold uppercase tracking-wider hover:bg-paper/10 transition-all"
            >
              <span>Volver a mi mapa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
