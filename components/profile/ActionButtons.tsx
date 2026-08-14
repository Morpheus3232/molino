"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  Download,
  Share2,
  CalendarDays,
  Copy,
  AlertCircle,
  Check,
  X,
  RectangleHorizontal,
  Square,
  Loader2,
  BookOpen,
  Heart,
  Sun,
} from "lucide-react";
import type { UserProfile } from "@/types/user";
import ProfileDownloadImage, {
  type ProfileDownloadImageHandle,
  type ExportFormat,
} from "@/components/profile/ProfileDownloadImage";
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

function DownloadFormatModal({
  onSelectFormat,
  onCancel,
  isDownloading,
}: {
  onSelectFormat: (format: ExportFormat) => void;
  onCancel: () => void;
  isDownloading: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDownloading) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, isDownloading]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-card border border-ink/10 rounded-2xl shadow-2xl p-6 text-foreground relative overflow-hidden"
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={isDownloading}
            className="absolute top-4 right-4 p-1.5 text-muted hover:text-foreground rounded-lg transition-colors hover:bg-ink/5 disabled:opacity-40"
            aria-label="Cerrar ventana de descarga"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>

          <div className="mb-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
              Exportar mapa de alta resolución
            </span>
            <h3 id="download-modal-title" className="font-heading text-xl font-bold text-foreground mt-1">
              Elegí el formato para compartir
            </h3>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Generación 100% en tu cliente con código QR y diseño listo para redes sociales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
            {/* Format 1: 1200x630 (OG) */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => onSelectFormat("og")}
              className="flex flex-col items-start p-4 rounded-xl border border-ink/10 bg-background/50 hover:bg-ink/5 hover:border-accent/40 transition-all text-left group disabled:opacity-50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:scale-105 transition-transform">
                  <RectangleHorizontal className="w-5 h-5" />
                </div>
                <span className="font-mono text-[10px] text-muted bg-ink/5 px-2 py-0.5 rounded">
                  1200 × 630 px
                </span>
              </div>
              <span className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                Horizontal (Open Graph)
              </span>
              <span className="text-[11px] text-muted mt-1 leading-normal">
                Ideal para Twitter, LinkedIn, previews de enlace y pantalla ancha.
              </span>
            </button>

            {/* Format 2: 1080x1080 (Instagram Square) */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => onSelectFormat("square")}
              className="flex flex-col items-start p-4 rounded-xl border border-ink/10 bg-background/50 hover:bg-ink/5 hover:border-accent/40 transition-all text-left group disabled:opacity-50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-105 transition-transform">
                  <Square className="w-5 h-5" />
                </div>
                <span className="font-mono text-[10px] text-muted bg-ink/5 px-2 py-0.5 rounded">
                  1080 × 1080 px
                </span>
              </div>
              <span className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                Cuadrado (Instagram)
              </span>
              <span className="text-[11px] text-muted mt-1 leading-normal">
                Optimizado para feed de Instagram, estados y publicaciones cuadradas.
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-ink/10 text-xs">
            {isDownloading ? (
              <span className="inline-flex items-center gap-2 font-mono text-accent text-[11px]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generando imagen PNG...
              </span>
            ) : (
              <span className="font-mono text-[10px] text-muted">
                PNG sin compresión · Sin backend
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isDownloading}
              className="text-muted hover:text-foreground text-xs"
            >
              Cancelar
            </Button>
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
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pendingAction, setPendingAction] = useState<"share" | "copy" | null>(null);

  const handleOpenDownloadModal = () => {
    setShowFormatModal(true);
  };

  const handleSelectFormat = async (format: ExportFormat) => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadRef.current?.download(format);
      setShowFormatModal(false);
    } finally {
      setIsDownloading(false);
    }
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
        className="space-y-4 py-8 border-t border-ink/10"
      >
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          role="group"
          aria-label="Acciones para tu mapa"
        >
          <Button
            variant="primary"
            onClick={handleOpenDownloadModal}
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

          <SavedProfilesDrawer currentProfile={profile} />

          <Link
            href="/hoy"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            Energía de hoy
          </Link>

          <Link
            href={`/pareja?a=${profile.birthDate || ""}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <Heart className="w-4 h-4 text-accent" aria-hidden="true" />
            Modo Pareja
          </Link>

          <Link
            href="/journal"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Journal
          </Link>

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
        </div>

        {/* Social Share Bar */}
        <div className="flex items-center justify-center pt-2">
          <SocialShareBar
            title={`Mapa de ${profile.name || "Autoconocimiento"}`}
            text={shareText}
            url={shareUrl}
          />
        </div>
      </motion.div>

      {showShareWarning && (
        <ShareWarningModal onConfirm={handleConfirm} onCancel={handleCancel} />
      )}

      {showFormatModal && (
        <DownloadFormatModal
          onSelectFormat={handleSelectFormat}
          onCancel={() => setShowFormatModal(false)}
          isDownloading={isDownloading}
        />
      )}
    </>
  );
}
