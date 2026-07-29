"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DownloadProfileButtonProps {
  elementId: string;
  filename?: string;
}

export default function DownloadProfileButton({ elementId, filename = "mi-mapa-molino" }: DownloadProfileButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      // Dynamic import to avoid SSR issues
      const { toPng } = await import("html-to-image");

      const element = document.getElementById(elementId);
      if (!element) {
        toast.error("No se encontró el elemento a descargar");
        return;
      }

      const dataUrl = await toPng(element, {
        backgroundColor: getComputedStyle(element).backgroundColor || "#ffffff",
        pixelRatio: 2,
        quality: 0.95,
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();

      setHasDownloaded(true);
      toast.success("Imagen descargada correctamente");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("No se pudo generar la imagen");
    } finally {
      setIsDownloading(false);
      setTimeout(() => setHasDownloaded(false), 2000);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isDownloading ? "Generando imagen..." : "Descargar mapa como imagen"}
    >
      {isDownloading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Generando...</span>
        </>
      ) : hasDownloaded ? (
        <>
          <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
          <span className="text-green-600">¡Descargado!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Descargar imagen</span>
        </>
      )}
    </motion.button>
  );
}