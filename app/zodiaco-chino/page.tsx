"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export default function ZodiacoChinoPage() {
  const ch = KNOWLEDGE_BASE.chineseZodiac;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <Card hover={false}>
            <div className="text-center mb-6">
              <span className="badge mb-3">🐉 Zodíaco chino</span>
              <h1 className="font-serif text-3xl font-bold text-foreground">El ciclo de los 12 animales</h1>
              <p className="text-muted mt-2 max-w-2xl mx-auto">{ch.history}</p>
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Animales</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {(ch.animals || []).map((animal: string, idx: number) => (
                <div key={animal} className="bg-background rounded-2xl p-4 text-center border border-border">
                  <p className="text-2xl mb-1">{["🐭","🐮","🐯","🐰","🐲","🐍","🐴","🐐","🐵","🐔","🐶","🐷"][idx]}</p>
                  <p className="text-sm font-medium text-foreground">{animal}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Elementos</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              {(ch.elements || []).map((el: string) => (
                <span key={el} className="bg-background border border-border rounded-2xl px-5 py-3 text-sm font-medium text-foreground">
                  {el}
                </span>
              ))}
            </div>
          </Card>
        </Section>

        <Section>
          <Card>
            <div className="mb-4">
              <span className="badge">Compatibilidades</span>
            </div>
            <p className="text-sm text-muted mb-4">
              Relación entre los signos del zodiaco chino. Cada animal tiene compatibilidades y desafíos específicos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(ch.compatibility || []).slice(0, 6).map((row: any) => (
                <div key={row[0]} className="bg-background rounded-2xl p-4 border border-border">
                  <p className="font-medium text-foreground mb-2">{row[0]}</p>
                  <div className="mb-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Compatibles</p>
                    <p className="text-xs text-foreground">{(row[1] || []).join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Desafíos</p>
                    <p className="text-xs text-muted">{(row[2] || []).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
