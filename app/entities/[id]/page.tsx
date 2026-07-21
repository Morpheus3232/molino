"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ENTITIES, EXTENDED_ENTITIES, getEntitiesByCategory } from "@/lib/data/entities";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

const allEntities = useMemo(() => [...ENTITIES, ...EXTENDED_ENTITIES], []);

export default function EntityDetailPage() {
  const params = useParams();
  const entity = allEntities.find((e) => e.id === params.id);

  if (!entity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
        <UniversityHeader />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="font-serif text-2xl text-[#1F2937]">Entidad no encontrada</h1>
          <p className="text-[#6B7280] mt-2">La entidad que buscas no existe o fue removida.</p>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#EDEFF2]">
      <UniversityHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{entity.emoji}</span>
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1F2937]">{entity.name}</h1>
              <p className="text-sm text-[#6B7280] capitalize">{entity.category.replace(/([A-Z])/g, " $1")}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Life Path", value: entity.symbolism.lifePath ?? "—" },
              { label: "Signo", value: entity.symbolism.sunSign ?? "—" },
              { label: "Zodiaco chino", value: entity.symbolism.chineseZodiac ?? "—" },
              { label: "Elemento", value: entity.symbolism.element ?? "—" },
              { label: "Arquetipo", value: entity.symbolism.archetype ?? "—" },
            ].map((item) => (
              <div key={item.label} className="bg-[#F8F9FA] rounded-2xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-medium">{item.label}</p>
                <p className="text-lg font-serif font-bold mt-2 text-[#1F2937]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-serif text-xl font-semibold text-[#1F2937]">Descripción</h3>
            <p className="text-[#6B7280] mt-2">{entity.context.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-serif text-xl font-semibold text-[#1F2937]">Temas</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {entity.context.keyThemes.map((theme) => (
                <span key={theme} className="bg-[#F8F9FA] border border-gray-200 rounded-full px-3 py-1 text-xs text-[#1F2937]">
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {entity.context.funFact && (
            <div className="mt-6 bg-[#F8F9FA] rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">Dato curioso</p>
              <p className="text-sm text-[#1F2937] mt-1">{entity.context.funFact}</p>
            </div>
          )}
        </div>
      </div>
      <UniversityFooter />
    </div>
  );
}
