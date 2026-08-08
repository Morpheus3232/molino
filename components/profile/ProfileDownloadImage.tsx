"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";

export interface ProfileDownloadImageHandle {
  download: () => Promise<void>;
}

interface ProfileDownloadImageProps {
  profile: UserProfile;
}

const W = 620;

const C = {
  bg: "#0A0A0C",
  card: "#111114",
  ink: "#F3F1EA",
  muted: "#8A8880",
  dim: "rgba(243,241,234,0.06)",
  rule: "1px solid rgba(243,241,234,0.07)",
  accent: "#7C8CFF",
  num: "#8B6FA0",
  ast: "#5A8AB4",
  zod: "#D4A843",
};

const SYSTEMS = [
  { key: "num", label: "NUMEROLOGÍA", color: C.num },
  { key: "ast", label: "ASTROLOGÍA", color: C.ast },
  { key: "zod", label: "ZODÍACO CHINO", color: C.zod },
];

function S({ l, v, c }: { l: string; v: string | number; c?: string }) {
  return (
    <div style={{ padding: "5px 0", borderBottom: C.rule, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted }}>{l}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 600, color: c || C.ink, textAlign: "right" }}>{v}</span>
    </div>
  );
}

function List({ t, items, c }: { t: string; items: string[]; c?: string }) {
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: "12px" }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: c || C.muted, margin: "0 0 6px 0", fontWeight: 600 }}>{t}</p>
      {items.map((item, i) => (
        <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.55", color: "#C0BEB8", margin: "0 0 3px 0", paddingLeft: "10px", position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: C.accent, fontSize: "8px", top: "2px" }}>—</span>
          {item}
        </p>
      ))}
    </div>
  );
}

