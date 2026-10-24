import ParejaClient from "./ParejaClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Modo Pareja — Comparativa de Mapas",
  description:
    "Compará dos mapas personales en Molino: descubrí sinergias, puntos de conexión, compatibilidad elemental y desafíos entre dos fechas de nacimiento.",
  path: "/pareja",
  ogTitle: "Modo Pareja — Comparativa de Mapas en Molino",
  ogDescription: "Descubrí qué tan compatibles son dos mapas personales: numerología, signos solares, química elemental y zodíaco chino.",
});

export default async function ParejaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  return <ParejaClient params={params} />;
}
