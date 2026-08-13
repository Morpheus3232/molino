"use client";

import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { CoupleCompatibilityResult } from "@/lib/engines/coupleEngine";
import { generateQrMatrix, qrMatrixToSvgPath } from "@/lib/utils/qrcode";
import { ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";

export interface CoupleShareCardHandle {
  download: () => Promise<void>;
  renderPng: () => Promise<string>;
}

interface CoupleShareCardProps {
  result: CoupleCompatibilityResult;
}

function sanitizeFilenamePart(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function MolinoIcon({ size = 24, color = "#F3F1EA" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="11" y1="30" x2="14.5" y2="13" />
      <line x1="21" y1="30" x2="17.5" y2="13" />
      <line x1="12" y1="26" x2="20" y2="26" strokeWidth="0.5" />
      <line x1="12.8" y1="22" x2="19.2" y2="22" strokeWidth="0.5" />
      <line x1="13.5" y1="18" x2="18.5" y2="18" strokeWidth="0.5" />
      <line x1="14" y1="12.5" x2="18" y2="12.5" strokeWidth="1.6" />
      <line x1="16" y1="8.5" x2="25" y2="8.5" strokeWidth="0.7" />
      <path d="M24 6 L24 11 L27 8.5 Z" fill={color} stroke="none" opacity="0.85" />
      <circle cx="16" cy="8.5" r="4.5" strokeWidth="0.9" />
      <circle cx="16" cy="8.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

function QrBlock({ url, size = 80 }: { url: string; size?: number }) {
  const matrix = useMemo(() => generateQrMatrix(url), [url]);
  const n = matrix.length;
  const path = useMemo(() => qrMatrixToSvgPath(matrix), [matrix]);

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#FFFFFF",
        padding: 5,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox={`0 0 ${n} ${n}`} width="100%" height="100%" shapeRendering="crispEdges">
        <path d={path} fill="#09090D" />
      </svg>
    </div>
  );
}

const CoupleShareCard = forwardRef<CoupleShareCardHandle, CoupleShareCardProps>(
  ({ result }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const { profileA, profileB, score, level, connections, dailyAdvice } = result;

    const lifePathA = safeNumber(profileA.lifePath, 1);
    const lifePathB = safeNumber(profileB.lifePath, 1);
    const archA = ARCHETYPES[lifePathA]?.name || "El Caminante";
    const archB = ARCHETYPES[lifePathB]?.name || "El Caminante";

    const sunSignA = profileA.sunSign || "Aries";
    const sunSignB = profileB.sunSign || "Aries";
    const sunSymbolA = ZODIAC_SYMBOLS[sunSignA] || "♈";
    const sunSymbolB = ZODIAC_SYMBOLS[sunSignB] || "♈";

    const zodiacA = getZodiacDisplay(profileA.chineseZodiac);
    const zodiacB = getZodiacDisplay(profileB.chineseZodiac);

    const nameA = profileA.name?.trim() || archA;
    const nameB = profileB.name?.trim() || archB;

    const shareUrl = useMemo(() => {
      const dateA = profileA.birthDate || "";
      const dateB = profileB.birthDate || "";
      return `https://molino.app/pareja?a=${dateA}&b=${dateB}`;
    }, [profileA.birthDate, profileB.birthDate]);

    const renderPng = useCallback(async (): Promise<string> => {
      if (!cardRef.current) return "";
      const { toPng } = await import("html-to-image");
      return toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#09090D",
        width: 1200,
        height: 630,
      });
    }, []);

    const download = useCallback(async () => {
      if (generating) return;
      setGenerating(true);
      try {
        const dataUrl = await renderPng();
        if (!dataUrl) return;

        const partA = sanitizeFilenamePart(nameA);
        const partB = sanitizeFilenamePart(nameB);
        const dateStr = new Date().toISOString().split("T")[0];
        const filename = `molino-pareja-${partA}-${partB}-${dateStr}.png`;

        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("[CoupleShareCard] Error generating image:", err);
      } finally {
        setGenerating(false);
      }
    }, [generating, nameA, nameB, renderPng]);

    useImperativeHandle(ref, () => ({ download, renderPng }), [download, renderPng]);

    const highlightConnections = connections.slice(0, 2);

    return (
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          width: 0,
          height: 0,
          overflow: "visible",
          pointerEvents: "none",
          zIndex: -9999,
        }}
      >
        <div
          ref={cardRef}
          style={{
            width: 1200,
            height: 630,
            boxSizing: "border-box",
            background:
              "radial-gradient(circle at 20% 20%, rgba(212, 168, 67, 0.12) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(124, 140, 255, 0.12) 0%, transparent 45%), #09090D",
            color: "#F3F1EA",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            padding: "36px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(243, 241, 234, 0.08)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(243, 241, 234, 0.08)",
              paddingBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MolinoIcon size={26} color="#F3F1EA" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                MOLINO
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#D4A843",
                  background: "rgba(212, 168, 67, 0.1)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  border: "1px solid rgba(212, 168, 67, 0.2)",
                }}
              >
                MODO PAREJA · COMPARATIVA
              </span>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#9E9B91",
                letterSpacing: "0.15em",
              }}
            >
              molino.app/pareja
            </div>
          </div>

          {/* Main Comparison Section (Two profiles + Central Gauge) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 220px 1fr",
              gap: 24,
              alignItems: "center",
              margin: "16px 0",
            }}
          >
            {/* Profile A Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(243, 241, 234, 0.08)",
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#D4A843",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                MAPA 1
              </span>
              <h2
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 24,
                  color: "#F3F1EA",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                {nameA}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "6px 10px", borderRadius: 8 }}>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#9E9B91", display: "block" }}>
                    CAMINO DE VIDA
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#D4A843", fontFamily: "'JetBrains Mono', monospace" }}>
                    {lifePathA} ({archA})
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "6px 10px", borderRadius: 8 }}>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#9E9B91", display: "block" }}>
                    SOLAR & ZODÍACO
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F3F1EA", fontFamily: "'JetBrains Mono', monospace" }}>
                    {sunSymbolA} {sunSignA} · {zodiacA.emoji} {zodiacA.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Central Synergy Gauge */}
            <div
              style={{
                background: "rgba(18, 18, 24, 0.8)",
                border: "1px solid rgba(212, 168, 67, 0.3)",
                borderRadius: 18,
                padding: "18px 12px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#D4A843",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                COMPATIBILIDAD
              </span>
              <div
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 52,
                  lineHeight: 1,
                  color: "#F3F1EA",
                  margin: "6px 0 2px 0",
                }}
              >
                {score}%
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#A78BFA",
                  fontWeight: 600,
                  maxWidth: 180,
                }}
              >
                {level}
              </span>
            </div>

            {/* Profile B Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(243, 241, 234, 0.08)",
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "#60A5FA",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                MAPA 2
              </span>
              <h2
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 24,
                  color: "#F3F1EA",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                {nameB}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "6px 10px", borderRadius: 8 }}>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#9E9B91", display: "block" }}>
                    CAMINO DE VIDA
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#60A5FA", fontFamily: "'JetBrains Mono', monospace" }}>
                    {lifePathB} ({archB})
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "6px 10px", borderRadius: 8 }}>
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#9E9B91", display: "block" }}>
                    SOLAR & ZODÍACO
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F3F1EA", fontFamily: "'JetBrains Mono', monospace" }}>
                    {sunSymbolB} {sunSignB} · {zodiacB.emoji} {zodiacB.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Insights & QR Code */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 180px",
              gap: 20,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(243,241,234,0.06)",
              borderRadius: 14,
              padding: "16px 20px",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                {highlightConnections.map((c) => (
                  <div key={c.id} style={{ flex: 1 }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "#D4A843",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        display: "block",
                      }}
                    >
                      ✦ {c.title}
                    </span>
                    <p style={{ fontSize: 11, color: "#9E9B91", margin: "2px 0 0 0", lineHeight: 1.35 }}>
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: 11,
                  fontStyle: "italic",
                  color: "#C0BEB8",
                  margin: "6px 0 0 0",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: 6,
                }}
              >
                &ldquo;{dailyAdvice}&rdquo;
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    color: "#D4A843",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    display: "block",
                  }}
                >
                  Escaneá el mapa
                </span>
                <span style={{ fontSize: 8, color: "#7A7870", fontFamily: "'Inter', sans-serif" }}>
                  molino.app/pareja
                </span>
              </div>
              <QrBlock url={shareUrl} size={70} />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid rgba(243, 241, 234, 0.08)",
              paddingTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#7A7870",
            }}
          >
            <span>MOLINO · SÍNTESIS DE COMPATIBILIDAD</span>
            <span>SIN REGISTRO · 100% EN TU CLIENTE</span>
          </div>
        </div>
      </div>
    );
  }
);

CoupleShareCard.displayName = "CoupleShareCard";
export default CoupleShareCard;