const ProfileDownloadImage = forwardRef<ProfileDownloadImageHandle, ProfileDownloadImageProps>(
  ({ profile }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const lifePath = safeNumber(profile.lifePath, 1);
    const zodiacDisplay = getZodiacDisplay(profile.chineseZodiac);
    const symbol = ZODIAC_SYMBOLS[profile.sunSign] || "";
    const archetypeData = ARCHETYPES[lifePath];
    const birthDate = profile.birthDate
      ? new Date(profile.birthDate + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
      : "";
    const strengths = profile.recommendations?.strengths || [];
    const challenges = profile.recommendations?.challenges || [];
    const practices = profile.recommendations?.practices || [];

    const renderPng = useCallback(async (): Promise<string> => {
      if (!cardRef.current) return "";
      const { toPng } = await import("html-to-image");
      return toPng(cardRef.current, { quality: 1, pixelRatio: 3, cacheBust: true, backgroundColor: C.bg, width: W });
    }, []);

    const download = useCallback(async () => {
      if (!cardRef.current || generating) return;
      setGenerating(true);
      try {
        const dataUrl = await renderPng();
        const link = document.createElement("a");
        link.download = `molino-mapa-${profile.birthDate || "personal"}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("[Molino] Error generando la imagen:", err);
      } finally {
        setGenerating(false);
      }
    }, [generating, profile.birthDate, renderPng]);

    useImperativeHandle(ref, () => ({ download }), [download]);

    return (
      <div aria-hidden="true" style={{ position: "fixed", left: -9999, top: 0, pointerEvents: "none", zIndex: -1 }}>
        <div
          ref={cardRef}
          style={{
            width: W,
            background: C.bg,
            color: C.ink,
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.5,
            WebkitFontSmoothing: "antialiased",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: C.rule, background: C.card }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke={C.ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="11" y1="30" x2="14.5" y2="13" /><line x1="21" y1="30" x2="17.5" y2="13" />
                <line x1="12" y1="26" x2="20" y2="26" strokeWidth="0.5" /><line x1="12.8" y1="22" x2="19.2" y2="22" strokeWidth="0.5" /><line x1="13.5" y1="18" x2="18.5" y2="18" strokeWidth="0.5" />
                <line x1="14" y1="12.5" x2="18" y2="12.5" strokeWidth="1.6" />
                <line x1="16" y1="8.5" x2="25" y2="8.5" strokeWidth="0.7" /><path d="M24 6 L24 11 L27 8.5 Z" fill={C.ink} stroke="none" opacity="0.7" />
                <circle cx="16" cy="8.5" r="4.5" strokeWidth="0.9" />
                <circle cx="16" cy="8.5" r="1" fill={C.ink} stroke="none" />
              </svg>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: C.ink, fontWeight: 500 }}>Molino</span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>Tu mapa personal</span>
          </div>

          {/* Hero — Archetype */}
          <div style={{ padding: "20px 24px 14px" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, margin: "0 0 6px 0" }}>
              {zodiacDisplay.emoji} {zodiacDisplay.name} de {profile.chineseZodiacInfo?.element || ""} · {symbol} {profile.sunSign}
            </p>
            <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "38px", lineHeight: 0.92, letterSpacing: "-0.02em", textTransform: "uppercase", color: C.ink, margin: 0 }}>
              {archetypeData?.name || profile.archetype}
            </h2>
            {archetypeData?.quote && (
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontStyle: "italic", lineHeight: 1.5, color: C.muted, margin: "8px 0 0 0" }}>
                &ldquo;{archetypeData.quote}&rdquo;
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ margin: "0 24px", height: 1, background: C.dim }} />

          {/* Systems — 3 columns, compact */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "10px 24px 14px" }}>
            {SYSTEMS.map((sys) => {
              const stats: { l: string; v: string | number }[] =
                sys.key === "num"
                  ? [
                      { l: "Camino", v: lifePath },
                      { l: "Expresión", v: profile.expressionNumber ?? "—" },
                      { l: "Alma", v: profile.soulNumber ?? "—" },
                      { l: "Personalidad", v: profile.personalityNumber ?? "—" },
                      { l: "Suerte", v: profile.luckyNumber ?? "—" },
                    ]
                  : sys.key === "ast"
                    ? [
                        { l: "Signo", v: `${symbol} ${profile.sunSign}` },
                        { l: "Elemento", v: profile.sunSignInfo?.element || "—" },
                        { l: "Modalidad", v: profile.sunSignInfo?.modality || "—" },
                        { l: "Año pers.", v: profile.cycles?.personalYear ?? "—" },
                        { l: "Mes pers.", v: profile.cycles?.personalMonth ?? "—" },
                      ]
                    : [
                        { l: "Animal", v: `${zodiacDisplay.emoji} ${zodiacDisplay.name}` },
                        { l: "Elemento", v: profile.chineseZodiacInfo?.element || "—" },
                        { l: "Año", v: profile.birthDate?.split("-")[0] || "—" },
                      ];
              return (
                <div key={sys.key} style={{ background: C.card, borderTop: `2px solid ${C.dim}`, padding: "8px 10px 4px" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: sys.color, fontWeight: 600, margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: sys.color, flexShrink: 0 }} />
                    {sys.label}
                  </p>
                  {stats.map((s) => <S key={s.l} l={s.l} v={s.v} />)}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ margin: "0 24px", height: 1, background: C.dim }} />

          {/* Recommendations — 2 col */}
          <div style={{ padding: "10px 24px 6px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0 20px" }}>
            <List t="Fortalezas" items={strengths} c={C.num} />
            <List t="Desafíos" items={challenges} c={C.ast} />
          </div>
          <div style={{ padding: "0 24px 12px" }}>
            <List t="Prácticas recomendadas" items={practices} c={C.zod} />
          </div>

          {/* Footer */}
          <div style={{ borderTop: C.rule, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.card }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.1em", color: C.muted }}>{birthDate}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.1em", color: C.muted }}>molino.app · Sin registro · Sin cookies</span>
          </div>
        </div>
      </div>
    );
  }
);

ProfileDownloadImage.displayName = "ProfileDownloadImage";
export default ProfileDownloadImage;
