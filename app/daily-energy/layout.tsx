import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Energía Diaria",
  description:
    "Tu energía de hoy según numerología, astrología y zodíaco chino: tema del día, fortalezas, precauciones y fase lunar.",
  alternates: {
    canonical: siteUrl("/daily-energy"),
  },
  openGraph: {
    title: "Energía Diaria — Molino",
    description: "Tu energía de hoy según numerología, astrología y zodíaco chino.",
    type: "website",
    url: siteUrl("/daily-energy"),
  },
};

export default function DailyEnergyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
