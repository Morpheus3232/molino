import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Onboarding",
  description: "Completá tu perfil en Molino.",
  noIndex: true,
  noFollow: true,
});

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
