import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-dynamic";

// Leído una sola vez a nivel de módulo (no depende de datos del request) y
// reusado entre invocaciones del mismo runtime — evita tanto un fetch de red
// (que puede fallar/tardar) como releer el archivo en cada request. Mismo
// patrón que recomienda la doc de ImageResponse ("Predictable values").
// TTF local en vez de descargarlo de Google Fonts en cada render: Satori solo
// soporta ttf/otf/woff (no woff2), y ttf/otf parsean más rápido que woff.
const spaceGrotesk = readFile(join(process.cwd(), "public/fonts/SpaceGrotesk.ttf"));

// Imagen OG dinámica para mapas compartidos. Solo recibe lifePath (1-33),
// archetype y name (opcional) — nunca fecha de nacimiento ni ningún otro
// dato sensible, consistente con PublicShareData en lib/utils/profileShare.ts.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lifePathRaw = searchParams.get("l") || "";
  const lifePath = /^\d{1,2}$/.test(lifePathRaw) ? lifePathRaw : "";
  const name = (searchParams.get("n") || "").slice(0, 40);
  const archetype = (searchParams.get("a") || "").slice(0, 60);

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
          fontFamily: "Space Grotesk",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(154,74,24,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.3em",
            color: "#9A4A18",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {name ? `El Camino de Vida de ${name}` : "Camino de Vida"}
        </div>
        <div style={{ fontSize: 220, fontWeight: 800, color: "#241F17", lineHeight: 1, display: "flex" }}>
          {lifePath || "?"}
        </div>
        {archetype ? (
          <div style={{ fontSize: 28, fontWeight: 500, color: "#6B6252", marginTop: 16 }}>{archetype}</div>
        ) : null}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#241F17",
            letterSpacing: "0.2em",
            marginTop: 40,
          }}
        >
          MOLINO.APP
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Space Grotesk", data: await spaceGrotesk, style: "normal" }],
      // La imagen es una función pura de (l, n, a) en la query string — no
      // cambia una vez generada para un share puntual, así que puede vivir
      // en el CDN/browser cache el año entero. Reduce carga del servidor y
      // acelera el LCP del preview en redes sociales (no vuelven a pedirla).
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
