import { ImageResponse } from "next/og";
import { ENTITIES } from "@/lib/data/entities";

export const alt = "Análisis de compatibilidad — Molino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ entity: string }> }) {
  const { entity: entityId } = await params;
  const entity = ENTITIES.find(e => e.id === entityId);

  if (!entity) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: "#0A0A0C", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#B0B0A6", fontSize: 24 }}>Molino</span>
      </div>,
      { ...size }
    );
  }

  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(160deg, #0A0A0C 0%, #16161A 100%)",
      display: "flex", flexDirection: "column",
      padding: "56px 64px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,140,255,0.12) 0%, transparent 70%)",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
        <svg viewBox="0 0 100 100" style={{ width: 30, height: 30 }} fill="none">
          <path d="M34,96 L66,96 L56,46 L44,46 Z" fill="#F3F1EA" />
          <path d="M44,46 Q50,34 56,46 Z" fill="#F3F1EA" />
          <g transform="translate(50 38) rotate(45)"><path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#F3F1EA" /></g>
          <g transform="translate(50 38) rotate(135)"><path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#F3F1EA" /></g>
          <g transform="translate(50 38) rotate(225)"><path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#F3F1EA" /></g>
          <g transform="translate(50 38) rotate(315)"><path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#F3F1EA" /></g>
          <circle cx="50" cy="38" r="3.2" fill="#F3F1EA" />
        </svg>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ color: "#F3F1EA", fontSize: 20, fontWeight: 600, fontFamily: "sans-serif" }}>Molino</span>
          <span style={{ color: "#7C8CFF", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.25em" }}>
            Compatibilidad
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 48, flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 72 }}>{entity.emoji}</span>
          <span style={{ color: "#F3F1EA", fontSize: 36, fontWeight: 700, fontFamily: "sans-serif" }}>
            {entity.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#7C8CFF", fontSize: 40 }}>→</span>
          <span style={{ color: "#B0B0A6", fontSize: 13, textAlign: "center", maxWidth: 140, lineHeight: 1.4 }}>
            ¿Qué tan compatible sos?
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#16161A", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 32, color: "#F3F1EA" }}>?</span>
          </div>
          <span style={{ color: "#B0B0A6", fontSize: 20, fontWeight: 500 }}>Vos</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 2, background: "#7C8CFF", borderRadius: 1 }} />
          <span style={{ color: "#B0B0A6", fontSize: 14 }}>
            Análisis multi-factor en
          </span>
          <span style={{ color: "#F3F1EA", fontSize: 14, fontWeight: 600 }}>Molino</span>
        </div>
        <span style={{ color: "#B0B0A6", fontSize: 12 }}>
          Numerología · Astrología · Zodiaco Chino
        </span>
      </div>
    </div>,
    { ...size }
  );
}
