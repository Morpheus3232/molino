import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conocimiento",
  description: "Explorá los sistemas de conocimiento que Molino utiliza: numerología, astrología y zodiaco chino.",
  openGraph: {
    title: "Conocimiento — Molino",
    description: "Explorá los sistemas de conocimiento que Molino utiliza: numerología, astrología y zodiaco chino.",
    type: "article",
  },
};

export default function ConocimientoPage() {
  redirect("/explore");
}
