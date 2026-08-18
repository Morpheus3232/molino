"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Share2, Check, Copy } from "lucide-react";
import type { UserProfile } from "@/types/user";
import { buildPersonalCode, buildPatterns, generatePaywallHook } from "@/lib/engines/synthesisEngine";
import { PERSONAL_YEAR_MEANINGS } from "@/lib/engines/dailyEnergyEngine";
import { ZODIAC_SYMBOLS, ELEMENT_COLORS } from "@/lib/data/constants";
import { CHINESE_ANIMALS } from "@/lib/data/zodiaco-chino-content";
import { safeNumber } from "@/lib/utils/score";
import { nodeToPng, dataUrlToBlob, sanitizeFilenamePart, type ExportSize } from "@/lib/utils/exportImage";

/**
 * ProfileShareCard — tarjeta compartible del mapa personal, en 4 variantes.
 * Clon estructural de AtlasShareCard.tsx (mismo header/footer, mismo flujo
 * de export + Web Share con fallback a copiar link) — el contenido central
 * es lo único que cambia por variant, armado con datos ya calculados por
 * los engines existentes (nada nuevo que inventar).
 */

export type ShareVariant = "complete" | "pattern" | "tension" | "year";

interface VariantContent {
  label: string;
  format: ExportSize;
  eyebrow: string;
  title: string;
  body: string;
  footer: string;
  shareText: string;
}

function buildVariantContent(profile: UserProfile, variant: ShareVariant): VariantContent {
  const element = typeof profile.element === "string" ? profile.element : "";

  switch (variant) {
    case "complete": {
      const code = buildPersonalCode(profile);
      const sunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
      const chineseZodiac = typeof profile.chineseZodiac === "string" ? profile.chineseZodiac : "";
      const glyph = ZODIAC_SYMBOLS[sunSign] ?? "";
      const animalEmoji = CHINESE_ANIMALS.find((a) => a.name === chineseZodiac)?.emoji ?? "";
      return {
        label: "MAPA",
        format: "square",
        eyebrow: `Camino de Vida ${code.lifePath.number}`,
        title: `${glyph} ${sunSign}  ·  ${animalEmoji} ${chineseZodiac}`,
        body: code.lifePath.name,
        footer: "Numerología · Astrología · Zodíaco Chino",
        shareText: `Mi Camino de Vida es ${code.lifePath.number} (${code.lifePath.name}), ${sunSign} y ${chineseZodiac}`,
      };
    }
    case "pattern": {
      const pattern = buildPatterns(profile)[0];
      return {
        label: "PATRÓN",
        format: "square",
        eyebrow: pattern.label,
        title: pattern.keyword,
        body: pattern.description,
        footer: "Lectura simbólica · numerología + astrología",
        shareText: `Mi patrón central: ${pattern.keyword}`,
      };
    }
    case "tension": {
      const hook = generatePaywallHook(profile);
      return {
        label: "TENSIÓN",
        format: "story",
        eyebrow: "Tu mapa tiene una pregunta abierta",
        title: hook.question,
        body: "Descubrilo en tu mapa completo.",
        footer: "Lectura simbólica personal",
        shareText: hook.question,
      };
    }
    case "year": {
      const personalYear = safeNumber(profile.cycles?.personalYear, 1);
      const meaning = PERSONAL_YEAR_MEANINGS[personalYear];
      return {
        label: `AÑO PERSONAL`,
        format: "square",
        eyebrow: meaning?.theme ?? "Tu ciclo actual",
        title: String(personalYear),
        body: meaning?.focus.split(".")[0] + "." || "",
        footer: "Ciclo de nueve años · numerología",
        shareText: `Estoy en mi Año Personal ${personalYear}${meaning ? `: ${meaning.theme}` : ""}`,
      };
    }
  }
}

