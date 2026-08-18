import JournalClient from "./JournalClient";
import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Journal de Autoconocimiento | Molino",
  description:
    "Registrá tus reflexiones y cruzalas con tus ciclos personales en tu diario simbólico. 100% privado, cálculo local, sin registro. Empezá a escribir hoy.",
  path: "/journal",
  ogTitle: "Journal de Autoconocimiento | Molino",
  ogDescription:
    "Registrá tus reflexiones y cruzalas con tus ciclos personales en tu diario simbólico. 100% privado, cálculo local, sin registro. Empezá a escribir hoy.",
});

export default function JournalPage() {
  return <JournalClient />;
}
