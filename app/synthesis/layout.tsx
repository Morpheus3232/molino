import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Síntesis",
  description: "Síntesis integrada de tu mapa personal.",
  robots: { index: false, follow: false },
};

export default function SynthesisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}