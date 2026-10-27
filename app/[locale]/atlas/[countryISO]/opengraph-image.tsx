import { getL } from "@/lib/i18n/server";
import { ImageResponse } from "next/og";
import { getAtlasCountries, isoToFlagEmoji } from "@/lib/data/atlas-queries";

export const alt = "Atlas de país";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ countryISO: string }> }) {
  const L = await getL();
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
            background: "radial-gradient(circle, rgba(97,97,97,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -120, left: -120,
            width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(188,188,188,0.10) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>{L(<>
          <span style={{ fontSize: 34 }}>M</span>
          <span style={{ color: "#0A0A0A", fontSize: 18, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Molino · Atlas</span>
        </>, <><span style={{ fontSize: 34 }}>M</span><span style={{ color: "#0A0A0A", fontSize: 18, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>Molino · Atlas</span></>)}</div>

        <span style={{ fontSize: 140, lineHeight: 1 }}>{L.t(flag)}</span>
        <span style={{ color: "#0A0A0A", fontSize: 56, fontWeight: 700, marginTop: 24 }}>{L.t(name)}</span>
        <span style={{ color: "#0A0A0A", fontSize: 20, fontWeight: 600, marginTop: 12, textTransform: "uppercase", letterSpacing: "0.2em" }}>{L("Afinidades simbólicas", "Symbolic affinities")}</span>

        <span style={{ color: "#5C5C5C", fontSize: 16, marginTop: 40 }}>{L(<>Explorá el Atlas de {L.t(name)} en Molino</>, <>Explore the Atlas of {L.t(name)} on Molino</>)}</span>
      </div>
    ),
    { ...size }
  );
}
