"use client";

import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { ZODIAC_SYMBOLS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import { getMoonSign, getElement } from "@/lib/engines/astrologyEngine";
import { generateQrMatrix, qrMatrixToSvgPath } from "@/lib/utils/qrcode";
import { nodeToPng, sanitizeFilenamePart, downloadPng } from "@/lib/utils/exportImage";
import styles from "./ProfileDownloadImage.module.css";

export type ExportFormat = "og" | "square";

export interface ProfileDownloadImageHandle {
  download: (format?: ExportFormat) => Promise<void>;
  renderPng: (format?: ExportFormat) => Promise<string>;
}

interface ProfileDownloadImageProps {
  profile: UserProfile;
}

function MolinoIcon({ size = 22, color = "#F3F1EA" }: { size?: number; color?: string }) {
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
      <line x1="16" y1="8.5" x2="20.5" y2="8.5" strokeWidth="0.65" />
      <line x1="16" y1="8.5" x2="18.36" y2="12.57" strokeWidth="0.65" />
      <line x1="16" y1="8.5" x2="13.64" y2="12.57" strokeWidth="0.65" />
      <line x1="16" y1="8.5" x2="11.5" y2="8.5" strokeWidth="0.65" />
      <line x1="16" y1="8.5" x2="13.64" y2="4.43" strokeWidth="0.65" />
      <line x1="16" y1="8.5" x2="18.36" y2="4.43" strokeWidth="0.65" />
      <circle cx="16" cy="8.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

function QrBlock({ size = 84 }: { size?: number }) {
  const matrix = useMemo(() => generateQrMatrix("https://molino.app"), []);
  const n = matrix.length;
  const path = useMemo(() => qrMatrixToSvgPath(matrix), [matrix]);

  return (
    <div className={styles.qrWrapper} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${n} ${n}`}
        width="100%"
        height="100%"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <path d={path} fill="#09090D" />
      </svg>
    </div>
  );
}

const ProfileDownloadImage = forwardRef<ProfileDownloadImageHandle, ProfileDownloadImageProps>(
  ({ profile }, ref) => {
    const ogRef = useRef<HTMLDivElement>(null);
    const squareRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const lifePath = safeNumber(profile.lifePath, 1);
    const archetypeData = ARCHETYPES[lifePath] || ARCHETYPES[1];
    const archetypeName = archetypeData?.name || profile.archetype || "El Caminante";
    const zodiacDisplay = getZodiacDisplay(profile.chineseZodiac);
    const sunSign = profile.sunSign || "Aries";
    const sunSymbol = ZODIAC_SYMBOLS[sunSign] || "♈";
    const sunElement = profile.sunSignInfo?.element || getElement(sunSign);
    const sunModality = profile.sunSignInfo?.modality || "";

    const moonSign = getMoonSign(profile.birthDate, profile.birthTime);
    const moonSymbol = ZODIAC_SYMBOLS[moonSign] || "🌙";
    const moonElement = getElement(moonSign);

    const chineseElement =
      typeof profile.chineseZodiacInfo?.element === "string"
        ? profile.chineseZodiacInfo.element
        : profile.element || "";

    const personalYear = profile.cycles?.personalYear;

    const birthDateFormatted = profile.birthDate
      ? new Date(profile.birthDate + "T00:00:00").toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

    const renderPng = useCallback(
      async (format: ExportFormat = "og"): Promise<string> => {
        const targetRef = format === "square" ? squareRef.current : ogRef.current;
        if (!targetRef) return "";
        // nodeToPng lazy-imports html-to-image and renders at pixelRatio 2
        // for crisp, shareable, high-DPI output.
        return nodeToPng(targetRef, format);
      },
      []
    );

    const download = useCallback(
      async (format: ExportFormat = "og") => {
        if (generating) return;
        setGenerating(true);
        try {
          const dataUrl = await renderPng(format);
          if (!dataUrl) return;

          const rawName =
            profile.name?.trim() || archetypeData?.name || profile.archetype || "personal";
          const namePart = sanitizeFilenamePart(rawName);
          const datePart =
            profile.birthDate || new Date().toISOString().split("T")[0];
          const filename = namePart
            ? `molino-mapa-${namePart}-${datePart}.png`
            : `molino-mapa-${datePart}.png`;

          downloadPng(dataUrl, filename);
        } catch (err) {
          console.error("[Molino] Error generando la imagen de alta calidad:", err);
        } finally {
          setGenerating(false);
        }
      },
      [generating, profile.birthDate, profile.name, profile.archetype, archetypeData, renderPng]
    );

    useImperativeHandle(ref, () => ({ download, renderPng }), [download, renderPng]);

    return (
      <div aria-hidden="true" className={styles.offscreenContainer}>
        {/* ═══════════════════════════════════════════════════════
            FORMAT 1: 1200 x 630 px (Open Graph / Twitter Landscape)
            ═══════════════════════════════════════════════════════ */}
        <div ref={ogRef} className={styles.cardOg}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.brand}>
              <MolinoIcon size={24} color="#F3F1EA" />
              <span className={styles.brandText}>MOLINO</span>
              <span className={styles.brandTag}>MAPA PERSONAL</span>
            </div>
            <div className={styles.headerMeta}>
              {birthDateFormatted ? `${birthDateFormatted} · ` : ""}molino.app
            </div>
          </div>

          {/* OG Body Grid */}
          <div className={styles.ogBody}>
            {/* Col 1: Hero Identity */}
            <div className={styles.panelGlass} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p className={styles.overline} style={{ color: "#D4A843" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4A843", display: "inline-block" }} />
                  NÚMERO DE VIDA {lifePath}
                </p>
                <h1 className={styles.heroTitle}>{archetypeName}</h1>
                <p className={styles.heroSubtitle}>
                  &ldquo;{archetypeData?.quote || archetypeData?.description || "Tu mapa de autoconocimiento y patrones."}&rdquo;
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 12 }}>
                <span className={styles.heroNumber}>{lifePath}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9E9B91", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Camino Central
                </span>
              </div>
            </div>

            {/* Col 2: Essential Pillars */}
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr", gap: 12 }}>
              {/* Pillar 1: Signo Solar */}
              <div className={styles.panel} style={{ borderLeft: "3px solid #EAB308" }}>
                <p className={styles.overline}>
                  <span>☀️</span> SIGNO SOLAR
                </p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "#F3F1EA" }}>
                    {sunSymbol} {sunSign}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#EAB308", fontWeight: 600 }}>
                    {sunElement} {sunModality ? `· ${sunModality}` : ""}
                  </span>
                </div>
              </div>

              {/* Pillar 2: Signo Lunar */}
              <div className={styles.panel} style={{ borderLeft: "3px solid #60A5FA" }}>
                <p className={styles.overline}>
                  <span>🌙</span> SIGNO LUNAR*
                </p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "#F3F1EA" }}>
                    {moonSymbol} {moonSign}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#60A5FA", fontWeight: 600 }}>
                    {moonElement} · Mundo interior
                  </span>
                </div>
              </div>

              {/* Pillar 3: Zodíaco Chino */}
              <div className={styles.panel} style={{ borderLeft: "3px solid #34D399" }}>
                <p className={styles.overline}>
                  <span>🐉</span> ZODÍACO CHINO
                </p>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "#F3F1EA" }}>
                    {zodiacDisplay.emoji} {zodiacDisplay.name}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#34D399", fontWeight: 600 }}>
                    Elemento {chineseElement || "Madera"}
                  </span>
                </div>
              </div>
            </div>

            {/* Col 3: QR Code & Call To Action */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
              <div className={styles.qrCard}>
                <QrBlock size={92} />
                <p className={styles.qrLabel}>molino.app</p>
                <p className={styles.qrSubtext}>Escaneá para explorar tu mapa</p>
              </div>
              {personalYear ? (
                <div className={styles.panel} style={{ padding: "10px 12px", textAlign: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#A78BFA", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Año Personal {personalYear}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span>MOLINO · SÍNTESIS DE IDENTIDAD</span>
            <span>SIN REGISTRO · PRIVADO Y ANÓNIMO</span>
          </div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#7A7870", textAlign: "center", margin: "4px 0 0 0" }}>
            * Signo lunar calculado con hora estimada — puede variar con tu hora exacta de nacimiento
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            FORMAT 2: 1080 x 1080 px (Instagram Square 1:1)
            ═══════════════════════════════════════════════════════ */}
        <div ref={squareRef} className={styles.cardSquare}>
          {/* Header */}
          <div className={styles.header} style={{ paddingBottom: 20 }}>
            <div className={styles.brand}>
              <MolinoIcon size={28} color="#F3F1EA" />
              <span className={styles.brandText} style={{ fontSize: 15 }}>MOLINO</span>
              <span className={styles.brandTag} style={{ fontSize: 11 }}>MAPA DE IDENTIDAD</span>
            </div>
            <div className={styles.headerMeta} style={{ fontSize: 12 }}>
              {birthDateFormatted ? `${birthDateFormatted} · ` : ""}molino.app
            </div>
          </div>

          {/* Hero Identity */}
          <div className={styles.squareHero}>
            <div style={{ flex: 1 }}>
              <p className={styles.overline} style={{ color: "#D4A843", fontSize: 12, marginBottom: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#D4A843", display: "inline-block" }} />
                CAMINO DE VIDA {lifePath}
              </p>
              <h1 className={styles.heroTitle} style={{ fontSize: 38 }}>
                {archetypeName}
              </h1>
              <p className={styles.heroSubtitle} style={{ fontSize: 15, marginTop: 12, maxWidth: 640 }}>
                &ldquo;{archetypeData?.quote || archetypeData?.description}&rdquo;
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 28px" }}>
              <span className={styles.heroNumber} style={{ fontSize: 80 }}>{lifePath}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9E9B91", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                VIBRACIÓN
              </span>
            </div>
          </div>

          {/* 4 Pillars Grid (2x2) */}
          <div className={styles.squareGrid}>
            {/* Card 1: Signo Solar */}
            <div className={styles.panelGlass} style={{ borderLeft: "4px solid #EAB308", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p className={styles.overline} style={{ fontSize: 11 }}>☀️ SIGNO SOLAR</p>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 26, color: "#F3F1EA", marginTop: 6 }}>
                  {sunSymbol} {sunSign}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#EAB308", fontWeight: 600, marginTop: 12 }}>
                Elemento {sunElement} {sunModality ? `(${sunModality})` : ""}
              </div>
            </div>

            {/* Card 2: Signo Lunar */}
            <div className={styles.panelGlass} style={{ borderLeft: "4px solid #60A5FA", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p className={styles.overline} style={{ fontSize: 11 }}>🌙 SIGNO LUNAR*</p>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 26, color: "#F3F1EA", marginTop: 6 }}>
                  {moonSymbol} {moonSign}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#60A5FA", fontWeight: 600, marginTop: 12 }}>
                Elemento {moonElement} · Emoción e intuición
              </div>
            </div>

            {/* Card 3: Zodíaco Chino */}
            <div className={styles.panelGlass} style={{ borderLeft: "4px solid #34D399", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p className={styles.overline} style={{ fontSize: 11 }}>🐉 ZODÍACO CHINO</p>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 26, color: "#F3F1EA", marginTop: 6 }}>
                  {zodiacDisplay.emoji} {zodiacDisplay.name}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#34D399", fontWeight: 600, marginTop: 12 }}>
                Elemento {chineseElement || "Madera"}
              </div>
            </div>

            {/* Card 4: Ciclo & Momento */}
            <div className={styles.panelGlass} style={{ borderLeft: "4px solid #A78BFA", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p className={styles.overline} style={{ fontSize: 11 }}>⚡ ENERGÍA & CICLO</p>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 26, color: "#F3F1EA", marginTop: 6 }}>
                  {personalYear ? `Año ${personalYear}` : "Ritmo Personal"}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#A78BFA", fontWeight: 600, marginTop: 12 }}>
                {profile.cycles?.personalMonth ? `Mes personal ${profile.cycles.personalMonth} · ` : ""}Sincronicidad
              </div>
            </div>
          </div>

          {/* Bottom Card with QR Code */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 18, color: "#F3F1EA", margin: "0 0 4px 0" }}>
                Descubrí tu mapa en molino.app
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#9E9B91", margin: 0 }}>
                Astrología occidental, numerología y zodíaco chino integrados.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#D4A843", letterSpacing: "0.15em", textTransform: "uppercase", display: "block" }}>
                  Escaneá el código
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#7A7870" }}>
                  100% en cliente
                </span>
              </div>
              <QrBlock size={76} />
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer} style={{ paddingTop: 16 }}>
            <span>MOLINO · SISTEMA DE AUTOCONOCIMIENTO</span>
            <span>SIN REGISTRO · SIN COOKIES</span>
          </div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#7A7870", textAlign: "center", margin: "4px 0 0 0" }}>
            * Signo lunar calculado con hora estimada — puede variar con tu hora exacta de nacimiento
          </p>
        </div>
      </div>
    );
  }
);

ProfileDownloadImage.displayName = "ProfileDownloadImage";
export default ProfileDownloadImage;
