import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Completá tu perfil en Molino.",
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
