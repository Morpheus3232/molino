import SociosClient from "./SociosClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Modo Socios — Afinidad para Sociedades y Equipos",
  description:
    "Compará dos mapas personales en Molino para ver la afinidad de trabajo entre socios, empleador y empleado, o cualquier par de personas armando un proyecto juntas.",
  path: "/socios",
  ogTitle: "Modo Socios — Afinidad de Trabajo en Molino",
  ogDescription: "Descubrí qué tan compatibles son dos personas trabajando juntas: numerología, signos solares, química elemental y zodíaco chino.",
});

export default async function SociosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  return <SociosClient params={params} />;
}
