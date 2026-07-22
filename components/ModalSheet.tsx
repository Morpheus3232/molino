"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function ModalSheet({ isOpen, onClose, title, children }: ModalSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-2xl bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              {title && (
                <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
              )}
              <button
                onClick={onClose}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted transition hover:bg-card hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
