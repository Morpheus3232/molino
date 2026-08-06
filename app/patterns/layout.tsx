import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patterns",
  robots: { index: false, follow: false },
};

export default function PatternsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}