"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import { useRouter } from "next/navigation";

interface FrameworksExplorerProps {
  frameworks: typeof KNOWLEDGE_BASE.frameworks;
}

export default function FrameworksExplorer({ frameworks }: FrameworksExplorerProps) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">🧠 Explora marcos simbólicos</h2>
      <div className="flex flex-wrap gap-3">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => router.push(`/knowledge/${fw.id}`)}
            className="inline-flex items-center gap-2 bg-background hover:bg-card border border-border rounded-full px-5 py-3 text-sm font-medium text-foreground transition-colors"
          >
            <span>{fw.icon}</span>
            {fw.name}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted mt-4">
        Entradas base para una enciclopedia abierta. Próximamente: colaboración comunitaria.
      </p>
    </div>
  );
}
