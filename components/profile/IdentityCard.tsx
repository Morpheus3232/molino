"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { formatAnimalEmoji, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { getAnimalProfile, type Animal } from "@/lib/data/animalRelations";
import {
  smoothReveal,
  heroReveal,
  emojiBounce,
  staggerApple,
  staggerItemSmooth,
} from "@/lib/utils/premiumMotion";
import CountUp from "@/components/ui/CountUp";

interface IdentityCardProps {
  profile: UserProfile;
}

const STRENGTHS: Record<string, string[]> = {
  Rata: ["Astucia estratégica", "Adaptabilidad extrema", "Comunicación ágil"],
  Buey: ["Fuerza silenciosa", "Determinación inquebrantable", "Construcción paciente"],
  Tigre: ["Liderazgo natural", "Coraje en la acción", "Presencia que inspira"],
  Conejo: ["Elegancia intuitiva", "Diplomacia suave", "Sensibilidad artística"],
  Dragón: ["Visión de largo alcance", "Carisma magnético", "Capacidad de logro"],
  Serpiente: ["Sabiduría profunda", "Intuición aguda", "Magnetismo personal"],
  Caballo: ["Movimiento constante", "Independencia vital", "Espíritu explorador"],
  Cabra: ["Creatividad natural", "Armonía estética", "Sensibilidad refinada"],
  Mono: ["Ingenio rápido", "Versatilidad mental", "Chispa resolutiva"],
  Gallo: ["Observación precisa", "Honestidad directa", "Coraje de decir"],
  Perro: ["Lealtad incondicional", "Protección instinctiva", "Honradez absoluta"],
  Cerdo: ["Generosidad generosa", "Optimismo contagioso", "Calidez humana"],
};

const GROWTH_AREAS: Record<string, string[]> = {
  Rata: ["Impulsividad ante oportunidades", "Exceso de calculación", "Difícultad para delegar"],
  Buey: ["Rigidez ante cambios", "Exceso de paciencia (inacción)", "Dificultad para soltar"],
  Tigre: ["Impulsividad en decisiones", "Intensidad que agota", "Dificultad para la pausa"],
  Conejo: ["Evitación del conflicto", "Exceso de cautela", "Dificultad para la firmeza"],
  Dragón: ["Impaciencia con lo ordinario", "Exceso de ambición", "Dificultad para la vulnerabilidad"],
  Serpiente: ["Exceso de introspección", "Misterio que aísla", "Dificultad para la apertura"],
  Caballo: ["Impulsividad constante", "Exceso de velocidad", "Dificultad para la pausa"],
  Cabra: ["Indecisión creativa", "Exceso de sensibilidad", "Dificultad para la acción"],
  Mono: ["Dispersión mental", "Exceso de curiosidad", "Dificultad para la profundidad"],
  Gallo: ["Crudeza en la honestidad", "Exceso de autocrítica", "Dificultad para la flexibilidad"],
  Perro: ["Exceso de lealtad (sacrificio)", "Preocupación constante", "Dificultad para la confianza"],
  Cerdo: ["Exceso de generosidad (límites)", "Optimismo que ignora", "Dificultad para la disciplina"],
};

const ELEMENT_TRAITS: Record<string, { color: string; description: string }> = {
  Fuego: { color: "#B45309", description: "Energía de acción, pasión y transformación" },
  Agua: { color: "#4A6FA5", description: "Energía de flujo, intuición y profundidad" },
  Tierra: { color: "#6B7280", description: "Energía de estabilidad, práctica y concreción" },
  Madera: { color: "#2D5A3D", description: "Energía de crecimiento, expansión y visión" },
  Metal: { color: "#C49A2A", description: "Energía de precisión, estructura y excelencia" },
};

