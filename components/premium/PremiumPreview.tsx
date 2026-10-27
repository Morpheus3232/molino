"use client";
import { useL } from "@/lib/i18n/useL";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";
import { ARCHETYPES, archetypeDisplayName } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import {
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

// Perfil de referencia (El Investigador / Piscis / Caballo): lo que se
// muestra mientras no hay un perfil guardado y en SSR. Como no depende de
// nada del componente, vive en módulo para no recalcularse en cada render.
const FALLBACK_PROFILE = calculateUserProfile("Alex", "1990-04-18");

export default function PremiumPreview({
  className = "",
  onUnlockClick,
}: PremiumPreviewProps) {
  const L = useL();
  const [isUnlockedPreview, setIsUnlockedPreview] = useState(true);

  // El perfil se carga en useEffect (no en useMemo durante el render):
  // leer localStorage en el render rompe la igualdad servidor/cliente y
  // dispara React error #418. El servidor y la hidratación muestran el
  // perfil de referencia; apenas monta, se reemplaza por el guardado.
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = loadProfileFromStorage();
    setProfile(stored ? (stored as UserProfile) : null);
  }, []);

  const displayProfile = profile || FALLBACK_PROFILE;

  const lifePath = safeNumber(displayProfile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const archetypeName = archetypeDisplayName(archetype.name || L("El Caminante", "The Wanderer"));

  return (
    <section className={`py-12 ${className}`} aria-labelledby="premium-preview-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="text-center mb-10">
          <span className="text-sm text-accent font-bold label-caps">{L("Preview Interactivo", "Interactive Preview")}</span>
          <h2
            id="premium-preview-title"
            className="section-title text-foreground mt-1"
          >{L("Así se ve tu lectura desbloqueada", "This is what your unlocked reading looks like")}</h2>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-xl mx-auto">{L(<>
            Interactuá con la vista previa basada en tu mapa ({L.t(archetypeName)}, {L.t(displayProfile.sunSign)},{" "}
            {L.t(displayProfile.chineseZodiac)}).
          </>, <>Play with the preview based on your map ({L.t(archetypeName)}, {L.t(displayProfile.sunSign)},{" "}{L.t(displayProfile.chineseZodiac)}).</>)}</p>

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
                {L("Vista Gratis (Bloqueada)", "Free View (Locked)")}
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
                {L("Vista Premium (Desbloqueada)", "Premium View (Unlocked)")}
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="relative rounded-xl border border-ink/15 bg-gradient-to-b from-card via-card to-background p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Top Bar with user badge */}
          <div className="flex items-center justify-between gap-3 pb-6 border-b border-ink/10 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <div>{L(<>
                <span className="text-sm text-muted block label-caps">
                  Perfil Activo
                </span>
                <span className="font-heading text-sm sm:text-base font-bold text-foreground">
                  {L.t(archetypeName)} · Camino {L.t(lifePath)} · {L.t(displayProfile.sunSign)}
                </span>
              </>, <><span className="text-sm text-muted block label-caps">Active Profile</span><span className="font-heading text-sm sm:text-base font-bold text-foreground">{L.t(archetypeName)} · Path {L.t(lifePath)} · {L.t(displayProfile.sunSign)}</span></>)}</div>
            </div>

            <span className="font-mono text-xs text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full font-bold">
              {L.t(isUnlockedPreview ? L("Modo Pro Desbloqueado", "Pro Mode Unlocked") : L("🔒 Modo Free", "🔒 Free Mode"))}
            </span>
          </div>

          {/* Preview Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Section 1: Síntesis de Convergencia */}
            <div className="p-6 rounded-lg bg-background border border-ink/10 space-y-3">
              <div className="flex items-center gap-2 text-accent text-sm font-bold label-caps">{L(<>
                <span>Síntesis de Convergencia</span>
              </>, <><span>Convergence Synthesis</span></>)}</div>
              <h3 className="font-heading text-lg font-bold text-foreground">{L("La tensión entre tu visión y tu ritmo", "The tension between your vision and your rhythm")}</h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{L(<>
                Tu Camino {L.t(lifePath)} ({L.t(archetypeName)}) te impulsa a construir con autonomía, pero tu
                naturaleza de {L.t(displayProfile.chineseZodiac)} ({L.t(displayProfile.chineseZodiacInfo?.element || "Fuego")}) busca
                movimiento continuo.
              </>, <>Your Path {L.t(lifePath)} ({L.t(archetypeName)}) drives you to build autonomously, but your {L.t(displayProfile.chineseZodiac)} nature ({L.t(displayProfile.chineseZodiacInfo?.element || "Fire")}) seeks constant movement.</>)}</p>
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/15 text-xs text-muted leading-relaxed">{L(<>
                <strong>Clave de integración:</strong> No intentes frenar tu impulso de exploración. Usá tu
                capacidad analítica para seleccionar 2 objetivos al año y canalizar toda tu energía allí.
              </>, <><strong>Integration key:</strong> Don't try to hold back your drive to explore. Use your analytical ability to pick 2 goals a year and channel all your energy there.</>)}</div>
            </div>

            {/* Section 2: Oráculo Molino AI */}
            <div className="p-6 rounded-lg bg-background border border-ink/10 space-y-3">
              <div className="flex items-center gap-2 text-[#A2A2A2] text-sm font-bold label-caps">
                <MessageSquare className="w-4 h-4" />
                <span>{L("Preguntale a Molino (AI)", "Ask Molino (AI)")}</span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-ink/5 border border-ink/10 text-foreground font-medium text-right ml-6">{L(<>
                  &ldquo;¿Es buen momento para cambiar de trabajo este mes?&rdquo;
                </>, <>&ldquo;Is this a good month to change jobs?&rdquo;</>)}</div>
                <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-foreground mr-6 leading-relaxed">
                  <p className="font-semibold text-accent mb-1">Molino:</p>
                  {L("Estás en tu Año Personal ", "You're in your Personal Year ")} {displayProfile.cycles?.personalYear || 7} {L(" (Introspección y Estrategia), un ciclo que muchas personas usan para planificar antes de actuar. Esto no determina si es buen momento para vos — es una perspectiva más para sumar a lo que ya sabés de tu situación.", " (Introspection and Strategy), a cycle many people use to plan before acting. This doesn't determine whether it's a good moment for you — it's one more perspective to add to what you already know about your situation.")}
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
                  className="absolute inset-0 bg-background/85 backdrop-blur-md rounded-lg flex flex-col items-center justify-center p-6 text-center z-20"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{L("Contenido exclusivo del Acceso Premium", "Exclusive Premium Access content")}</h3>
                  <p className="text-xs text-muted max-w-sm mt-1 mb-5 leading-relaxed">{L("Desbloqueá la síntesis completa de tus 3 sistemas, detección de tensiones y la IA que ya conoce tu mapa.", "Unlock the complete synthesis of your 3 systems, tension detection and the AI that already knows your map.")}</p>
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => {
                      if (onUnlockClick) onUnlockClick();
                      else setIsUnlockedPreview(true);
                    }}
                    className="flex items-center gap-2 px-6 shadow-lg"
                  >{L("Desbloquear por $8 USD (Pago único)", "Unlock for $8 USD (One-time payment)")}</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
