import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { ARCHETYPES } from "@/lib/data";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

function StrengthsChallenges({ profile }: { profile: UserProfile }) {
  const archetype = ARCHETYPES[profile.lifePath] || ARCHETYPES[1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Section className="mb-0">
        <Card>
          <div className="mb-4">
            <span className="badge">Fortalezas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(archetype.strengths || []).map((strength: string) => (
              <span key={strength} className="px-4 py-2 bg-background border border-border rounded-full text-sm text-foreground">
                {strength}
              </span>
            ))}
          </div>
        </Card>
      </Section>

      <Section className="mb-0">
        <Card>
          <div className="mb-4">
            <span className="badge">Desafíos</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(archetype.challenges || []).map((challenge: string) => (
              <span key={challenge} className="px-4 py-2 bg-background border border-border rounded-full text-sm text-muted">
                {challenge}
              </span>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}

export default StrengthsChallenges;
