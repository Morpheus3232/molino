"use client";

import type { UserProfile } from "@/types/user";
import { motion } from "framer-motion";
import EditorialSection from "@/components/ui/EditorialSection";

interface IdentityCardProps {
  profile: UserProfile;
}

const STRENGTHS: Record<string, string[]> = {
  Rata: ["Astucia estratégica", "Adaptabilidad extrema", "Comunicación ágil"],
  Buey: ["Fuerza silenciosa", "Determinación inquebrantable", "Construcción paciente"],
  Tigre: ["Liderazgo natural", "Coraje en la acción", "Presencia que inspira"],
  Gato: ["Elegancia intuitiva", "Diplomacia suave", "Sensibilidad artística"],
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
  Gato: ["Evitación del conflicto", "Exceso de cautela", "Dificultad para la firmeza"],
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
  Tierra: { color: "#838C95", description: "Energía de estabilidad, práctica y concreción" },
  Madera: { color: "#2D5A3D", description: "Energía de crecimiento, expansión y visión" },
  Metal: { color: "#C49A2A", description: "Energía de precisión, estructura y excelencia" },
};

export default function IdentityCard({ profile }: IdentityCardProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as string;
  const element = profile.chineseZodiacInfo?.element ?? "Fuego";
  const elementData = ELEMENT_TRAITS[element] ?? ELEMENT_TRAITS.Fuego;

  const strengths = STRENGTHS[userAnimal] ?? [];
  const growthAreas = GROWTH_AREAS[userAnimal] ?? [];

  return (
    <EditorialSection
      eyebrow="FORTALEZAS Y TENSIONES"
      title={<>LO QUE TE DEFINE.<br />Y LO QUE REQUIERE CUIDADO.</>}
      intro={elementData.description}
    >
      <div className="pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Fortalezas */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-accent mb-2">
              Fortalezas
            </h3>
            <div className="mt-6">
              {strengths.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex items-baseline gap-4 py-4 border-b border-ink/10"
                >
                  <span className="font-heading text-sm text-ink/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base text-foreground">{s}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Áreas a cuidar */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-muted mb-2">
              Áreas a cuidar
            </h3>
            <div className="mt-6">
              {growthAreas.map((g, i) => (
                <motion.div
                  key={g}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex items-baseline gap-4 py-4 border-b border-ink/10"
                >
                  <span className="font-heading text-sm text-ink/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base text-foreground">{g}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted italic max-w-xl">
          No determina tu personalidad. Es una interpretación cultural basada en tradiciones simbólicas.
        </p>
      </div>
    </EditorialSection>
  );
}
