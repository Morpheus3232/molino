import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar — Numerología, Astrología y Zodiaco Chino",
  description:
    "Explorá los sistemas de conocimiento que Molino utiliza: numerología pitagórica, astrología occidental y zodiaco chino. Contenido educativo con fuentes verificadas.",
  openGraph: {
    title: "Explorar — Molino",
    description:
      "Numerología, astrología y zodiaco chino: sistemas de conocimiento con fuentes verificadas.",
    type: "website",
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
