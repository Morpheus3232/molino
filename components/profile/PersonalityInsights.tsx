import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

function PersonalityInsights({ profile }: { profile: UserProfile }) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];

  const traits = [
    { label: "Comunicación", value: profile.expressionNumber || profile.lifePath },
    { label: "Motivación", value: profile.soulNumber || profile.lifePath },
    { label: "Imagen", value: profile.personalityNumber || profile.lifePath },
  ];

  return (
    <Section className="mb-8">
      <Card>
        <div className="mb-4">
          <span className="badge">Personalidad</span>
        </div>
        <p className="text-muted leading-relaxed mb-4">
          Tu expresión combina tu Life Path con tus números internos. Esto define cómo tomás decisiones, cómo te relacionás y cómo trabajás.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {traits.map((item) => (
            <div key={item.label} className="bg-background rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">{item.label}</p>
              <p className="text-3xl font-serif font-bold mt-2 text-foreground">{item.value}</p>
              <p className="text-xs text-muted mt-1">Número guía</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

export default PersonalityInsights;
