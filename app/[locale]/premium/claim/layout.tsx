import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Recuperar Premium",
  description: "Recuperá tu acceso Premium desde el link de tu email de confirmación.",
  path: "/premium/claim",
  noIndex: true,
});

export default function PremiumClaimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
