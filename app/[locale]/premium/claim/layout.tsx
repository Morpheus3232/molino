import { initLocale } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: ["Recuperar Premium", "Recover Premium"],
  description: ["Recuperá tu acceso Premium desde el link de tu email de confirmación.", "Recover your Premium access from the link in your confirmation email."],
  path: "/premium/claim",
  noIndex: true,
});

export default async function PremiumClaimLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return children;
}
