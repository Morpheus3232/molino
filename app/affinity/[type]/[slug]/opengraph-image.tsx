import { ImageResponse } from "next/og";
import { getEntityById, getPrimaryEvent } from "@/lib/data/symbolic-entities";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { getRelation, type Animal } from "@/lib/data/animalRelations";

export const alt = "Mi afinidad simbólica — Molino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { slug } = await params;
  const entity = getEntityById(slug);

  if (!entity) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", background: "#F5F0E4", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#B0B0A6", fontSize: 24, fontFamily: "sans-serif" }}>Molino</span>
        </div>
      ),
      { ...size }
    );
  }

  const primaryEvent = getPrimaryEvent(entity);
  const { animal: entityAnimal } = primaryEvent
    ? calculateAnimalFromDate(primaryEvent.date, primaryEvent.year)
    : { animal: "ícono" };

  // Get relationship info for a generic "Descubrí" message
  const relationLabel = "afinidad simbólica";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5F0E4",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle accent glow */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(154,74,24,0.12) 0%, transparent 70%)",
        }} />

        {/* Top bar — Logo + "MI AFINIDAD SIMBÓLICA" */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg viewBox="0 0 100 100" style={{ width: 34, height: 34 }} fill="none">
              <path d="M34,96 L66,96 L56,46 L44,46 Z" fill="#241F17" />
              <path d="M44,46 Q50,34 56,46 Z" fill="#241F17" />
              <g transform="translate(50 38) rotate(45)"><path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#241F17" /></g>
              <g transform="translate(50 38) rotate(135)"><path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#241F17" /></g>
              <g transform="translate(50 38) rotate(225)"><path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#241F17" /></g>
              <g transform="translate(50 38) rotate(315)"><path d="M0,0 L-3,-5 L-4,-11 L-2,-20 L0,-26 L2,-20 L4,-11 L3,-5 Z" fill="#241F17" /></g>
              <circle cx="50" cy="38" r="3.2" fill="#241F17" />
            </svg>
            <span style={{ color: "#B0B0A6", fontSize: 15, fontWeight: 500 }}>Molino</span>
          </div>
          <span style={{
            color: "#9A4A18", fontSize: 12, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.2em",
          }}>
            Afinidad simbólica
          </span>
        </div>

        {/* Main content — Entity info + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, marginBottom: 40, flex: 1 }}>

          {/* Entity side */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 96 }}>{entity.emoji}</span>
            <span style={{ color: "#241F17", fontSize: 32, fontWeight: 700, fontFamily: "sans-serif" }}>
              {entity.name}
            </span>
            <span style={{ color: "#9A4A18", fontSize: 20, fontWeight: 600 }}>
              {entityAnimal}
            </span>
          </div>

          {/* Center — Arrow + CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#9A4A18", fontSize: 48 }}>→</span>
            <span style={{ color: "#B0B0A6", fontSize: 14, textAlign: "center", maxWidth: 120, lineHeight: 1.3 }}>
              ¿Cuál es tu animal?
            </span>
          </div>

          {/* User side — question mark */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 96 }}>🪞</span>
            <span style={{ color: "#241F17", fontSize: 32, fontWeight: 700, fontFamily: "sans-serif" }}>
              ?
            </span>
            <span style={{ color: "#B0B0A6", fontSize: 18 }}>
              Vos
            </span>
          </div>
        </div>

        {/* Bottom — CTA + disclaimer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 2, background: "#9A4A18", borderRadius: 1 }} />
            <span style={{ color: "#B0B0A6", fontSize: 14 }}>
              Descubrí tu afinidad con {entity.name} en
            </span>
            <span style={{ color: "#241F17", fontSize: 14, fontWeight: 600 }}>Molino</span>
          </div>
          <span style={{ color: "#B0B0A6", fontSize: 12 }}>
            Según el zodíaco chino
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
