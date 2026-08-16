import { ImageResponse } from "next/og";
import { getAtlasCountries, isoToFlagEmoji } from "@/lib/data/atlas-queries";

export const alt = "Atlas de país — Molino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ countryISO: string }> }) {
  const { countryISO } = await params;
  const iso = countryISO.toUpperCase();
  const country = getAtlasCountries().find((c) => c.iso === iso);

  const flag = isoToFlagEmoji(iso);
  const name = country?.name ?? iso;

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
            background: "radial-gradient(circle, rgba(154,74,24,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -120, left: -120,
            width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,176,34,0.10) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <span style={{ fontSize: 34 }}>M</span>
          <span style={{ color: "#241F17", fontSize: 18, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Molino · Atlas</span>
        </div>

        <span style={{ fontSize: 140, lineHeight: 1 }}>{flag}</span>
        <span style={{ color: "#241F17", fontSize: 56, fontWeight: 700, marginTop: 24 }}>{name}</span>
        <span style={{ color: "#9A4A18", fontSize: 20, fontWeight: 600, marginTop: 12, textTransform: "uppercase", letterSpacing: "0.2em" }}>
          Afinidades simbólicas
        </span>

        <span style={{ color: "#B0B0A6", fontSize: 16, marginTop: 40 }}>Explorá el Atlas de {name} en Molino</span>
      </div>
    ),
    { ...size }
  );
}
