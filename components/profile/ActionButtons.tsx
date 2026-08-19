"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Download, Share2, Sun, Copy } from "lucide-react";
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

export default function ActionButtons({ profile }: ActionButtonsProps) {
  const downloadRef = useRef<ProfileDownloadImageHandle>(null);
  const [showShareDisclaimer, setShowShareDisclaimer] = useState(false);
  const [pendingShare, setPendingShare] = useState<(() => void) | null>(null);
  const shareText = generateShareText(profile);
  const shareUrl = generateShareUrl(profile);

  const requestShare = (action: () => void) => {
    setPendingShare(() => action);
    setShowShareDisclaimer(true);
  };

  const confirmShare = () => {
    setShowShareDisclaimer(false);
    pendingShare?.();
    setPendingShare(null);
  };

  const cancelShare = () => {
    setShowShareDisclaimer(false);
    setPendingShare(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      requestShare(async () => {
        try {
          await navigator.share({ title: "Mi Mapa Molino", text: shareText, url: shareUrl });
        } catch {}
      });
      return;
    }
    requestShare(() => copyToClipboard(`${shareText}\n${shareUrl}`));
  };

  const handleDownload = () => {
    downloadRef.current?.download();
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${shareText}\n\nVer en Molino:`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, "_blank", "width=550,height=420");
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
          href="/hoy"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          <Sun className="w-4 h-4" aria-hidden="true" />
          Energía de hoy
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(shareUrl)}
          className="flex items-center gap-1"
          aria-label="Copiar enlace al perfil"
        >
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Enlace</span>
        </Button>
      </motion.div>
    </>
  );
}