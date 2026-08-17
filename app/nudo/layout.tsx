import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Desatar el nudo",
  description: "Explorá una decisión, un momento o una energía difícil — requiere tu mapa.",
  path: "/nudo",
  noIndex: true,
});

export default function NudoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
