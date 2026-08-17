import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Tu línea de tiempo",
  description: "Tu historial personal de energía diaria — requiere tu mapa.",
  path: "/linea",
  noIndex: true,
});

export default function LineaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
