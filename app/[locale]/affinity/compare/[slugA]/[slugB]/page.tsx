import { initLocale, metaL } from "@/lib/i18n/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { localeAlternates, localeUrl } from "@/lib/seo";
import { getEntityById } from "@/lib/data/symbolic-entities";
import CompareContent from "./CompareContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slugA: string; slugB: string }> }): Promise<Metadata> {
  const L = await metaL(params);
  const { slugA, slugB } = await params;
  const entityA = getEntityById(slugA);
  const entityB = getEntityById(slugB);
  if (!entityA || !entityB) {
    return { title: L("Comparación no encontrada", "Comparison not found") };
  }
  const a = L.t(entityA.name);
  const b = L.t(entityB.name);
  const path = `/affinity/compare/${slugA}/${slugB}`;
  const title = L(`${a} vs ${b} | Afinidad Personal`, `${a} vs ${b} | Personal Affinity`);

  return {
    title,
    description: L(
      `¿Cómo se conectan ${a} y ${b} según el zodíaco chino? Comparación simbólica en Molino.`,
      `How are ${a} and ${b} connected according to the Chinese zodiac? A symbolic comparison on Molino.`,
    ),
    alternates: localeAlternates(path, L.locale),
    openGraph: {
      title: L(`${a} vs ${b} — Afinidad Personal`, `${a} vs ${b} — Personal Affinity`),
      description: L(
        `Comparación simbólica entre ${a} y ${b} según el zodíaco chino.`,
        `Symbolic comparison between ${a} and ${b} according to the Chinese zodiac.`,
      ),
      type: "website",
      url: localeUrl(path, L.locale),
      // Sin `images`: hereda el opengraph-image.tsx dinámico (PNG real).
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: L(`Comparación simbólica según el zodíaco chino.`, `Symbolic comparison according to the Chinese zodiac.`),
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slugA: string; slugB: string }> }) {
  await initLocale(params);
  const { slugA, slugB } = await params;

  if (slugA === slugB) notFound();

  const entityA = getEntityById(slugA);
  const entityB = getEntityById(slugB);

  if (!entityA || !entityB) notFound();

  return <CompareContent entityA={entityA} entityB={entityB} />;
}
