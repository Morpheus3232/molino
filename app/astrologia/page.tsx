"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export default function AstrologiaPage() {
  const astro = KNOWLEDGE_BASE.astrology;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <UniversityHeader />
      <div className="max-w-content mx-auto px-4 sm:px-6 py-8 pb-24">
        <Section>
          <Card hover={false}>
        <div className="text-center mb-6">
          <span className="badge mb-3">🌌 Astrología</span>
          <h1 className="font-serif text-3xl font-bold text-foreground">El lenguaje de los astros</h1>
          <p className="text-muted mt-2 max-w-2xl mx-auto">Un sistema simbólico que explora arquetipos, ciclos y patrones de personalidad.</p>
        </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Signos zodiacales</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {(astro.signs || []).slice(0, 12).map((sign: any) => (
                <div key={sign.name} className="bg-background rounded-2xl p-4 text-center border border-border">
                  <p className="text-3xl mb-1">{sign.symbol}</p>
                  <p className="text-sm font-medium text-foreground">{sign.name}</p>
                  <p className="text-xs text-muted">{sign.dates}</p>
                  <p className="text-[10px] text-muted mt-1">{sign.element} · {sign.modality}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Planetas</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(astro.planets || []).map((planet: any) => (
                <div key={planet.name} className="bg-background rounded-2xl p-3 text-center border border-border">
                  <span className="text-2xl">{planet.symbol}</span>
                  <p className="text-xs font-medium text-foreground mt-1">{planet.name}</p>
                  <p className="text-[10px] text-muted">{planet.meaning}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card>
            <div className="mb-4">
              <span className="badge">Casas astrológicas</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(astro.houses || []).map((house: any) => (
                <div key={house.number} className="bg-background rounded-2xl p-4 flex items-center justify-between border border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-serif font-bold text-foreground">{house.number}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{house.name}</p>
                      <p className="text-xs text-muted">{house.area}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section>
          <Card>
            <div className="mb-4">
              <span className="badge">Aspectos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(astro.aspects || []).map((aspect: any) => (
                <div key={aspect.name} className="bg-background rounded-2xl p-3 text-center border border-border">
                  <p className="text-lg font-serif font-bold text-foreground">{aspect.angle}</p>
                  <p className="text-xs font-medium text-foreground">{aspect.name}</p>
                  <p className="text-[10px] text-muted mt-1">{aspect.meaning}</p>
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
