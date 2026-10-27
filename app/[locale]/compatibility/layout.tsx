import { initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { siteUrl, localeUrl, localeAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const L = await metaL(params);
  return {
    // { default, template } — ver nota en app/herramientas/layout.tsx.
    title: { default: L("Compatibilidad", "Compatibility"), template: "%s" },
    description:
      L("Descubrí la compatibilidad entre tu energía y la de países, marcas y personas usando numerología y zodiaco chino.", "Discover the compatibility between your energy and that of countries, brands and people using numerology and the Chinese zodiac."),
    alternates: localeAlternates("/compatibility", L.locale),
    openGraph: {
      type: "website",
      url: localeUrl("/compatibility", L.locale),
      title: L("Compatibilidad", "Compatibility"),
      description: L("Compatibilidad entre tu energía y la de países, marcas y personas.", "Compatibility between your energy and that of countries, brands and people."),
      images: [siteUrl("/opengraph-image")],
    },
    twitter: {
      card: "summary_large_image",
      title: L("Compatibilidad", "Compatibility"),
      description: L("Compatibilidad entre tu energía y la de países, marcas y personas.", "Compatibility between your energy and that of countries, brands and people."),
    },
  };
}

export default async function CompatibilityLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <>{children}</>;
}