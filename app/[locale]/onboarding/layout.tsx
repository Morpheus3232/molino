import { metadataFor } from "@/lib/seo";

export const generateMetadata = metadataFor({
  title: "Onboarding",
  description: ["Completá tu perfil en Molino.", "Complete your profile on Molino."],
  noIndex: true,
  noFollow: true,
});

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
