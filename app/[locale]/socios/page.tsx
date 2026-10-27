import { initLocale } from "@/lib/i18n/server";
import SociosClient from "./SociosClient";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Modo Socios — Afinidad para Sociedades y Equipos", "Partners Mode — Affinity for Partnerships and Teams"],
  description:
    ["Compará dos mapas personales en Molino para ver la afinidad de trabajo entre socios, empleador y empleado, o cualquier par de personas armando un proyecto juntas.", "Compare two personal maps on Molino to see the working affinity between business partners, employer and employee, or any two people building a project together."],
  path: "/socios",
  ogTitle: ["Modo Socios — Afinidad de Trabajo en Molino", "Partners Mode — Working Affinity on Molino"],
  ogDescription: ["Descubrí qué tan compatibles son dos personas trabajando juntas: numerología, signos solares, química elemental y zodíaco chino.", "Find out how compatible two people are working together: numerology, sun signs, elemental chemistry and the Chinese zodiac."],
});

export default async function SociosPage({
  searchParams, params: routeParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
} & { params: Promise<{ locale: string }> }) {
  await initLocale(routeParams);
  const raw = await searchParams;
  const params = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  return <SociosClient params={params} />;
}
