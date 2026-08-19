import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi mapa",
  description: "Tu mapa personal de autoconocimiento.",
  robots: { index: false, follow: false },
};

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
