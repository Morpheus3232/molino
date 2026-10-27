import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Biblioteca — Fuentes y Referencias",
  description:
    "Fuentes bibliográficas, artículos académicos y referencias que sustentan los sistemas de conocimiento de Molino: numerología, astrología y zodiaco chino.",
  path: "/biblioteca",
  ogTitle: "Biblioteca",
  ogDescription: "Fuentes y referencias bibliográficas de los sistemas simbólicos de Molino.",
});

export default function BibliotecaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
