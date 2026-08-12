"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Download, Share2, CalendarDays, Copy, AlertCircle, Check } from "lucide-react";
import type { UserProfile } from "@/types/user";
import ProfileDownloadImage, { type ProfileDownloadImageHandle } from "@/components/profile/ProfileDownloadImage";

interface ActionButtonsProps {
  profile: UserProfile;
}

function generateShareText(profile: UserProfile): string {
  const displayName = profile.name || "Tu Mapa";
  return `${displayName} — ${profile.archetype} · Camino ${profile.lifePath} · ${profile.sunSign} · ${profile.chineseZodiac}`;
}

function generateShareUrl(profile: UserProfile): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/profile?dob=${profile.birthDate}`;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
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
  const downloadRef = useRef<ProfileDownloadImageHandle>(null);
  const shareText = generateShareText(profile);
  const shareUrl = generateShareUrl(profile);
  const [showShareWarning, setShowShareWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<"share" | "copy" | null>(null);

  const handleDownload = () => {
    downloadRef.current?.download();
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${shareText}\n\nVer en Molino:`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, "_blank", "width=550,height=420");
  };

  const executeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mi Mapa Molino", text: shareText, url: shareUrl });
        return;
      } catch {}
    }
    await copyToClipboard(`${shareText}\n${shareUrl}`);
  }, [shareText, shareUrl]);

  const executeCopy = useCallback(async () => {
    await copyToClipboard(shareUrl);
  }, [shareUrl]);

  const handleShare = () => {
    setPendingAction("share");
    setShowShareWarning(true);
  };

  const handleCopyLink = () => {
    setPendingAction("copy");
    setShowShareWarning(true);
  };

  const handleConfirm = () => {
    if (pendingAction === "share") {
      executeShare();
    } else if (pendingAction === "copy") {
      executeCopy();
    }
    setShowShareWarning(false);
    setPendingAction(null);
  };

  const handleCancel = () => {
    setShowShareWarning(false);
    setPendingAction(null);
  };

  return (
    <>
      <ProfileDownloadImage ref={downloadRef} profile={profile} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3 py-8 border-t border-ink/10"
        role="group"
        aria-label="Acciones para tu mapa"
      >
        <Button
          variant="primary"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Descargar mapa
        </Button>

        <Button
          variant="ghost"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" aria-hidden="true" />
          Compartir
        </Button>

        <Button
          variant="ghost"
          onClick={handleTwitterShare}
          className="flex items-center gap-2"
          aria-label="Compartir en Twitter"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Twitter
        </Button>

        <Link
          href="/calendario"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          <CalendarDays className="w-4 h-4" aria-hidden="true" />
          Calendario
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="flex items-center gap-1"
          aria-label="Copiar enlace al perfil"
        >
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Enlace</span>
        </Button>
      </motion.div>

      {showShareWarning && (
        <ShareWarningModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
}