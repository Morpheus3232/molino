"use client";

import { useEffect, useState } from "react";
import { ARCHETYPES, BRAND_DATA } from "@/lib/data";
import { KNOWLEDGE_BASE } from "@/lib/data/knowledge";

interface LibrarySectionProps {
  profile: any;
  knowledge: typeof KNOWLEDGE_BASE;
}

const PUBLIC_LIBRARY = [
  { title: "El Kybalion", author: "Tres Iniciados", topic: "Hermetismo", relevance: "Principios universales" },
  { title: "El Tarot", author: "Arthur Edward Waite", topic: "Arcanos", relevance: "Simbología arquetípica" },
  { title: "Numerología GG33", author: "Gary Grinberg", topic: "Numerología", relevance: "Cálculos prácticos" },
  { title: "Astrología para Todos", author: "Lilly Gandharī", topic: "Astrología", relevance: "Signos y planetas" },
  { title: "Los Doce Animales", author: "Tradición China", topic: "Zodíaco chino", relevance: "Ciclo sexagenario" },
];

export default function LibrarySection({ profile, knowledge }: LibrarySectionProps) {
  const archetype = ARCHETYPES[profile.lifePath] || { name: "Buscador", keywords: ["Curioso"] };
  const recommended = PUBLIC_LIBRARY.slice(0, 3);

  const userSign = profile.sunSign;
  const compatibleSigns: string[] = (knowledge.astrology.signs || [])
    .filter((s: any) => s.name !== userSign)
    .slice(0, 2)
    .map((s: any) => s.name);

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">📖 Biblioteca pública</h2>
      <p className="text-sm text-muted mb-6">
        Fuentes recomendadas para tu perfil: <strong>{archetype.name}</strong>
      </p>

      <div className="space-y-3">
        {recommended.map((book) => (
          <div key={book.title} className="bg-background rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">&ldquo;{book.title}&rdquo;</p>
              <p className="text-xs text-muted">{book.author} · {book.topic}</p>
            </div>
            <span className="text-xs bg-card border border-border rounded-full px-3 py-1 text-muted">
              {book.relevance}
            </span>
          </div>
        ))}
      </div>

      {compatibleSigns.length > 0 && (
        <div className="mt-6 p-4 bg-background rounded-2xl">
          <p className="text-sm font-medium text-foreground">Signos afines: {userSign}</p>
          <p className="text-xs text-muted mt-1">Compatibilidad natural con: {compatibleSigns.join(" y ")}</p>
        </div>
      )}
    </div>
  );
}
