import { ImageResponse } from "next/og";
import { getBlogPostBySlug } from "@/lib/data/blog-content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Artículo de Molino";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 88px",
          background: "linear-gradient(160deg, #0A0A0C 0%, #16161A 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -140,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,140,255,0.20) 0%, transparent 70%)",
          }}
        />
        <div style={{ fontSize: 26, letterSpacing: "0.3em", color: "#7C8CFF", fontWeight: 700, marginBottom: 28 }}>
          {post?.category?.toUpperCase() ?? "MOLINO"}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#F3F1EA",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            maxWidth: 900,
            textTransform: "uppercase",
          }}
        >
          {post?.title ?? "Artículo de Molino"}
        </div>
        <div style={{ fontSize: 24, color: "#B0B0A6", letterSpacing: "0.15em", marginTop: 40 }}>
          MOLINO — AUTOCONOCIMIENTO
        </div>
      </div>
    ),
    { ...size },
  );
}
