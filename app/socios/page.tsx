import SociosClient from "./SociosClient";
import { Suspense } from "react";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Modo Socios — Afinidad para Sociedades y Equipos",
  description:
    "Compará dos mapas personales en Molino para ver la afinidad de trabajo entre socios, empleador y empleado, o cualquier par de personas armando un proyecto juntas.",
  path: "/socios",
  ogTitle: "Modo Socios — Afinidad de Trabajo en Molino",
  ogDescription: "Descubrí qué tan compatibles son dos personas trabajando juntas: numerología, signos solares, química elemental y zodíaco chino.",
});

export default function SociosPage() {
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
      <SociosClient />
    </Suspense>
  );
}
