"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import EditorialSection from "@/components/ui/EditorialSection";

interface KnowledgeConnectionsProps {
  profile: UserProfile;
}

interface DataSource {
  field: string;
  value: string;
  origin: string;
  tradition: string;
}

export default function KnowledgeConnections({ profile }: KnowledgeConnectionsProps) {
  const lifePath = profile.lifePath;
  const sunSign = profile.sunSign;
  const chineseZodiac = profile.chineseZodiac ?? "";
  const element = profile.chineseZodiacInfo?.element ?? "";
  const expressionNumber = profile.expressionNumber;
  const personalityNumber = profile.personalityNumber;

  const sources: DataSource[] = [
    {
      field: "Life Path",
      value: String(lifePath),
      origin: "Numerología pitagórica moderna",
      tradition: "Desarrollada a partir de sistemas pitagóricos, formalizada en el siglo XX por L. Dow Balliett y Juno Jordan.",
    },
    {
      field: "Signo solar",
      value: sunSign,
      origin: "Astrología helenística",
      tradition: "Basada en la fusión de la astrología babilónica con la filosofía griega (siglo I d.C.).",
    },
    {
      field: "Animal zodiacal",
      value: chineseZodiac,
      origin: "Zodíaco chino",
      tradition: "Sistema de 12 animales y 5 elementos documentado en textos imperiales chinos (siglo V).",
    },
    {
      field: "Elemento",
      value: element,
      origin: "Zodíaco chino — sistema de 5 elementos",
      tradition: "Los 5 elementos (Madera, Fuego, Tierra, Metal, Agua) ciclan en combinación con los 12 animales.",
    },
    // Expresión solo se calcula si hay nombre (letra por letra) — el
    // onboarding actual no lo pide, así que para la mayoría de los perfiles
    // no existe. Se omite en vez de mostrar "—", que aparentaría un dato
    // roto en vez de un dato que simplemente no aplica a este perfil.
    ...(expressionNumber ? [{
      field: "Expresión Number",
      value: String(expressionNumber),
      origin: "Numerología del nombre",
      tradition: "Cada letra del nombre tiene un valor numérico según la tabla pitagórica.",
    }] : []),
    ...(personalityNumber ? [{
      field: "Personalidad",
      value: String(personalityNumber),
      origin: "Numerología del día de nacimiento",
      tradition: "Se obtiene exclusivamente a partir del día de nacimiento reducido a un solo dígito, o manteniendo los números maestros 11, 22 y 33.",
    }] : []),
  ];

  return (
    <EditorialSection
      eyebrow="FUENTES DEL CONOCIMIENTO"
      title={<>DE DÓNDE SALE<br />CADA DATO.</>}
      intro="Cada dato de tu perfil viene de una tradición cultural específica."
    >
      <div className="pt-4">
        {sources.map((source, i) => (
          <motion.div
            key={source.field}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="py-6 border-b border-ink/10 last:border-b-0"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                {source.origin}
              </span>
              <span className="font-mono text-xs text-muted">
                {source.field} = {source.value}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-2xl">{source.tradition}</p>
          </motion.div>
        ))}
      </div>
    </EditorialSection>
  );
}
