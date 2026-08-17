import ParejaClient from "./ParejaClient";
import { Suspense } from "react";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Modo Pareja — Comparativa de Mapas",
  description:
    "Compará dos mapas personales en Molino: descubrí sinergias, puntos de conexión, compatibilidad elemental y desafíos entre dos fechas de nacimiento.",
  path: "/pareja",
  ogTitle: "Modo Pareja — Comparativa de Mapas en Molino",
  ogDescription: "Descubrí qué tan compatibles son dos mapas personales: numerología, signos solares, química elemental y zodíaco chino.",
});

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
