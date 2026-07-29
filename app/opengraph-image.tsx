import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Molino — Mapa Personal de Autoconocimiento";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <svg
          viewBox="0 0 64 64"
          style={{ width: 120, height: 120, marginBottom: 24 }}
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 58 L16 26 L48 26 L44 58 Z" />
          <path d="M14 26 L32 12 L50 26 Z" />
          <path d="M28 58 L28 44 Q28 40 32 40 Q36 40 36 44 L36 58" />
          <circle cx="32" cy="33" r="2.5" />
          <line x1="0" y1="13" x2="64" y2="13" strokeWidth="2" />
          <line x1="32" y1="-8" x2="32" y2="32" strokeWidth="2" />
          <line x1="0" y1="8" x2="64" y2="8" strokeWidth="1" />
          <line x1="0" y1="18" x2="64" y2="18" strokeWidth="1" />
          <line x1="25" y1="-8" x2="25" y2="32" strokeWidth="1" />
          <line x1="39" y1="-8" x2="39" y2="32" strokeWidth="1" />
        </svg>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#1A1A1A",
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          MOLINO
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "#666666",
            letterSpacing: "0.15em",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          INTELIGENCIA PERSONAL
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
