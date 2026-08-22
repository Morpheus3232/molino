"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { buildPublicShareUrl, encodePublicShareData } from "@/lib/utils/profileShare";
import { analytics } from "@/lib/analytics/analytics";
import type { UserProfile } from "@/types/user";

interface SharePublicButtonProps {
  profile: UserProfile;
  path: "/circulo" | "/mundo";
  label?: string;
}

export default function SharePublicButton({
  profile,
  path,
  label = "Compartir",
}: SharePublicButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = buildPublicShareUrl(profile, path);
    const text = `Mirá mi ${path === "/circulo" ? "círculo" : "mundo"} de energías en Molino: ${url}`;

    // Track share event
    analytics.trackFeatureUsed(`share_${path === "/circulo" ? "circulo" : "mundo"}`);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mi ${path === "/circulo" ? "círculo" : "mundo"}`,
          text,
          url,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground hover:bg-ink/5 transition-colors rounded-md"
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="text-accent">Copiado</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
