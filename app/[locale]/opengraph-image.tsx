import { metaL } from "@/lib/i18n/server";
import { ImageResponse } from "next/og";
import LogoMark from "@/components/ui/LogoMark";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Neutro: el mismo archivo sirve las dos versiones del idioma.
export const alt = "Molino";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const L = await metaL(params);
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
          fontFamily: "sans-serif",
        }}
      >
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(97,97,97,0.18) 0%, transparent 70%)",
        }} />
        <LogoMark color="#0A0A0A" paper="#FFFFFF" style={{ width: 140, height: 140, marginBottom: 24 }} />
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#0A0A0A",
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
            color: "#5C5C5C",
            letterSpacing: "0.15em",
            marginTop: 8,
            textAlign: "center",
          }}
        >{L("INTELIGENCIA PERSONAL", "PERSONAL INTELLIGENCE")}</div>
      </div>
    ),
    {
      ...size,
    },
  );
}
