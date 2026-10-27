import { initLocale } from "@/lib/i18n/server";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Biblioteca — Fuentes y Referencias", "Library — Sources and References"],
  description:
    ["Fuentes bibliográficas, artículos académicos y referencias que sustentan los sistemas de conocimiento de Molino: numerología, astrología y zodiaco chino.", "Bibliographic sources, academic articles and references behind Molino's knowledge systems: numerology, astrology and the Chinese zodiac."],
  path: "/biblioteca",
  ogTitle: ["Biblioteca", "Library"],
  ogDescription: ["Fuentes y referencias bibliográficas de los sistemas simbólicos de Molino.", "Sources and bibliographic references for Molino's symbolic systems."],
});

export default async function BibliotecaLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
