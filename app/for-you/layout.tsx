import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For you",
  description: "Contenido personalizado para tu mapa.",
  robots: { index: false, follow: false },
};

export default function ForYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
