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

const CARD_WIDTH = 620;

const COLORS = {
  bg: "#0A0A0C",
  card: "#101013",
  ink: "#F3F1EA",
  muted: "#A6A69C",
  faint: "rgba(243, 241, 234, 0.08)",
  rule: "1px solid rgba(243, 241, 234, 0.08)",
  accent: "#7C8CFF",
  num: "#6B4C7A",
  ast: "#2E5C8A",
  zod: "#C49A2A",
};

const SYSTEM = [
  { key: "num", label: "Numerología", color: COLORS.num },
  { key: "ast", label: "Astrología", color: COLORS.ast },
  { key: "zod", label: "Zodíaco chino", color: COLORS.zod },
];

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ padding: "9px 0", borderBottom: COLORS.rule }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: COLORS.muted, margin: 0 }}>
        {label}
      </p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", fontWeight: 600, color: color || COLORS.ink, margin: "3px 0 0 0" }}>
        {value}
      </p>
    </div>
  );
}

function ListBlock({ title, items, color }: { title: string; items: string[]; color?: string }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: "24px" }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: color || COLORS.muted, margin: "0 0 10px 0" }}>
        {title}
      </p>
      <div>
        {items.map((item, i) => (
          <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: "1.65", color: "#D6D4CC", margin: "0 0 6px 0", paddingLeft: "14px", position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: COLORS.accent }}>·</span>
            {item}
          </p>
        ))}
      </div>
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
      ? new Date(profile.birthDate + "T00:00:00").toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";
    const strengths = profile.recommendations?.strengths || [];
    const challenges = profile.recommendations?.challenges || [];
    const practices = profile.recommendations?.practices || [];

    const renderPng = useCallback(async (): Promise<string> => {
      if (!cardRef.current) return "";
      const { toPng } = await import("html-to-image");
      return toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: COLORS.bg,
        width: CARD_WIDTH,
      });
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
      <>
        {/* Card invisible fuera de pantalla — se captura con html-to-image */}
        <div aria-hidden="true" style={{ position: "fixed", left: -9999, top: 0, pointerEvents: "none", zIndex: -1 }}>
          <div
            ref={cardRef}
            style={{
              width: CARD_WIDTH,
              background: COLORS.bg,
              color: COLORS.ink,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.6,
              WebkitFontSmoothing: "antialiased",
            }}
          >
            {/* Branding */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 26px",
                borderBottom: COLORS.rule,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke={COLORS.ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="11" y1="30" x2="14.5" y2="13" />
                  <line x1="21" y1="30" x2="17.5" y2="13" />
                  <line x1="12" y1="26" x2="20" y2="26" strokeWidth="0.5" />
                  <line x1="12.8" y1="22" x2="19.2" y2="22" strokeWidth="0.5" />
                  <line x1="13.5" y1="18" x2="18.5" y2="18" strokeWidth="0.5" />
                  <line x1="14" y1="12.5" x2="18" y2="12.5" strokeWidth="1.6" />
                  <line x1="16" y1="8.5" x2="25" y2="8.5" strokeWidth="0.7" />
                  <path d="M24 6 L24 11 L27 8.5 Z" fill={COLORS.ink} stroke="none" opacity="0.7" />
                  <circle cx="16" cy="8.5" r="4.5" strokeWidth="0.9" />
                  <line x1="16" y1="8.5" x2="20.5" y2="8.5" strokeWidth="0.65" />
                  <line x1="16" y1="8.5" x2="18.36" y2="12.57" strokeWidth="0.65" />
                  <line x1="16" y1="8.5" x2="13.64" y2="12.57" strokeWidth="0.65" />
                  <line x1="16" y1="8.5" x2="11.5" y2="8.5" strokeWidth="0.65" />
                  <line x1="16" y1="8.5" x2="13.64" y2="4.43" strokeWidth="0.65" />
                  <line x1="16" y1="8.5" x2="18.36" y2="4.43" strokeWidth="0.65" />
                  <circle cx="16" cy="8.5" r="1" fill={COLORS.ink} stroke="none" />
                </svg>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: COLORS.ink }}>
                  Molino
                </span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.muted }}>
                Tu mapa personal
              </span>
            </div>

            {/* Hero */}
            <div style={{ padding: "30px 26px 26px" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.muted, margin: "0 0 10px 0" }}>
                {zodiacDisplay.emoji} {zodiacDisplay.name} de {profile.chineseZodiacInfo?.element || ""} · {symbol} {profile.sunSign}
              </p>
              <h2
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "44px",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: COLORS.ink,
                  margin: 0,
                }}
              >
                {archetypeData?.name || profile.archetype}
              </h2>
              {archetypeData?.quote && (
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontStyle: "italic", lineHeight: 1.6, color: "#B4B2AA", margin: "14px 0 0 0", maxWidth: "520px" }}>
                  “{archetypeData.quote}”
                </p>
              )}
            </div>

            {/* Sistemas */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                padding: "0 26px 26px",
              }}
            >
              {SYSTEM.map((sys) => {
                const stats: { label: string; value: string | number }[] =
                  sys.key === "num"
                    ? [
                        { label: "Camino de vida", value: lifePath },
                        { label: "Expresión", value: profile.expressionNumber ?? "—" },
                        { label: "Alma", value: profile.soulNumber ?? "—" },
                        { label: "Personalidad", value: profile.personalityNumber ?? "—" },
                        { label: "Suerte", value: profile.luckyNumber ?? "—" },
                      ]
                    : sys.key === "ast"
                      ? [
                          { label: "Signo solar", value: `${symbol} ${profile.sunSign}` },
                          { label: "Elemento", value: profile.sunSignInfo?.element || "—" },
                          { label: "Modalidad", value: profile.sunSignInfo?.modality || "—" },
                          { label: "Año personal", value: profile.cycles?.personalYear ?? "—" },
                          { label: "Mes personal", value: profile.cycles?.personalMonth ?? "—" },
                        ]
                      : [
                          { label: "Animal", value: `${zodiacDisplay.emoji} ${zodiacDisplay.name}` },
                          { label: "Elemento", value: profile.chineseZodiacInfo?.element || "—" },
                          { label: "Año", value: profile.birthDate?.split("-")[0] || "—" },
                        ];
                return (
                  <div key={sys.key} style={{ background: COLORS.card, border: COLORS.rule, borderLeft: `3px solid ${sys.color}`, padding: "14px 14px 6px" }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: sys.color, fontWeight: 600, margin: "0 0 8px 0" }}>
                      {sys.label}
                    </p>
                    {stats.map((s) => (
                      <Stat key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Recomendaciones */}
            <div style={{ padding: "0 26px 30px", borderTop: COLORS.rule, marginTop: "4px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0 28px", marginTop: "20px" }}>
                <ListBlock title="Fortalezas" items={strengths} color={COLORS.num} />
                <ListBlock title="Desafíos" items={challenges} color={COLORS.ast} />
              </div>
              <ListBlock title="Prácticas recomendadas" items={practices} color={COLORS.zod} />
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: COLORS.rule,
                padding: "16px 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", color: COLORS.muted }}>
                {birthDate}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", color: COLORS.muted }}>
                molino.app · Sin registro · Sin cookies
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
);

ProfileDownloadImage.displayName = "ProfileDownloadImage";

export default ProfileDownloadImage;
