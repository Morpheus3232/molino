import JournalClient from "./JournalClient";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Journal de Autoconocimiento", "Self-Knowledge Journal"],
  description:
    ["Registrá tus reflexiones y cruzalas con tus ciclos personales en tu diario simbólico. 100% privado, cálculo local, sin registro. Empezá a escribir hoy.", "Record your reflections and cross them with your personal cycles in your symbolic journal. 100% private, calculated on your device, no sign-up. Start writing today."],
  path: "/journal",
  ogTitle: ["Journal de Autoconocimiento", "Self-Knowledge Journal"],
  ogDescription:
    ["Registrá tus reflexiones y cruzalas con tus ciclos personales en tu diario simbólico. 100% privado, cálculo local, sin registro. Empezá a escribir hoy.", "Record your reflections and cross them with your personal cycles in your symbolic journal. 100% private, calculated on your device, no sign-up. Start writing today."],
});

export default function JournalPage() {
  return <JournalClient />;
}
