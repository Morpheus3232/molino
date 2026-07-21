"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import { useRouter } from "next/navigation";

interface KnowledgePortalProps {
  profile: any;
  knowledge: typeof KNOWLEDGE_BASE;
}

export default function KnowledgePortal({ profile, knowledge }: KnowledgePortalProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-[#1F2937] mb-6">🏛️ Portal del conocimiento</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: "numerologia", title: "📚 Numerología", icon: "📚", description: "Historia, tabla pitagórica, números maestros y cálculos básicos." },
          { id: "astrologia", title: "🌌 Astrología", icon: "🌌", description: "Signos, planetas, casas y aspectos del zodíaco." },
          { id: "chineseZodiac", title: "🐉 Zodíaco chino", icon: "🐉", description: "Animales, elementos, compatibilidades y años chinos." },
        ].map((subject) => (
          <div key={subject.id} className="bg-[#F8F9FA] rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{subject.icon}</div>
            <h3 className="font-serif text-lg font-semibold text-[#1F2937] mb-2">{subject.title}</h3>
            <p className="text-sm text-[#6B7280] mb-4">{subject.description}</p>
            <ul className="space-y-2 mb-4">
              {(knowledge[subject.id as keyof typeof knowledge] as any)?.topics?.map((topic: any) => (
                <li key={topic.title} className="text-sm text-[#1F2937] flex items-start gap-2">
                  <span className="mt-1 text-[#D4A843]">•</span>
                  <div>
                    <p className="font-medium">{topic.title}</p>
                    <p className="text-xs text-[#6B7280]">{topic.description}</p>
                  </div>
                </li>
              )) || (
                <li key={subject.id + "-no-data"} className="text-sm text-[#6B7280]">Explorá este sistema simbólico en detalle.</li>
              )}
            </ul>
            <button
              onClick={() => {
                if (subject.id === "numerologia") router.push("/numerologia");
                else if (subject.id === "astrologia") router.push("/astrologia");
                else if (subject.id === "chineseZodiac") router.push("/zodiaco-chino");
              }}
              className="text-sm font-medium text-white bg-[#1F2937] px-4 py-2 rounded-full hover:bg-[#374151] transition-colors"
            >
              Ver más →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
