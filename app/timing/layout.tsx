import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function TimingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
