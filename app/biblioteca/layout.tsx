import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biblioteca — Fuentes y Referencias",
  description:
    "Fuentes bibliográficas, artículos académicos y referencias que sustentan los sistemas de conocimiento de Molino: numerología, astrología y zodiaco chino.",
  openGraph: {
    title: "Biblioteca — Molino",
    description:
      "Fuentes y referencias bibliográficas de los sistemas simbólicos de Molino.",
    type: "website",
  },
};

export default function BibliotecaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
