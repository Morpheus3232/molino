import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Evolución",
  robots: { index: false },
};

export default function EvolutionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
