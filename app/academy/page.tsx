import type { Metadata } from "next";
import AcademyContent from "./AcademyContent";

export const metadata: Metadata = {
  title: "La Academia | Inteligencia Personal — Molino",
  description: "Descubrí la historia de las tradiciones simbólicas: desde Babilonia y Pitágoras hasta el zodíaco chino moderno.",
  openGraph: {
    title: "La Academia — Molino",
    description: "La historia de las tradiciones simbólicas que alimentan la Inteligencia Personal.",
    type: "website",
  },
};

export default function AcademyPage() {
  return <AcademyContent />;
}
