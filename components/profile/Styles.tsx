import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

function Styles({ profile }: { profile: UserProfile }) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];

  const categories = [
    { title: "Decision Style", desc: "Tomás decisiones basadas en tu arquetipo. Podés profundizar con tu Expression Number." },
    { title: "Relationship Style", desc: "Tu vínculo se condice con tu elemento y modality. Usalo para entender conflictos." },
    { title: "Work Style", desc: "Tu Life Path define tu enfoque laboral. Alinealo para mejorar rendimiento y satisfacción." },
  ];

  return (
    <Section className="mb-8">
      <Card>
        <div className="mb-4">
          <span className="badge">Estilos</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((item) => (
            <div key={item.title} className="bg-background rounded-2xl p-4">
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="text-sm text-muted mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

export default Styles;
