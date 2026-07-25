import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Mapa Personal | Molino",
  description:
    "Tu perfil de Inteligencia Personal: identidad simbólica, afinidades, círculo zodiacal y conexiones profundas. Descubrí tu mapa en Molino.",
  openGraph: {
    title: "Mi Mapa Personal | Molino",
    description:
      "Tu perfil de Inteligencia Personal: identidad simbólica, afinidades y conexiones profundas.",
    type: "website",
    siteName: "Molino",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Mapa Personal | Molino",
    description:
      "Tu perfil de Inteligencia Personal: identidad simbólica, afinidades y conexiones profundas.",
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
