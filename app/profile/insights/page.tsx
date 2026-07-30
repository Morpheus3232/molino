import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import InsightsContent from "./InsightsContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi Inteligencia Personal",
  description: "Tu feed personalizado de exploración simbólica. Patrones, recomendaciones y descubrimientos según el zodíaco chino.",
  alternates: {
    canonical: siteUrl("/profile/insights"),
  },
  openGraph: {
    title: "Mi Inteligencia Personal — Molino",
    description: "Exploración personal basada en tradiciones culturales del zodíaco chino.",
    type: "website",
    url: siteUrl("/profile/insights"),
  },
};

export default function InsightsPage() {
  return <InsightsContent />;
}
