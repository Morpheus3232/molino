import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Descubrí tu Mapa Personal",
  description:
    "Ingresá tu fecha de nacimiento y descubrí tu perfil de Inteligencia Personal. Gratis, sin registro. Explorá tu identidad simbólica en Molino.",
  openGraph: {
    title: "Descubrí tu Mapa Personal | Molino",
    description:
      "Ingresá tu fecha de nacimiento y descubrí tu perfil de Inteligencia Personal.",
    type: "website",
    siteName: "Molino",
  },
  twitter: {
    card: "summary_large_image",
    title: "Descubrí tu Mapa Personal | Molino",
    description:
      "Ingresá tu fecha de nacimiento y descubrí tu perfil de Inteligencia Personal.",
  },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
