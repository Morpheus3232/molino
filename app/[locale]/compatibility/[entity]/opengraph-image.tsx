import { metaL } from "@/lib/i18n/server";
import { ImageResponse } from "next/og";
import LogoMark from "@/components/ui/LogoMark";
import { ENTITIES } from "@/lib/data/entities";

// Neutro: el mismo archivo sirve las dos versiones del idioma.
export const alt = "Molino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ entity: string }> }) {
  const L = await metaL(params);
  const { entity: entityId } = await params;
  const entity = ENTITIES.find(e => e.id === entityId);

  if (!entity) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#5C5C5C", fontSize: 24 }}>Molino</span>
      </div>,
      { ...size }
    );
  }

  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%",
      background: "#FFFFFF",
      display: "flex", flexDirection: "column",
      padding: "56px 64px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(97,97,97,0.12) 0%, transparent 70%)",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
        <LogoMark color="#0A0A0A" paper="#FFFFFF" style={{ width: 30, height: 30 }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>{L(<>
          <span style={{ color: "#0A0A0A", fontSize: 20, fontWeight: 600, fontFamily: "sans-serif" }}>Molino</span>
          <span style={{ color: "#0A0A0A", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.25em" }}>
            Compatibilidad
          </span>
        </>, <><span style={{ color: "#0A0A0A", fontSize: 20, fontWeight: 600, fontFamily: "sans-serif" }}>Molino</span><span style={{ color: "#0A0A0A", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.25em" }}>Compatibility</span></>).props.children}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 48, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 72 }}>{L.t(entity.emoji)}</span>
          <span style={{ color: "#0A0A0A", fontSize: 36, fontWeight: 700, fontFamily: "sans-serif" }}>
            {L.t(entity.name)}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>{L(<>
          <span style={{ color: "#0A0A0A", fontSize: 40 }}>→</span>
          <span style={{ color: "#5C5C5C", fontSize: 13, textAlign: "center", maxWidth: 140, lineHeight: 1.4 }}>
            ¿Qué tan compatible sos?
          </span>
        </>, <><span style={{ color: "#0A0A0A", fontSize: 40 }}>→</span><span style={{ color: "#5C5C5C", fontSize: 13, textAlign: "center", maxWidth: 140, lineHeight: 1.4 }}>How compatible are you?</span></>).props.children}</div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#0A0A0A", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 32, color: "#FFFFFF" }}>?</span>
          </div>
          <span style={{ color: "#5C5C5C", fontSize: 20, fontWeight: 500 }}>{L("Vos", "You")}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 2, background: "#0A0A0A", borderRadius: 1 }} />
          <span style={{ color: "#5C5C5C", fontSize: 14 }}>{L("Análisis multi-factor en", "Multi-factor analysis on")}</span>
          <span style={{ color: "#0A0A0A", fontSize: 14, fontWeight: 600 }}>Molino</span>
        </div>
        <span style={{ color: "#5C5C5C", fontSize: 12 }}>{L("Numerología · Astrología · Zodiaco Chino", "Numerology · Astrology · Chinese Zodiac")}</span>
      </div>
    </div>,
    { ...size }
  );
}
