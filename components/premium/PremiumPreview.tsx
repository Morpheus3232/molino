"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import {
  Sparkles,
  Lock,
  Unlock,
  MessageSquare,
  Compass,
  Zap,
  ArrowRight,
  Eye,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface PremiumPreviewProps {
  className?: string;
  onUnlockClick?: () => void;
}

export default function PremiumPreview({
  className = "",
  onUnlockClick,
}: PremiumPreviewProps) {
  const [isUnlockedPreview, setIsUnlockedPreview] = useState(true);

  // Load real user profile from storage or fallback to dynamic reference profile
  const profile = useMemo<UserProfile>(() => {
    const stored = loadProfileFromStorage();
    if (stored) return stored as UserProfile;
    // High quality sample profile (El Investigador / Piscis / Caballo)
    return calculateUserProfile("Franco", "1990-04-18");
  }, []);

  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetype.name || "El Caminante";

  return (
    <section className={`py-12 ${className}`} aria-labelledby="premium-preview-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="text-center mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
            Preview Interactivo
          </span>
          <h2
            id="premium-preview-title"
            className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground uppercase tracking-tight mt-1"
          >
            Así se ve tu lectura desbloqueada
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-xl mx-auto">
            Interactuá con la vista previa basada en tu mapa ({archetypeName}, {profile.sunSign},{" "}
            {profile.chineseZodiac}).
          </p>

          {/* Interactive Toggle */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-card border border-ink/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setIsUnlockedPreview(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  !isUnlockedPreview
                    ? "bg-ink/15 text-foreground font-bold shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-muted" />
                Vista Gratis (Bloqueada)
              </button>
              <button
                type="button"
                onClick={() => setIsUnlockedPreview(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isUnlockedPreview
                    ? "bg-accent text-background font-bold shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                Vista Premium (Desbloqueada)
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="relative rounded-3xl border border-ink/15 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Top Bar with user badge */}
          <div className="flex items-center justify-between gap-3 pb-6 border-b border-ink/10 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-accent animate-pulse" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">
                  Perfil Activo
                </span>
                <span className="font-heading text-sm sm:text-base font-bold text-foreground">
                  {archetypeName} · Camino {lifePath} · {profile.sunSign}
                </span>
              </div>
            </div>

            <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full font-bold">
              {isUnlockedPreview ? "✨ Modo Pro Desbloqueado" : "🔒 Modo Free"}
            </span>
          </div>

          {/* Preview Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Section 1: Síntesis de Convergencia */}
            <div className="p-6 rounded-2xl bg-background border border-ink/10 space-y-3">
              <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Síntesis de Convergencia</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                La tensión entre tu visión y tu ritmo
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                Tu Camino {lifePath} ({archetypeName}) te impulsa a construir con autonomía, pero tu
                naturaleza de {profile.chineseZodiac} ({profile.chineseZodiacInfo?.element || "Fuego"}) busca
                movimiento continuo.
              </p>
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/15 text-xs text-muted leading-relaxed">
                <strong>Clave de integración:</strong> No intentes frenar tu impulso de exploración. Usá tu
                capacidad analítica para seleccionar 2 objetivos al año y canalizar toda tu energía allí.
              </div>
            </div>

            {/* Section 2: Oráculo Molino AI */}
            <div className="p-6 rounded-2xl bg-background border border-ink/10 space-y-3">
              <div className="flex items-center gap-2 text-[#60A5FA] font-mono text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>Preguntale a Molino (AI)</span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-ink/5 border border-ink/10 text-foreground font-medium text-right ml-6">
                  &ldquo;¿Es buen momento para cambiar de trabajo este mes?&rdquo;
                </div>
                <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-foreground mr-6 leading-relaxed">
                  <p className="font-semibold text-accent mb-1">Molino:</p>
                  Estás en tu Año Personal {profile.cycles?.personalYear || 7} (Introspección y Estrategia),
                  un ciclo que muchas personas usan para planificar antes de actuar. Esto no determina si es
                  buen momento para vos — es una perspectiva más para sumar a lo que ya sabés de tu situación.
                </div>
              </div>
            </div>

            {/* Blurred Overlay for Free Mode */}
            <AnimatePresence>
              {!isUnlockedPreview && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    Contenido exclusivo del Acceso Premium
                  </h3>
                  <p className="text-xs text-muted max-w-sm mt-1 mb-5 leading-relaxed">
                    Desbloqueá la síntesis completa de tus 3 sistemas, detección de tensiones y preguntas
                    ilimitadas a Molino AI.
                  </p>
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => {
                      if (onUnlockClick) onUnlockClick();
                      else setIsUnlockedPreview(true);
                    }}
                    className="flex items-center gap-2 px-6 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    Desbloquear por $8 USD (Pago único)
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
