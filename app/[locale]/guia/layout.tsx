import { initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const L = await metaL(params);
  return {
    title: {
      default: L("Guía", "Guide"),
      template: L("%s | Guía", "%s | Guide"),
    },
    description: L("Artículos y guías sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.", "Articles and guides on numerology, astrology, the Chinese zodiac and symbolic self-knowledge."),
    openGraph: {
      title: L("Guía", "Guide"),
      description: L("Artículos y guías sobre sistemas simbólicos de autoconocimiento.", "Articles and guides on symbolic self-knowledge systems."),
      type: "website",
    },
  };
}

export default async function GuiaLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <>{children}</>;
}
