"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function ZodiacoChinoContent() {
  const ch = KNOWLEDGE_BASE.chineseZodiac;

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <div className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-3">Zodiaco chino</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">El ciclo de los 12 animales</h1>
            <p className="mt-3 text-sm text-muted max-w-2xl mx-auto">{ch.history}</p>
          </div>
        </Section>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Animales</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(ch.animals || []).map((animal: string, idx: number) => (
                <div key={animal} className="rounded-xl border border-border bg-background p-4 text-center">
                  <p className="text-2xl mb-1">{["🐭","🐮","🐯","🐰","🐲","🐍","🐴","🐐","🐵","🐔","🐶","🐷"][idx]}</p>
                  <p className="text-sm font-medium text-foreground">{animal}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Elementos</p>
            <div className="flex flex-wrap gap-3">
              {(ch.elements || []).map((el: string) => (
                <span key={el} className="rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground">
                  {el}
                </span>
              ))}
            </div>
          </Card>
        </Section>

        <Section>
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Compatibilidades</p>
            <p className="text-sm text-muted mb-4">Relación entre los signos del zodiaco chino. Cada animal tiene compatibilidades y desafíos específicos.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(ch.compatibility || []).slice(0, 6).map((row: any) => (
                <div key={row[0]} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-medium text-foreground mb-2">{row[0]}</p>
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

            <div className="mt-8">
              <Button variant="secondary" fullWidth onClick={() => window.location.href = "/profile"}>
                Volver a mi perfil
              </Button>
            </div>
          </Card>
        </Section>
      </div>
      <UniversityFooter />
    </div>
  );
}
