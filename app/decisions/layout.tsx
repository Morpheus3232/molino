import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decisiones",
  description: "Registrá y revisá tus decisiones con el marco de Molino.",
  robots: { index: false, follow: false },
};

export default function DecisionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}