interface ProfileShareCardProps {
  profile: UserProfile;
  variant: ShareVariant;
  /** Sin preview visible ni botón de copiar link — un único ícono que
   * comparte directo (usado junto a "01 · Tu Patrón Central"). El nodo
   * sigue montado (oculto) para que nodeToPng pueda capturarlo. */
  compact?: boolean;
}

export default function ProfileShareCard({ profile, variant, compact = false }: ProfileShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const content = buildVariantContent(profile, variant);
  const elementColor = ELEMENT_COLORS[typeof profile.element === "string" ? profile.element : ""] ?? "var(--color-accent)";
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/premium` : "";

  const handleShare = async () => {
    if (busy || !cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await nodeToPng(cardRef.current, content.format);
      if (typeof navigator !== "undefined" && navigator.share) {
        const blob = dataUrlToBlob(dataUrl);
        const file = new File([blob], `molino-${sanitizeFilenamePart(variant)}.png`, { type: "image/png" });
        try {
          await navigator.share({
            title: "Mi mapa — Molino",
            text: `${content.shareText} · Leé el tuyo en Molino ✨`,
            url: shareUrl,
            files: [file],
          });
          toast.success("Tarjeta compartida");
          return;
        } catch {
          // Usuario canceló el share nativo — cae al fallback en silencio.
        }
      }
      await navigator.clipboard.writeText(`${content.shareText} · Leé el tuyo en Molino ✨ — ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      toast.success("Enlace copiado");
    } catch {
      toast.error("No pudimos compartir. Intentá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const card = (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl border border-ink/10 bg-paper-alt text-foreground ${
        content.format === "story" ? "aspect-[9/16] max-w-[280px]" : "aspect-square max-w-[480px]"
      } w-full`}
    >
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${elementColor}22, transparent 70%)` }}
      />
      <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col h-full p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center bg-ink text-paper">
              <span className="font-serif text-lg font-bold leading-none text-gold">M</span>
            </span>
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em]">Molino</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{content.label}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{content.eyebrow}</p>
          <p
            className={`font-heading font-bold leading-tight ${
              variant === "tension" ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl uppercase"
            }`}
            style={{ color: elementColor }}
          >
            {content.title}
          </p>
          {content.body && <p className="text-sm text-muted leading-relaxed max-w-[85%]">{content.body}</p>}
        </div>

        <div className="pt-5 border-t border-ink/10 flex items-center justify-between text-xs text-muted">
          <span className="max-w-[70%]">{content.footer}</span>
          <span className="font-mono">molino.app</span>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <>
        {/* w-full en la card necesita un ancho real del padre para no resolver
            a 0px (html-to-image tira un canvas vacío si lo hace) — por eso
            fixed + un ancho explícito acá, no solo "oculto con opacity-0". */}
        <div
          className="fixed top-0 opacity-0 pointer-events-none -z-10 -left-[9999px]"
          style={{ width: content.format === "story" ? 280 : 480 }}
          aria-hidden="true"
        >
          {card}
        </div>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          aria-label="Compartir tu patrón central"
          className="inline-flex items-center justify-center w-8 h-8 text-muted hover:text-accent transition-colors disabled:opacity-60"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </>
    );
  }

  return (
    <div className="space-y-4">
      {card}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 font-medium transition-all px-6 py-3 text-sm border border-accent/30 bg-accent/[0.03] text-accent hover:bg-accent/10 min-h-[44px] disabled:opacity-60"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copiado</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Compartir
            </>
          )}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2200);
              toast.success("Enlace copiado");
            } catch {
              toast.error("No pudimos copiar el enlace.");
            }
          }}
          className="inline-flex items-center justify-center gap-2 font-medium transition-all px-6 py-3 text-sm border border-ink/10 bg-transparent text-muted hover:border-accent hover:text-foreground min-h-[44px]"
        >
          <Copy className="w-4 h-4" />
          Copiar enlace
        </button>
      </div>
    </div>
  );
}

export { buildVariantContent };
