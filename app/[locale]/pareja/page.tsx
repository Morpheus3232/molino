import ParejaClient from "./ParejaClient";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Modo Pareja — Comparativa de Mapas", "Couple Mode — Map Comparison"],
  description:
    ["Compará dos mapas personales en Molino: descubrí sinergias, puntos de conexión, compatibilidad elemental y desafíos entre dos fechas de nacimiento.", "Compare two personal maps on Molino: discover synergies, points of connection, elemental compatibility and challenges between two dates of birth."],
  path: "/pareja",
  ogTitle: ["Modo Pareja — Comparativa de Mapas en Molino", "Couple Mode — Map Comparison on Molino"],
  ogDescription: ["Descubrí qué tan compatibles son dos mapas personales: numerología, signos solares, química elemental y zodíaco chino.", "Find out how compatible two personal maps are: numerology, sun signs, elemental chemistry and the Chinese zodiac."],
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
