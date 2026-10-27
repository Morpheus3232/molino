import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Recuperar Premium",
  description: "Recuperá tu acceso Premium desde el link de tu email de confirmación.",
  path: "/premium/claim",
  noIndex: true,
});

export default async function PremiumClaimLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
