import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Molino — Personal Intelligence",
  description: "Un sistema simbólico que explora patrones de personalidad, ciclos y significado.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AnalyticsProvider />
        <AnimatedLayout>{children}</AnimatedLayout>
      </body>
    </html>
  );
}
