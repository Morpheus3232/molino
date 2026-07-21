import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES, YEAR_TYPES } from "@/lib/data";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

function CoreIdentity({ profile }: { profile: UserProfile }) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];
  const yearMeaning = YEAR_TYPES[(profile.lifePath % 9) || 9] || YEAR_TYPES[1];

  const numerologyNumbers = [
    { label: "Life Path", value: profile.lifePath, description: "Tu propósito fundamental" },
    { label: "Expresión", value: profile.expressionNumber ?? "—", description: "Cómo te presentás al mundo" },
    { label: "Alma", value: profile.soulNumber ?? "—", description: "Tus deseos más profundos" },
    { label: "Personalidad", value: profile.personalityNumber ?? "—", description: "Cómo te perciben los demás" },
  ];

  return (
    <Section className="mb-8">
      <Card hover={false} padding="lg">
        <div className="text-center mb-8">
          <span className="badge mb-3">Tu identidad</span>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-1">{profile.name.toUpperCase()}</h1>
          <p className="text-sm text-muted">
            {profile.birthDate}
            {profile.birthPlace ? ` • ${profile.birthPlace}` : ""}
            {profile.birthTime ? ` • ${profile.birthTime}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {numerologyNumbers.map((item) => (
            <div key={item.label} className="bg-background rounded-2xl p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">{item.label}</p>
              <p className="text-3xl font-serif font-bold mt-2" style={{ color: archetype.color || "#D4A843" }}>{item.value}</p>
              <p className="text-xs text-muted mt-1">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-2 text-sm text-foreground">
            <span className="text-base">🎯</span> Arquetipo: <strong>{archetype.name}</strong>
          </span>
          <span className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-2 text-sm text-foreground">
            <span className="text-base">♈</span> {profile.sunSign}
          </span>
          <span className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-2 text-sm text-foreground">
            <span className="text-base">{profile.chineseZodiacInfo?.emoji || "🐴"}</span> {profile.chineseZodiac}
          </span>
          <span className="inline-flex items-center gap-2 bg-card border border-card-border rounded-full px-4 py-2 text-sm text-foreground">
            <span className="text-base">🗓️</span> {yearMeaning.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-background rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Elemento</p>
            <p className="text-lg font-serif font-bold mt-2 text-foreground">{profile.element}</p>
            <p className="text-xs text-muted mt-1">{profile.modality}</p>
          </div>
          <div className="bg-background rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Zodiaco chino</p>
            <p className="text-lg font-serif font-bold mt-2 text-foreground">{profile.chineseZodiacInfo?.animal || "—"}</p>
            <p className="text-xs text-muted mt-1">Animal de tu año</p>
          </div>
        </div>
      </Card>
    </Section>
  );
}

export default CoreIdentity;
