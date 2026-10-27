import { initLocale } from "@/lib/i18n/server";
import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: "Onboarding",
  description: ["Completá tu perfil en Molino.", "Complete your profile on Molino."],
  noIndex: true,
  noFollow: true,
});

export default async function OnboardingLayout({ children, params }: { children: React.ReactNode } & { params: Promise<{ locale: string }> }) {
  await initLocale(params);
  return <>{children}</>;
}
