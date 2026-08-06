import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import PrivacidadContent from "./PrivacidadContent";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Molino. Cómo recopilamos, usamos y protegemos tu información.",
  alternates: {
    canonical: siteUrl("/privacidad"),
  },
  openGraph: {
    title: "Política de Privacidad — Molino",
    description: "Política de privacidad de Molino.",
    type: "article",
    url: siteUrl("/privacidad"),
    images: [siteUrl("/opengraph-image")],
  },
};

export default function PrivacidadPage() {
  return <PrivacidadContent />;
}