export default function IdentityCard({ profile }: IdentityCardProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);
  const display = getZodiacDisplay(userAnimal);
  const animalProfile = useMemo(() => userAnimal ? getAnimalProfile(userAnimal) : null, [userAnimal]);
  const element = profile.chineseZodiacInfo?.element ?? "Fuego";
  const elementData = ELEMENT_TRAITS[element] ?? ELEMENT_TRAITS.Fuego;
  const lifePath = profile.lifePath;

  const strengths = STRENGTHS[userAnimal] ?? [];
  const growthAreas = GROWTH_AREAS[userAnimal] ?? [];

  return (
    <motion.section {...heroReveal} className="mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        {/* Accent bar */}
        <div className="h-1.5" style={{ backgroundColor: elementData.color }} />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">Mi Identidad</span>
          </div>

          {/* Animal hero */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <motion.div {...emojiBounce} className="text-center shrink-0">
              <span className="text-7xl sm:text-8xl block mb-2">{display.emoji}</span>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{display.name}</p>
            </motion.div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: `${elementData.color}12`, color: elementData.color }}>
                  {element}
                </span>
                <span className="px-3 py-1 rounded-lg bg-background text-xs font-medium text-foreground">
                  Camino {lifePath}
                </span>
                <span className="px-3 py-1 rounded-lg bg-background text-xs font-medium text-foreground">
                  Suerte {profile.luckyNumber}
                </span>
                <span className="px-3 py-1 rounded-lg bg-background text-xs font-medium text-foreground">
                  {userYear}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {elementData.description}
              </p>
            </div>
          </div>

          {/* Strengths */}
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Fortalezas</p>
            <motion.div {...staggerApple} className="space-y-2">
              {strengths.map((s, i) => (
                <motion.div
                  key={s}
                  {...staggerItemSmooth}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/50"
                >
                  <span className="w-6 h-6 rounded-full bg-[#2D5A3D]/10 flex items-center justify-center text-[10px] text-[#2D5A3D] font-medium shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">{s}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Growth areas */}
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">Áreas a cuidar</p>
            <motion.div {...staggerApple} className="space-y-2">
              {growthAreas.map((g, i) => (
                <motion.div
                  key={g}
                  {...staggerItemSmooth}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/50"
                >
                  <span className="w-6 h-6 rounded-full bg-[#B45309]/10 flex items-center justify-center text-[10px] text-[#B45309] font-medium shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">{g}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Knowledge explorers */}
          <div className="mb-6 space-y-3">
            <LifePathExplorerInline lifePath={lifePath} router={router} />
            <ZodiacExplorerInline animal={userAnimal} element={element} router={router} />
          </div>

          {/* Disclaimer */}
          <div className="pt-4 border-t border-border">
            <p className="text-[10px] text-muted/50 italic">
              No determina tu personalidad. Es una interpretación cultural basada en tradiciones simbólicas.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ════════════════════════════════════════════════════
// INLINE EXPLORERS
// ════════════════════════════════════════════════════

function LifePathExplorerInline({ lifePath, router }: { lifePath: number; router: ReturnType<typeof useRouter> }) {
  return (
    <button
      type="button"
      onClick={() => router.push("/conocimiento/numerologia")}
      className="w-full text-left p-4 rounded-xl border border-border bg-background/50 group hover:border-accent/40 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted font-medium">Life Path {lifePath}</p>
          <p className="text-xs text-muted/70">Numerología pitagórica moderna</p>
        </div>
        <span className="text-[10px] text-accent group-hover:translate-x-1 transition-transform">Conocer origen →</span>
      </div>
    </button>
  );
}

function ZodiacExplorerInline({ animal, element, router }: { animal: string; element: string; router: ReturnType<typeof useRouter> }) {
  const display = getZodiacDisplay(animal);

  return (
    <button
      type="button"
      onClick={() => router.push("/conocimiento/zodiaco-chino")}
      className="w-full text-left p-4 rounded-xl border border-border bg-background/50 group hover:border-accent/40 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{display.emoji}</span>
          <div>
            <p className="text-[10px] text-muted font-medium">{display.name} · {element}</p>
            <p className="text-xs text-muted/70">Tradición zodiacal oriental</p>
          </div>
        </div>
        <span className="text-[10px] text-accent group-hover:translate-x-1 transition-transform">Explorar tradición →</span>
      </div>
    </button>
  );
}
