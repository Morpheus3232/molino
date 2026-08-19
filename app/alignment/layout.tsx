import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alineación",
  description: "Explorá tu alineación y equilibrio energético.",
  robots: { index: false, follow: false },
};

export default function AlignmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}