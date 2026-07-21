"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

export default function AstrologiaPage() {
  const astro = KNOWLEDGE_BASE.astrology;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      <UniversityHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#1F2937] mb-2">🌌 Astrología</h1>
          <p className="text-[#6B7280] mb-6">{astro.history}</p>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Signos zodiacales</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {(astro.signs || []).slice(0, 12).map((sign: any) => (
              <div key={sign.name} className="bg-[#F8F9FA] rounded-2xl p-4 text-center">
                <p className="text-2xl">{sign.symbol}</p>
                <p className="text-sm font-medium text-[#1F2937]">{sign.name}</p>
                <p className="text-xs text-[#6B7280]">{sign.dates}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Planetas</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {(astro.planets || []).map((planet: any) => (
              <span key={planet.name} className="bg-[#F8F9FA] border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
                {planet.symbol} {planet.name}
              </span>
            ))}
          </div>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Casas astrológicas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {(astro.houses || []).map((house: any) => (
              <div key={house.number} className="bg-[#F8F9FA] rounded-2xl p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-[#1F2937]">{house.number}. {house.name}</span>
                <span className="text-xs text-[#6B7280]">{house.area}</span>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-xl font-semibold text-[#1F2937] mb-3">Aspectos</h2>
          <div className="flex flex-wrap gap-3">
            {(astro.aspects || []).map((aspect: any) => (
              <span key={aspect.name} className="bg-[#F8F9FA] border border-gray-200 rounded-full px-4 py-2 text-sm text-[#1F2937]">
                {aspect.angle} {aspect.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <UniversityFooter />
    </div>
  );
}
