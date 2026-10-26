"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";
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
          className="relative w-full max-w-lg bg-background text-foreground border-2 border-ink p-6 sm:p-10 z-10"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted hover:text-foreground hover:bg-ink/5 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          <p className="text-sm text-muted mb-4 label-caps">Saldo de preguntas</p>

          {/* Título y descripción */}
          <h3
            id="reload-modal-title"
            className="font-display text-3xl sm:text-4xl leading-tight text-foreground"
          >
            Te quedaste sin preguntas
          </h3>

          <p className="mt-4 text-base text-muted leading-relaxed">
            Usaste las 50 preguntas incluidas en tu acceso. El pack de recarga todavía no está
            a la venta: cuando lo esté, lo vas a poder comprar desde acá. Mientras tanto tu mapa, tu lectura y todo lo
            que ya generaste siguen disponibles.
          </p>

          <div className="mt-6 py-5 border-y border-ink/15 space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="font-display text-xl text-foreground block">
                  Pack de {RELOAD_PACK_QUESTIONS} preguntas adicionales
                </span>
                <span className="text-sm text-muted block mt-0.5">
                  Precio previsto. Todavía no se puede comprar.
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-display text-3xl text-muted">
                  ${RELOAD_PACK_PRICE_USD.toFixed(2)}
                </span>
                <span className="text-sm text-muted block">USD · Único</span>
              </div>
            </div>

            <ul className="pt-3 border-t border-ink/10 space-y-1.5 text-sm text-muted">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Sin suscripciones automáticas ni cobros recurrentes</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-ink text-paper text-sm font-bold hover:bg-ink/90 transition-colors label-caps"
            >
              <span>Volver a mi mapa</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
