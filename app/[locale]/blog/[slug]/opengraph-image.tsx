import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/data/blog-content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Artículo de Molino";

// Se genera en el build, una por artículo: la foto de portada vive en
// public/blog/ y en el build está disponible en disco (en una función
// serverless de Vercel no está garantizado).
export const dynamicParams = false;
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

async function coverDataUri(imagePath: string): Promise<string | null> {
  if (!/\.(jpe?g|png)$/i.test(imagePath)) return null; // Satori no rasteriza SVG de portada
  try {
    const buf = await readFile(join(process.cwd(), "public", imagePath));
    const mime = imagePath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const cover = post ? await coverDataUri(post.image) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          position: "relative",
          background: "#0A0A0A",
          fontFamily: "sans-serif",
        }}
      >
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
          />
        )}
        {/* Velo para que el título se lea sobre cualquier foto */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.3) 45%, rgba(10,10,10,0.9) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: 1200,
            height: 630,
            padding: "64px 80px",
          }}
        >
          <div style={{ fontSize: 24, letterSpacing: "0.3em", color: "#F4F4F4", fontWeight: 700, marginBottom: 22 }}>
            {post?.category?.toUpperCase() ?? "MOLINO"}
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {post?.title ?? "Artículo de Molino"}
          </div>
          <div style={{ fontSize: 22, color: "#CFCFCF", letterSpacing: "0.15em", marginTop: 32 }}>
            MOLINO — AUTOCONOCIMIENTO
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
