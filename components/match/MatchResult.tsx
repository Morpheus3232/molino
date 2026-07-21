"use client";

import { useRouter } from "next/navigation";
import { EntityProfile } from "@/lib/data/entities";
import { UserProfile } from "@/types/user";
import { generateMatchStory } from "@/lib/engines/storyEngine";
import { ARCHETYPES } from "@/lib/data";

interface MatchResultProps {
  user: UserProfile;
  entity: EntityProfile;
  score: number;
}

export default function MatchResult({ user, entity, score }: MatchResultProps) {
  const router = useRouter();
  const archetypeData = ARCHETYPES[user.lifePath] || ARCHETYPES[1];
  const story = generateMatchStory(user, entity, score);

  const getScoreColor = (s: number): string => {
    if (s >= 80) return "text-green-500";
    if (s >= 60) return "text-blue-500";
    if (s >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (s: number): string => {
    if (s >= 80) return "Excelente conexión";
    if (s >= 60) return "Muy buena conexión";
    if (s >= 40) return "Buena conexión";
    return "Conexión en desarrollo";
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-[var(--accent)] mb-6">
          <span className={`text-5xl font-serif ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
        <h1 className="font-serif text-4xl font-light tracking-tight">
          {entity.name}
        </h1>
        <p className="text-[var(--muted)] mt-2">
          {getScoreLabel(score)} · {entity.category}
        </p>
      </div>

      <div className="bg-[var(--background)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-xs tracking-[0.2em] text-[var(--muted)] uppercase mb-6">
          Análisis de compatibilidad
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted)]">Tu arquetipo</span>
            <span className="font-medium">{archetypeData.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted)]">Life Path</span>
            <span className="font-medium">{user.lifePath}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[var(--muted)]">Astrología</span>
            <span className="font-medium">{user.sunSign || "—"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--muted)]">Zodiaco Chino</span>
            <span className="font-medium">{user.chineseZodiac || "—"}</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--background)] rounded-2xl p-6 border border-[var(--border)]">
        <h2 className="text-xs tracking-[0.2em] text-[var(--muted)] uppercase mb-6">
          Narrativa de conexión
        </h2>
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">{story.narrative}</p>

          <div className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm font-medium">Puntos de conexión:</p>
            <ul className="text-sm text-[var(--muted)] mt-2 space-y-1">
              {story.connections.map((conn, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{conn}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm font-medium">Áreas de crecimiento:</p>
            <ul className="text-sm text-[var(--muted)] mt-2 space-y-1">
              {story.challenges.map((challenge, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-500">⟳</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/explore")}
          className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-full transition-all hover:bg-[var(--accent)]"
        >
          Explorar más compatibilidades →
        </button>
        <button
          onClick={() => router.push("/profile")}
          className="w-full py-4 bg-transparent border border-[var(--border)] text-[var(--foreground)] font-medium rounded-full transition-all hover:border-[var(--accent)]"
        >
          Ver mi perfil
        </button>
      </div>
    </div>
  );
}
