import JournalClient from "./JournalClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Journal de Autoconocimiento",
  description:
    "Espacio de registro y reflexión personal en Molino. Escribí tus vivencias y cruzalas con tus ciclos numerológicos y astrológicos. 100% privado en tu navegador.",
  path: "/journal",
  ogTitle: "Journal de Autoconocimiento — Molino",
  ogDescription: "Registrá tu estado de ánimo, decisiones y reflexiones cruzadas con tu mapa y ciclos personales. 100% privado y sin backend.",
});

export default function JournalPage() {
  return <JournalClient />;
}
