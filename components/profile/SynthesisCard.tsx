import type { UserProfile } from "@/lib/engines/compatibilityEngine";
import { buildSynthesis } from "@/lib/engines/synthesisEngine";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

function SynthesisCard({ profile }: { profile: UserProfile }) {
  const synthesis = buildSynthesis(profile);

  return (
    <Section className="mb-8">
      <Card hover={false} padding="lg">
        <div className="mb-4">
          <span className="badge mb-3">Síntesis</span>
          <h2 className="text-2xl font-serif font-semibold text-foreground mt-3">{synthesis.headline}</h2>
          <p className="text-sm text-muted mt-2">{synthesis.summary}</p>
        </div>

        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Patrones dominantes</p>
          <div className="flex flex-wrap gap-2">
            {synthesis.patterns.map((pattern) => (
              <span key={pattern} className="inline-flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground">
                {pattern}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Insights integrados</p>
          <div className="space-y-3">
            {synthesis.insights.map((insight) => (
              <div key={insight.title} className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-foreground">{insight.title}</p>
                <p className="text-sm text-muted mt-1">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium mb-2">Recomendaciones</p>
          <ul className="space-y-2">
            {synthesis.recommendations.map((item) => (
              <li key={item} className="text-sm text-muted list-disc list-inside">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </Section>
  );
}

export default SynthesisCard;
