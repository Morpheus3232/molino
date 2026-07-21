"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import { useRouter } from "next/navigation";

interface FrameworksExplorerProps {
  frameworks: typeof KNOWLEDGE_BASE.frameworks;
}

export default function FrameworksExplorer({ frameworks }: FrameworksExplorerProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-[#1F2937] mb-4">🧠 Explora marcos simbólicos</h2>
      <div className="flex flex-wrap gap-3">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => router.push(`/knowledge/${fw.id}`)}
            className="inline-flex items-center gap-2 bg-[#F8F9FA] hover:bg-gray-100 border border-gray-200 rounded-full px-5 py-3 text-sm font-medium text-[#1F2937] transition-colors"
          >
            <span>{fw.icon}</span>
            {fw.name}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#9CA3AF] mt-4">
        Entradas base para una enciclopedia abierta. Próximamente: colaboración comunitaria.
      </p>
    </div>
  );
}
