import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL, siteUrl } from "@/lib/seo";
import { getEntityById } from "@/lib/data/symbolic-entities";
import CompareContent from "./CompareContent";

export async function generateMetadata({ params }: { params: Promise<{ slugA: string; slugB: string }> }): Promise<Metadata> {
  const { slugA, slugB } = await params;
  const entityA = getEntityById(slugA);
  const entityB = getEntityById(slugB);
  if (!entityA || !entityB) {
    return { title: "Comparación no encontrada" };
  }

  return {
    title: `${entityA.name} vs ${entityB.name} | Afinidad Personal`,
    description: `¿Cómo se conectan ${entityA.name} y ${entityB.name} según el zodíaco chino? Comparación simbólica en Molino.`,
    alternates: {
      canonical: siteUrl(`/affinity/compare/${slugA}/${slugB}`),
    },
    openGraph: {
      title: `${entityA.name} vs ${entityB.name} — Afinidad Personal`,
      description: `Comparación simbólica entre ${entityA.name} y ${entityB.name} según el zodíaco chino.`,
      type: "website",
      url: siteUrl(`/affinity/compare/${slugA}/${slugB}`),
      // Sin `images`: hereda el opengraph-image.tsx dinámico (PNG real).
    },
    twitter: {
      card: "summary_large_image",
      title: `${entityA.name} vs ${entityB.name} | Afinidad Personal`,
      description: `Comparación simbólica según el zodíaco chino.`,
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slugA: string; slugB: string }> }) {
  const { slugA, slugB } = await params;

  if (slugA === slugB) notFound();

  const entityA = getEntityById(slugA);
  const entityB = getEntityById(slugB);

  if (!entityA || !entityB) notFound();

  return <CompareContent entityA={entityA} entityB={entityB} />;
}
