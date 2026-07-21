"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

export default function ZodiacoChinoPage() {
  const ch = KNOWLEDGE_BASE.chineseZodiac;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      <UniversityHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-2">🐉 Zodíaco chino</h1>
          <p className="text-[#6B7280] mb-6">{ch.history}</p>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Animales</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {(ch.animals || []).map((animal: string) => (
              <span key={animal} className="bg-[#F8F9FA] border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
                {animal}
              </span>
            ))}
          </div>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Elementos</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {(ch.elements || []).map((el: string) => (
              <span key={el} className="bg-[#F8F9FA] border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
                {el}
              </span>
            ))}
          </div>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Compatibilidades</h2>
          <div className="space-y-3">
            {(ch.compatibility || []).slice(0, 4).map((row: any) => (
              <div key={row[0]} className="bg-[#F8F9FA] rounded-2xl p-4">
                <p className="font-medium text-[#1F2937]">{row[0]}</p>
                <p className="text-xs text-[#6B7280]">
                  Compatible con: {(row[1] || []).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UniversityFooter />
    </div>
  );
}
