import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tu Círculo",
  description: "Las energías que amplifican tu naturaleza y las que la desafían, según tu zodíaco chino.",
  robots: { index: false },
  openGraph: {
    title: "Tu Círculo | Molino",
    description: "Las energías que amplifican tu naturaleza y las que la desafían, según tu zodíaco chino.",
    type: "website",
    siteName: "Molino",
    url: siteUrl("/circulo"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu Círculo | Molino",
    description: "Las energías que amplifican tu naturaleza y las que la desafían.",
  },
};

export default function CirculoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
