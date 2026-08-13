import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import ParejaClient from "./ParejaClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Modo Pareja — Comparativa de Mapas",
  description:
    "Compará dos mapas personales en Molino: descubrí sinergias, puntos de conexión, compatibilidad elemental y desafíos entre dos fechas de nacimiento.",
  alternates: {
    canonical: siteUrl("/pareja"),
  },
  openGraph: {
    title: "Modo Pareja — Comparativa de Mapas en Molino",
    description:
      "Descubrí qué tan compatibles son dos mapas personales: numerología, signos solares, química elemental y zodíaco chino.",
    type: "website",
  },
};

export default function ParejaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-24 pb-24 text-center">
          <div className="animate-pulse font-mono text-xs text-muted">
            Cargando comparativa...
          </div>
        </div>
      }
    >
      <ParejaClient />
    </Suspense>
  );
}
