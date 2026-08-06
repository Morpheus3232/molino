import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import AcademyContent from "./AcademyContent";

export const metadata: Metadata = {
  title: "La Academia | Molino",
  description: "La historia de las tradiciones simbólicas: desde Babilonia y Pitágoras hasta el zodíaco chino moderno.",
  alternates: {
    canonical: siteUrl("/academy"),
  },
  openGraph: {
    title: "La Academia — Molino",
    description: "La historia de las tradiciones simbólicas que alimentan tu mapa personal.",
    type: "website",
    url: siteUrl("/academy"),
  },
};

export default function AcademyPage() {
  return <AcademyContent />;
}
