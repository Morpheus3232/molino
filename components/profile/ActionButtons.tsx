"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { Share2, AlertCircle, Check } from "lucide-react";
import type { UserProfile } from "@/types/user";
import SavedProfilesDrawer from "@/components/profile/SavedProfilesDrawer";
import SocialShareBar from "@/components/ui/SocialShareBar";

interface ActionButtonsProps {
  profile: UserProfile;
}

import { SITE_URL } from "@/lib/seo";

function generateShareText(profile: UserProfile): string {
  const displayName = profile.name || "Tu Mapa";
  return `${displayName} — ${profile.archetype || "Mapa de Autoconocimiento"} · Camino ${profile.lifePath} · ${profile.sunSign} · ${profile.chineseZodiac}`;
}

function generateShareUrl(profile: UserProfile): string {
  return `${SITE_URL}/profile?dob=${profile.birthDate}`;
}

function ShareWarningModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-warning-title"
        aria-describedby="share-warning-desc"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-background border border-ink/10 rounded-xl shadow-xl p-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center" aria-hidden="true">
              <AlertCircle className="w-5 h-5 text-amber" />
            </div>
            <div className="flex-1">
              <h3 id="share-warning-title" className="font-heading text-lg font-semibold text-foreground">
                Compartir tu perfil
              </h3>
              <p id="share-warning-desc" className="mt-2 text-sm text-muted leading-relaxed">
                Este link contiene tu fecha de nacimiento codificada (no encriptada). Compartilo solo con personas de confianza.
              </p>
              <div className="mt-4 flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-muted hover:text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onConfirm}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  Entendido, copiar link
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ActionButtons({ profile }: ActionButtonsProps) {
  const shareText = generateShareText(profile);
  const shareUrl = generateShareUrl(profile);
  const [showShareWarning, setShowShareWarning] = useState(false);
  const [shareRevealed, setShareRevealed] = useState(false);

  const handleShare = () => {
    if (shareRevealed) return;
    setShowShareWarning(true);
  };

  const handleConfirm = () => {
    setShareRevealed(true);
    setShowShareWarning(false);
  };

  const handleCancel = () => {
    setShowShareWarning(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-4 py-8 border-t border-ink/10"
      >
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          role="group"
          aria-label="Acciones para tu mapa"
        >
          {!shareRevealed && (
            <Button
              variant="ghost"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
              Compartir
            </Button>
          )}

          <SavedProfilesDrawer currentProfile={profile} />
        </div>

        {shareRevealed && (
          <div className="flex items-center justify-center pt-2">
            <SocialShareBar
              title={`Mapa de ${profile.name || "Autoconocimiento"}`}
              text={shareText}
              url={shareUrl}
            />
          </div>
        )}
      </motion.div>

      {showShareWarning && (
        <ShareWarningModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
}
