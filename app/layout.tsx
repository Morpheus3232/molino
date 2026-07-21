import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Molino — Universidad Pública de Libre Acceso",
  description: "Universidad Pública de Libre Acceso. Código abierto, sin registro, sin rastreo. Explorá sistemas simbólicos de forma transparente.",
  openGraph: {
    title: "Molino — Universidad Pública de Libre Acceso",
    description: "El conocimiento simbólico es patrimonio de la humanidad. Código abierto, sin registro, sin rastreo.",
    type: "website",
    url: "https://molino.app",
    images: [
      {
        url: "https://molino.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Molino — Universidad Pública de Libre Acceso",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Molino — Universidad Pública de Libre Acceso",
    description: "Código abierto, sin registro, sin rastreo. Explorá sistemas simbólicos de forma transparente.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="w-full bg-background relative">
          {children}
        </div>
      </body>
    </html>
  );
}
