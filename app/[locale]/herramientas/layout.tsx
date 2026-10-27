import { initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { siteUrl, localeUrl, localeAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const L = await metaL(params);
  return {
    // { default, template } (no un string plano) es lo que hace que el
    // template "%s" del root layout siga aplicando a las rutas
    // hijas — un `title` string en un layout intermedio corta la cadena
    // de herencia del template para todo lo que está debajo, sin importar
    // la profundidad (ver REVIEW note histórica en app/layout.tsx).
    title: { default: L("Herramientas", "Tools"), template: "%s" },
    description:
      L("Calculá tu Camino de Vida, signo solar, animal del zodiaco chino y compatibilidad. Herramientas abiertas, sin registro ni cookies.", "Calculate your Life Path, sun sign, Chinese zodiac animal and compatibility. Open tools, no sign-up and no cookies."),
    alternates: localeAlternates("/herramientas", L.locale),
    openGraph: {
      type: "website",
      url: localeUrl("/herramientas", L.locale),
      title: L("Herramientas", "Tools"),
      description: L("Calculá tu Camino de Vida, signo solar, zodiaco chino y compatibilidad.", "Calculate your Life Path, sun sign, Chinese zodiac and compatibility."),
      images: [siteUrl("/opengraph-image")],
    },
    twitter: {
      card: "summary_large_image",
      title: L("Herramientas", "Tools"),
      description: L("Calculadora de Camino de Vida, signo solar y zodiaco chino.", "Life Path, sun sign and Chinese zodiac calculator."),
    },
  };
}

export default async function HerramientasLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <>{children}</>;
}