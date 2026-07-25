"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { formatAnimalEmoji, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface ContrastLearnSectionProps {
  profile: UserProfile;
}

const LEARNING_INSIGHTS: Record<string, string[]> = {
  Rata: ["Estrategia y planificación", "Paciencia en la ejecución", "Visión de largo alcance"],
  Buey: ["Constancia y persistencia", "Trabajo silencioso", "Construcción gradual"],
  Tigre: ["Acción decidida", "Liderazgo en crisis", "Coraje bajo presión"],
  Conejo: ["Diplomacia suave", "Armonía en el conflicto", "Intuición strategic"],
  Dragón: ["Ambición canalizada", "Visión de grandeza", "Energía transformadora"],
  Serpiente: ["Profundidad estratégica", "Intuición aguda", "Paciencia extrema"],
  Caballo: ["Movimiento consciente", "Expansión sin límites", "Libertad responsable"],
  Cabra: ["Creatividad aplicada", "Armonía activa", "Sensibilidad productiva"],
  Mono: ["Ingenio práctico", "Versatilidad enfocada", "Soluciones creativas"],
  Gallo: ["Observación precisa", "Honestidad constructiva", "Disciplina personal"],
  Perro: ["Lealtad selectiva", "Protección inteligente", "Confianza gradual"],
  Cerdo: ["Generosidad con límites", "Optimismo realista", "Calidez estratégica"],
};

export default function ContrastLearnSection({ profile }: ContrastLearnSectionProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const display = getZodiacDisplay(userAnimal);
  const learningPoints = LEARNING_INSIGHTS[userAnimal] ?? [];

  if (!userAnimal || relationMap.challenging.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <motion.div {...smoothReveal}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Mi contraste</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            No es negativo. Es aprendizaje. Los símbolos de contraste pueden enseñarte nuevas perspectivas.
          </p>
        </motion.div>

        {/* Challenging animals with learning */}
        <motion.div {...staggerApple} className="mt-8 space-y-4">
          {relationMap.challenging.map((rel, i) => {
            const relDisplay = getZodiacDisplay(rel.animal);
            return (
              <motion.div
                key={rel.animal}
                {...staggerItemSmooth}
                transition={{ delay: staggerDelay(i, 0.08), duration: 0.4 }}
                className="p-5 rounded-xl border border-border bg-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{relDisplay.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{relDisplay.name}</p>
                    <p className="text-[10px] text-muted">
                      {rel.type === "clash" ? "Opuestos en el ciclo" : "Relación de atención"}
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-[#B45309]">★★☆☆☆</span>
                </div>
                <p className="text-xs text-muted/70 leading-relaxed mb-3">
                  {rel.type === "clash"
                    ? `${display.name} y ${relDisplay.name} son opuestos en el ciclo. Esta relación puede enseñarte equilibrio y perspectiva diferente.`
                    : `${display.name} y ${relDisplay.name} tienen una relación de atención. Una oportunidad para practicar la paciencia y la estrategia.`}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Learning points */}
        {learningPoints.length > 0 && (
          <motion.div {...smoothReveal} className="mt-6 p-5 rounded-xl border border-border bg-card">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-medium mb-3">
              Qué puede enseñarte el contraste
            </p>
            <div className="flex flex-wrap gap-2">
              {learningPoints.map((point, i) => (
                <motion.span
                  key={point}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: staggerDelay(i, 0.06), duration: 0.3 }}
                  className="px-3 py-1.5 rounded-lg bg-background text-xs font-medium text-foreground"
                >
                  {point}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div {...smoothReveal} className="mt-6">
          <p className="text-[10px] text-muted/50 italic text-center">
            Los contrastes son oportunidades de crecimiento, no prohibiciones.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
