import { createRouteMetadata } from "@/lib/seo";

export const metadata = createRouteMetadata({
  title: "Tu Círculo",
  description: "Las energías que amplifican tu naturaleza y las que la desafían, según tu zodíaco chino.",
  noIndex: true,
});

export default function CirculoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
