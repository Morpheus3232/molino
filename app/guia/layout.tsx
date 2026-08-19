import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Guía — Molino",
    template: "%s | Guía | Molino",
  },
  description: "Artículos y guías sobre numerología, astrología, zodiaco chino y autoconocimiento simbólico.",
  openGraph: {
    title: "Guía — Molino",
    description: "Artículos y guías sobre sistemas simbólicos de autoconocimiento.",
    type: "website",
  },
};

export default function GuiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
