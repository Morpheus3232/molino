import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import InsightsContent from "./InsightsContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis patrones | Molino",
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
  return <InsightsContent />;
}
