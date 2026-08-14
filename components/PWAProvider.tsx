"use client";

import { useEffect, useState } from "react";
import { Download, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAProvider({ children }: { children?: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already in standalone / PWA mode
    const isApp =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isApp);

    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((error) => {
            if (process.env.NODE_ENV === "development") {
              console.debug("[PWA] Service Worker registration failed:", error);
            }
          });
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }

    // Capture install prompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user previously dismissed
      const dismissed = localStorage.getItem("molino-pwa-dismissed");
      if (!dismissed) {
        // Show install toast after 6 seconds of engagement
        setTimeout(() => setShowInstallBanner(true), 6000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } catch {}
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("molino-pwa-dismissed", "true");
    }
  };

  return (
    <>
      {children}

      {/* Floating PWA Install Banner */}
      <AnimatePresence>
        {showInstallBanner && !isStandalone && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-4 rounded-2xl bg-card border border-accent/30 shadow-2xl backdrop-blur-md"
            role="dialog"
            aria-label="Instalar Molino como aplicación"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-foreground">
                    Instalá Molino en tu dispositivo
                  </h4>
                  <p className="text-[11px] font-mono text-muted mt-0.5">
                    Acceso instantáneo y cálculos 100% offline.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-ink/5 transition-colors"
                aria-label="Cerrar sugerencia de instalación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 py-2 px-3 rounded-xl bg-accent text-background font-mono text-xs font-bold hover:bg-accent/90 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar App</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="py-2 px-3 rounded-xl bg-ink/5 hover:bg-ink/10 text-muted hover:text-foreground font-mono text-xs transition-colors"
              >
                Ahora no
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
