import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import JournalClient from "./JournalClient";

export const metadata: Metadata = {
  title: "Journal de Autoconocimiento",
  description:
    "Espacio de registro y reflexión personal en Molino. Escribí tus vivencias y cruzalas con tus ciclos numerológicos y astrológicos. 100% privado en tu navegador.",
  alternates: {
    canonical: siteUrl("/journal"),
  },
  openGraph: {
    title: "Journal de Autoconocimiento — Molino",
    description:
      "Registrá tu estado de ánimo, decisiones y reflexiones cruzadas con tu mapa y ciclos personales. 100% privado y sin backend.",
    type: "website",
  },
};

export default function JournalPage() {
  return <JournalClient />;
}
