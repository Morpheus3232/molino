import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import TerminosContent from "./TerminosContent";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de Molino.",
  alternates: {
    canonical: siteUrl("/terminos"),
  },
  openGraph: {
    title: "Términos y Condiciones — Molino",
    description: "Términos y condiciones de uso de Molino.",
    type: "article",
    url: siteUrl("/terminos"),
    images: [siteUrl("/opengraph-image")],
  },
};

export default function TerminosPage() {
  return <TerminosContent />;
}
