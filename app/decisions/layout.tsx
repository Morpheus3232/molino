import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: siteUrl("/decisions") },
};

export default function DecisionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
