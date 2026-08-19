import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI",
  description: "Síntesis e interpretaciones asistidas por IA de tu mapa.",
  robots: { index: false, follow: false },
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
