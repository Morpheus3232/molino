import { ImageResponse } from "next/og";
import { getEntityById, getPrimaryEvent } from "@/lib/data/symbolic-entities";
import { calculateAnimalFromDate } from "@/lib/engines/chineseZodiacEngine";
import { getRelation, type Animal } from "@/lib/data/animalRelations";

export const runtime = "edge";

export const alt = "Mi afinidad simbólica — Molino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { slug } = await params;
  const entity = getEntityById(slug);

  if (!entity) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#6B7280", fontSize: 24, fontFamily: "sans-serif" }}>Molino</span>
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
          background: "linear-gradient(160deg, #0A0A0A 0%, #141414 40%, #1A1A1A 100%)",
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
          background: "radial-gradient(circle, rgba(196,154,42,0.06) 0%, transparent 70%)",
        }} />

        {/* Top bar — Logo + "MI AFINIDAD SIMBÓLICA" */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "#1A1A1A", border: "1px solid #333",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#C49A2A", fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif" }}>M</span>
            </div>
            <span style={{ color: "#9CA3AF", fontSize: 15, fontWeight: 500 }}>Molino</span>
          </div>
          <span style={{
            color: "#C49A2A", fontSize: 12, fontWeight: 600,
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
            <span style={{ color: "#F5F5F5", fontSize: 32, fontWeight: 700, fontFamily: "Georgia, serif" }}>
              {entity.name}
            </span>
            <span style={{ color: "#C49A2A", fontSize: 20, fontWeight: 600 }}>
              {entityAnimal}
            </span>
          </div>

          {/* Center — Arrow + CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#C49A2A", fontSize: 48 }}>→</span>
            <span style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center", maxWidth: 120, lineHeight: 1.3 }}>
              ¿Cuál es tu animal?
            </span>
          </div>

          {/* User side — question mark */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 96 }}>🪞</span>
            <span style={{ color: "#F5F5F5", fontSize: 32, fontWeight: 700, fontFamily: "Georgia, serif" }}>
              ?
            </span>
            <span style={{ color: "#9CA3AF", fontSize: 18 }}>
              Vos
            </span>
          </div>
        </div>

        {/* Bottom — CTA + disclaimer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 2, background: "linear-gradient(90deg, #C49A2A, #D4A843)", borderRadius: 1 }} />
            <span style={{ color: "#6B7280", fontSize: 14 }}>
              Descubrí tu afinidad con {entity.name} en
            </span>
            <span style={{ color: "#F5F5F5", fontSize: 14, fontWeight: 600 }}>Molino</span>
          </div>
          <span style={{ color: "#4B5563", fontSize: 12 }}>
            Según el zodíaco chino
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
