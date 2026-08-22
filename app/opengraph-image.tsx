import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mapa Personal de Autoconocimiento";

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
          background: "#F5F0E4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(154,74,24,0.18) 0%, transparent 70%)",
        }} />
        <svg
          viewBox="0 0 100 100"
          style={{ width: 140, height: 140, marginBottom: 24 }}
          fill="none"
        >
          <path d="M34,96 L66,96 L56,46 L44,46 Z" fill="#241F17" />
          <path d="M44,46 Q50,34 56,46 Z" fill="#241F17" />
          <g transform="translate(50 38) rotate(45)">
            <path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#241F17" />
          </g>
          <g transform="translate(50 38) rotate(135)">
            <path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#241F17" />
          </g>
          <g transform="translate(50 38) rotate(225)">
            <path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#241F17" />
          </g>
          <g transform="translate(50 38) rotate(315)">
            <path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#241F17" />
          </g>
          <circle cx="50" cy="38" r="3.2" fill="#241F17" />
        </svg>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#241F17",
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
            color: "#6B6252",
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
