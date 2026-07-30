"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";

interface KnowledgeConnectionsProps {
  profile: UserProfile;
}

interface DataSource {
  field: string;
  value: string;
  origin: string;
  tradition: string;
  icon: string;
}

export default function KnowledgeConnections({ profile }: KnowledgeConnectionsProps) {
  const lifePath = profile.lifePath;
  const sunSign = profile.sunSign;
  const chineseZodiac = profile.chineseZodiac ?? "";
  const element = profile.chineseZodiacInfo?.element ?? "";
  const expressionNumber = profile.expressionNumber;
  const soulNumber = profile.soulNumber;

  const sources: DataSource[] = [
    {
      field: "Life Path",
      value: String(lifePath),
      origin: "Numerología pitagórica moderna",
      tradition: "Desarrollada a partir de sistemas pitagóricos, formalizada en el siglo XX por L. Dow Balliett y Juno Jordan.",
      icon: "🔢",
    },
    {
      field: "Signo solar",
      value: sunSign,
      origin: "Astrología hellenística",
      tradition: "Basada en la fusión de la astrología babilónica con la filosofía griega (siglo I d.C.).",
      icon: "⭐",
    },
    {
      field: "Animal zodiacal",
      value: chineseZodiac,
      origin: "Zodíaco chino",
      tradition: "Sistema de 12 animales y 5 elementos documentado en textos imperiales chinos (siglo V).",
      icon: "🐉",
    },
    {
      field: "Elemento",
      value: element,
      origin: "Zodíaco chino — sistema de 5 elementos",
      tradition: "Los 5 elementos (Madera, Fuego, Tierra, Metal, Agua) ciclan en combinación con los 12 animales.",
      icon: "🔥",
    },
    {
      field: "Expresión Number",
      value: String(expressionNumber ?? "—"),
      origin: "Numerología del nombre",
      tradition: "Cada letra del nombre tiene un valor numérico según la tabla pitagórica.",
      icon: "✏️",
    },
    {
      field: "Soul Number",
      value: String(soulNumber ?? "—"),
      origin: "Numerología del nombre",
      tradition: "Basado en las vocales del nombre, representa el deseo interior.",
      icon: "💫",
    },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        <motion.div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-border" aria-hidden="true" />
            <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Fuentes del conocimiento</h2>
          </div>
          <p className="text-sm text-muted max-w-xl leading-relaxed">
            Cada dato de tu perfil viene de una tradición cultural específica.
          </p>
        </motion.div>

        <motion.div {...staggerApple} className="space-y-3">
          {sources.map((source, i) => (
            <motion.div
              key={source.field}
              {...staggerItemSmooth}
              transition={{ delay: staggerDelay(i, 0.06), duration: 0.3 }}
              className="p-4 rounded-md border border-border bg-card shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">{source.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{source.field}</span>
                    <span className="text-xs text-muted">=</span>
                    <span className="text-sm font-semibold text-foreground">{source.value}</span>
                  </div>
                  <p className="text-[10px] text-accent mb-1">{source.origin}</p>
                  <p className="text-[10px] text-muted leading-relaxed">{source.tradition}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
