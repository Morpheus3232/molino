import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import HoyClient from "@/components/hoy/HoyClient";

export const metadata: Metadata = {
  title: "Hoy",
  description:
    "Tu mapa personal aplicado al día de hoy: energía, timing, convergencia y una decisión clara para actuar.",
  alternates: {
    canonical: siteUrl("/hoy"),
  },
  openGraph: {
    title: "Hoy — Molino",
    description: "Tu energía, timing y convergencia de hoy en una sola lectura.",
    type: "website",
    url: siteUrl("/hoy"),
  },
};

export default function HoyPage() {
  return <HoyClient />;
}
