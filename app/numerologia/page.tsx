"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

export default function NumerologiaPage() {
  const num = KNOWLEDGE_BASE.numerology;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      <UniversityHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-2">📚 Numerología</h1>
          <p className="text-[#6B7280] mb-6">{num.history}</p>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Métodos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F8F9FA] rounded-2xl p-4">
              <p className="font-medium text-[#1F2937]">Pitagórico</p>
              <p className="text-sm text-[#6B7280]">{num.methods.pythagorean}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-2xl p-4">
              <p className="font-medium text-[#1F2937]">Caldeo</p>
              <p className="text-sm text-[#6B7280]">{num.methods.chaldean}</p>
            </div>
          </div>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Números maestros</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {num.masterNumbers.map((n) => (
              <span key={n} className="bg-[#F8F9FA] border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-[#1F2937]">
                {n}
              </span>
            ))}
          </div>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Temas</h2>
          <div className="space-y-3">
            {num.topics?.map((topic: any) => (
              <div key={topic.title} className="bg-[#F8F9FA] rounded-2xl p-4">
                <p className="font-medium text-[#1F2937]">{topic.title}</p>
                <p className="text-sm text-[#6B7280]">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UniversityFooter />
    </div>
  );
}
