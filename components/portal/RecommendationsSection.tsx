"use client";

import { COUNTRY_DATA, BRAND_DATA, BAND_DATA, POLITICIAN_DATA, ACTOR_DATA } from "@/lib/data";

interface RecommendationItem {
  name: string;
  flagOrLogo: string;
  category: string;
  score: number;
}

interface RecommendationsSectionProps {
  profile: any;
}

function getCompatibilityScore(userAnimal: string, targetAnimal: string): number {
  const animals = ["Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"];
  const userIndex = animals.indexOf(userAnimal);
  const targetIndex = animals.indexOf(targetAnimal);
  if (userIndex === -1 || targetIndex === -1) return 50;
  const diff = Math.abs(userIndex - targetIndex) % 12;
  const scores: Record<number, number> = { 0: 80, 1: 70, 2: 50, 3: 40, 4: 60, 5: 30, 6: 90, 7: 30, 8: 60, 9: 40, 10: 50, 11: 70 };
  return scores[diff] || 50;
}

export default function RecommendationsSection({ profile }: RecommendationsSectionProps) {
  const userAnimal = profile.chineseZodiac;
  const userLife = profile.lifePath || 7;

  const countryScores: RecommendationItem[] = Object.entries(COUNTRY_DATA)
    .map(([name, data]: [string, any]) => {
      const score = getCompatibilityScore(userAnimal, data.animal);
      return { name, flagOrLogo: data.flag, category: "País", score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const brandScores: RecommendationItem[] = Object.entries(BRAND_DATA)
    .map(([name, data]: [string, any]) => {
      const score = getCompatibilityScore(userAnimal, data.animal) + Math.floor(Math.random() * 10);
      return { name, flagOrLogo: data.logo, category: data.category, score: Math.min(99, score) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const bandScores: RecommendationItem[] = Object.entries(BAND_DATA)
    .map(([name, data]: [string, any]) => {
      const score = getCompatibilityScore(userAnimal, data.animal);
      return { name, flagOrLogo: data.logo, category: data.genre, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const all = [...countryScores, ...brandScores, ...bandScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">🌟 Recomendaciones para ti</h2>
      <p className="text-sm text-muted mb-6">Basado en tu animal chino: <strong>{userAnimal}</strong></p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {all.map((item) => (
          <div key={item.name} className="bg-background rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{item.flagOrLogo}</div>
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted">{item.category}</p>
            <p className="text-lg font-bold mt-2 text-accent">{item.score}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
