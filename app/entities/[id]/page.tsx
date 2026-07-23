"use client";

import { useParams } from "next/navigation";
import { ENTITIES } from "@/lib/data/entities";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";

export default function EntityDetailPage() {
  const params = useParams();
  const entity = ENTITIES.find((e) => e.id === params.id);

  if (!entity) {
    return (
      <div className="min-h-screen bg-background">
        <UniversityHeader />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="font-serif text-2xl text-foreground">Entidad no encontrada</h1>
          <p className="text-muted mt-2">La entidad que buscas no existe o fue removida.</p>
        </div>
        <UniversityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">
        <div className="bg-card rounded-3xl shadow-sm border border-border p-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{entity.emoji}</span>
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">{entity.name}</h1>
              <p className="text-sm text-muted capitalize">{entity.category.replace(/([A-Z])/g, " $1")}</p>
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
              <div key={item.label} className="bg-background rounded-2xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">{item.label}</p>
                <p className="text-lg font-serif font-bold mt-2 text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-serif text-xl font-semibold text-foreground">Descripción</h3>
            <p className="text-muted mt-2">{entity.context.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-serif text-xl font-semibold text-foreground">Temas</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {entity.context.keyThemes.map((theme) => (
                <span key={theme} className="bg-background border border-border rounded-full px-3 py-1 text-xs text-foreground">
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {entity.context.funFact && (
            <div className="mt-6 bg-background rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium">Dato curioso</p>
              <p className="text-sm text-foreground mt-1">{entity.context.funFact}</p>
            </div>
          )}
        </div>
      </div>
      <UniversityFooter />
    </div>
  );
}
