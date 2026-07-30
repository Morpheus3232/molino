import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import MethodContent from "./MethodContent";

export const metadata: Metadata = {
  title: "Method — Cómo funciona Molino",
  description: "Transparencia total: cómo se calculan los números, las limitaciones de cada sistema simbólico y las fuentes en las que se basa Molino.",
  alternates: {
    canonical: siteUrl("/method"),
  },
  openGraph: {
    title: "Method — Molino",
    description: "Transparencia total: cómo se calculan los números, las limitaciones de cada sistema y las fuentes en las que se basa.",
    type: "article",
    url: siteUrl("/method"),
  },
};

export default function MethodPage() {
  return <MethodContent />;
}
