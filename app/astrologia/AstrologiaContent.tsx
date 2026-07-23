"use client";

import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";
import UniversityHeader from "@/components/layout/UniversityHeader";
import UniversityFooter from "@/components/layout/UniversityFooter";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function AstrologiaContent() {
  const astro = KNOWLEDGE_BASE.astrology;

  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <div className="mx-auto max-w-content px-4 sm:px-6 py-8 pb-24">
        <Section>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-3">Astrología</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">El lenguaje de los astros</h1>
            <p className="mt-3 text-sm text-muted max-w-2xl mx-auto">Un sistema simbólico que explora arquetipos, ciclos y patrones de personalidad.</p>
          </div>
        </Section>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Signos zodiacales</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(astro.signs || []).slice(0, 12).map((sign: any) => (
                <div key={sign.name} className="rounded-xl border border-border bg-background p-4 text-center">
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
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Planetas</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(astro.planets || []).map((planet: any) => (
                <div key={planet.name} className="rounded-xl border border-border bg-background p-3 text-center">
                  <span className="text-2xl">{planet.symbol}</span>
                  <p className="text-xs font-medium text-foreground mt-1">{planet.name}</p>
                  <p className="text-[10px] text-muted mt-1">{planet.meaning}</p>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section className="mb-8">
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Casas astrológicas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(astro.houses || []).map((house: any) => (
                <div key={house.number} className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-serif font-semibold text-foreground">{house.number}</span>
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
          <Card hover={false} padding="lg">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">Aspectos</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(astro.aspects || []).map((aspect: any) => (
                <div key={aspect.name} className="rounded-xl border border-border bg-background p-3 text-center">
                  <p className="text-lg font-serif font-semibold text-foreground">{aspect.angle}</p>
                  <p className="text-xs font-medium text-foreground">{aspect.name}</p>
                  <p className="text-[10px] text-muted mt-1">{aspect.meaning}</p>
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
