import { ImageResponse } from "next/og";
import { getCountryName, isoToFlagEmoji } from "@/lib/data/atlas-queries";

export const alt = "Categoría del Atlas — Molino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_LABELS: Record<string, string> = {
  brand: "Marcas",
  city: "Ciudades",
  team: "Equipos",
  university: "Universidades",
  artist: "Artistas",
  movie: "Películas",
};

export default async function Image({ params }: { params: Promise<{ countryISO: string; category: string }> }) {
  const { countryISO, category } = await params;
  const iso = countryISO.toUpperCase();
  const name = getCountryName(iso) || iso;
  const catLabel = CATEGORY_LABELS[category] ?? category;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5F0E4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "56px 64px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: -120, right: -120,
            width: 420, height: 420, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -120, left: -120,
            width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(154,74,24,0.10) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <span style={{ fontSize: 32 }}>M</span>
          <span style={{ color: "#241F17", fontSize: 18, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Molino · Atlas</span>
        </div>

        <span style={{ fontSize: 96, lineHeight: 1 }}>{isoToFlagEmoji(iso)}</span>
        <span style={{ color: "#241F17", fontSize: 60, fontWeight: 700, marginTop: 20 }}>{catLabel}</span>
        <span style={{ color: "#9A4A18", fontSize: 28, fontWeight: 600, marginTop: 8 }}>de {name}</span>
        <span style={{ color: "#6B6252", fontSize: 16, marginTop: 36 }}>Explorá las afinidades simbólicas en Molino</span>
      </div>
    ),
    { ...size }
  );
}
