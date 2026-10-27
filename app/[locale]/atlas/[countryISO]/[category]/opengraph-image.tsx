import { type Pick2 } from "@/lib/i18n/useL";
import { getL } from "@/lib/i18n/server";
import { ImageResponse } from "next/og";
import { getCountryName, isoToFlagEmoji } from "@/lib/data/atlas-queries";

export const alt = "Categoría del Atlas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_LABELS = (L: Pick2): Record<string, string> => ({
  autos: L("Marcas de autos", "Car brands"),
  ropa: L("Marcas de ropa", "Clothing brands"),
  brand: L("Otras marcas", "Other brands"),
  city: "Ciudades",
  university: L("Universidades", "Universities"),
  artist: L("Famosos", "Famous people"),
  movie: L("Películas", "Movies"),
});

export default async function Image({ params }: { params: Promise<{ countryISO: string; category: string }> }) {
  const L = await getL();
  const { countryISO, category } = await params;
  const iso = countryISO.toUpperCase();
  const name = getCountryName(iso) || iso;
  const catLabel = CATEGORY_LABELS(L)[category] ?? category;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
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
            background: "radial-gradient(circle, rgba(157,157,157,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -120, left: -120,
            width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(97,97,97,0.10) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <span style={{ fontSize: 32 }}>M</span>
          <span style={{ color: "#0A0A0A", fontSize: 18, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Molino · Atlas</span>
        </div>

        <span style={{ fontSize: 96, lineHeight: 1 }}>{L.t(isoToFlagEmoji(iso))}</span>
        <span style={{ color: "#0A0A0A", fontSize: 60, fontWeight: 700, marginTop: 20 }}>{L.t(catLabel)}</span>
        <span style={{ color: "#0A0A0A", fontSize: 28, fontWeight: 600, marginTop: 8 }}>{L(<>de {L.t(name)}</>, <>of {L.t(name)}</>)}</span>
        <span style={{ color: "#5C5C5C", fontSize: 16, marginTop: 36 }}>{L("Explorá las afinidades simbólicas en Molino", "Explore symbolic affinities on Molino")}</span>
      </div>
    ),
    { ...size }
  );
}
