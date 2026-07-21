import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Molino — Personal Intelligence",
  description: "Entendé tu identidad, patrones, timing y alineación.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
