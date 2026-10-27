import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Guía",
    template: "%s | Guía",
  },
  description: "Artículos y guías sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.",
  openGraph: {
    title: "Guía",
    description: "Artículos y guías sobre sistemas simbólicos de autoconocimiento.",
    type: "website",
  },
};

export default async function GuiaLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <>{children}</>;
}
