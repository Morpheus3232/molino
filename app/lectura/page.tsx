import type { Metadata } from "next";
import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import LecturaClient from "./LecturaClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "La Lectura",
    // Contenido personal de una sola persona — no tiene sentido indexarlo.
    robots: { index: false, follow: true },
  };
}

// El perfil llega por el fragmento (#), que nunca toca el servidor — no hay
// nada que leer de searchParams acá, así que la página puede ser estática.
export default function LecturaPage() {
  const catalog = SYMBOLIC_ENTITIES.map(toLightweightEntity);
  return <LecturaClient catalog={catalog} />;
}
