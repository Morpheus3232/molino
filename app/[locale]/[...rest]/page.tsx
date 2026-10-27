import { notFound } from "next/navigation";

// Cualquier ruta que no exista bajo un idioma cae acá, así el 404 se dibuja
// dentro del layout con el idioma correcto (app/[locale]/not-found.tsx).
export default function CatchAll() {
  notFound();
}
