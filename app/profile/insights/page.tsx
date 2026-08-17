import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import InsightsContent from "./InsightsContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis patrones",
  description: "Tu exploración personal de patrones simbólicos. Conexiones, recomendaciones y descubrimientos según el zodíaco chino.",
  alternates: {
    canonical: siteUrl("/profile/insights"),
  },
  openGraph: {
    title: "Mis patrones — Molino",
    description: "Exploración personal basada en tradiciones culturales del zodíaco chino.",
    type: "website",
    url: siteUrl("/profile/insights"),
  },
};

export default function InsightsPage() {
  const catalog: LightweightEntity[] = SYMBOLIC_ENTITIES.map(toLightweightEntity);
  return <InsightsContent catalog={catalog} />;
}
