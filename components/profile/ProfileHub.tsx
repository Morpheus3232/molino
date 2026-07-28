"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { buildPersonalRecommendations, hasPositiveAffinity } from "@/lib/engines/personalRecommendationEngine";
import { calculateDailyEnergy } from "@/lib/engines/dailyEnergyEngine";
import { getRelationshipMap, type Animal } from "@/lib/data/animalRelations";
import { ELEMENT_COLORS } from "@/lib/data/constants";
import { ARCHETYPES } from "@/lib/data";
import { safeNumber } from "@/lib/utils/score";
import { generateProfileHash, storeSharedProfile } from "@/lib/profile/hash";
import { toast } from "sonner";
import { emojiBounce, hoverEmoji } from "@/lib/utils/premiumMotion";
import type { ProfileTab } from "./ProfileTabs";
import { loadDiscoveryState } from "@/lib/storage/discovery";
import CrossLinks from "./CrossLinks";

interface ProfileHubProps {
  profile: UserProfile;
  onEnter?: (tab: ProfileTab) => void;
}

const colBorder = "border-accent/10";
const cellPad = "p-8 sm:p-10 lg:p-12";

export default function ProfileHub({ profile, onEnter }: ProfileHubProps) {
  const router = useRouter();
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const display = getZodiacDisplay(userAnimal);
  const element = typeof profile.element === "string" ? profile.element : "";
  const elementColor = ELEMENT_COLORS[element] || "var(--element-fire)";
  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const name = typeof profile.name === "string" ? profile.name : "";

  const recommendationMap = useMemo(() => buildPersonalRecommendations(profile), [profile]);
  const positiveRecs = useMemo(() => recommendationMap.recommendations.filter(r => hasPositiveAffinity(r.priority)), [recommendationMap]);

  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const sameFriends = relationMap.friends.filter(f => f.type === "triad").slice(0, 2);

  const discovery = loadDiscoveryState();
  const topRec = discovery.hasCompletedOnboarding ? positiveRecs[0] : null;

  const dailyEnergy = useMemo(() => calculateDailyEnergy(profile), [profile]);
  const intelligenceScore = dailyEnergy.overallScore;
  const intelligenceLabel = dailyEnergy.theme;

  const handleShareProfile = async () => {
    try {
      const hash = await generateProfileHash(profile);
      storeSharedProfile(profile, hash);
      const url = `${typeof window !== "undefined" ? window.location.origin : ""}/perfil/${hash}`;

      if (navigator.share) {
        await navigator.share({
          title: `${name} — Mi mapa en Molino`,
          text: "Descubrí mi mapa personal en Molino",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado", {
          description: "Compartí tu perfil con quien quieras",
        });
      }
    } catch {
      toast.error("No se pudo compartir el perfil");
    }
  };

  const sections = [
    {
      key: "identity" as ProfileTab,
      eyebrow: "Tu Identidad",
      title: `Tu arquetipo es ${archetype.name}`,
      subtitle: `Camino de Vida ${lifePath} · ${display.name} de ${profile.chineseZodiacInfo?.element ?? ""}`,
      detail: `${profile.sunSign} · ${profile.chineseZodiac}`,
    },
    {
      key: "circle" as ProfileTab,
      eyebrow: "Tu Círculo",
      title: sameFriends.length > 0
        ? `Tus aliados: ${sameFriends.map(f => f.animal).join(", ")}`
        : "Tus aliados definen tu círculo",
      subtitle: "Relaciones del ciclo chino",
      detail: sameFriends.length > 0 ? sameFriends.map(f => f.animal).join(" · ") : "",
    },
    {
      key: "world" as ProfileTab,
      eyebrow: "Tu Mundo",
      title: `${recommendationMap.recommendations.filter(r => r.entityAnimal === userAnimal).length} entidades conectan con tu perfil`,
      subtitle: "Marcas, historias y referentes que resuenan",
      detail: "",
    },
    {
      key: "intelligence" as ProfileTab,
      eyebrow: "Tu Inteligencia",
      title: `${intelligenceScore}/100 — ${intelligenceLabel}`,
      subtitle: "Estado actual de tu mapa simbólico",
      detail: "",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${elementColor}15, transparent 70%)` }} />
        <div className="relative mx-auto max-w-8xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-8"
            >
              Mi mapa personal
            </motion.p>

            <motion.div
              initial="initial"
              animate="animate"
              variants={emojiBounce}
              className="relative mb-6"
            >
              <div
                className="absolute inset-0 scale-[2] blur-3xl opacity-20 rounded-full"
                style={{ backgroundColor: elementColor }}
              />
              <motion.span
                className="relative block text-7xl sm:text-8xl lg:text-9xl leading-none select-none"
                role="img"
                aria-label={display.name}
                whileHover="animate"
                variants={hoverEmoji}
              >
                {display.emoji}
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]"
            >
              {name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-4 text-base sm:text-lg text-muted flex items-center gap-2 flex-wrap justify-center"
            >
              <span>{display.name} de {profile.chineseZodiacInfo?.element ?? ""}</span>
              <span className="w-1 h-1 rounded-full bg-muted/40" />
              <span>{profile.sunSign}</span>
              <span className="w-1 h-1 rounded-full bg-muted/40" />
              <span>Camino {lifePath}</span>
            </motion.p>

            <motion.button
              type="button"
              onClick={handleShareProfile}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-medium text-muted hover:text-foreground border border-border hover:border-foreground/30 transition-all"
              aria-label="Compartir perfil"
            >
              <Share2 className="h-3 w-3" />
              Compartir
            </motion.button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-8xl px-5 sm:px-8 lg:px-12 pb-20 sm:pb-24">
        <div className="flex flex-wrap border-t border-accent/10">
          {sections.map((section, i) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className={`w-full md:w-1/2 flex flex-col ${i % 2 === 0 ? `md:border-r ${colBorder}` : ""} border-b ${colBorder}`}
            >
              <div className={`flex-1 ${cellPad}`}>
                <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium mb-3">{section.eyebrow}</p>
                <p className="font-heading uppercase text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {section.title}
                </p>
                <p className="text-sm text-muted">{section.subtitle}</p>
                {section.detail && (
                  <p className="text-xs text-muted/60 mt-2">{section.detail}</p>
                )}
                {onEnter && (
                  <button
                    type="button"
                    onClick={() => onEnter(section.key)}
                    className="mt-4 text-xs font-medium text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1"
                  >
                    Explorar →
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {topRec && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="border-b border-accent/10"
          >
            <button
              type="button"
              onClick={() => router.push(`/affinity/${topRec.entity.type}/${topRec.entity.id}`)}
              className="w-full text-left px-5 sm:px-8 py-6 sm:py-8 group"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-accent font-medium mb-2">Tu próximo descubrimiento</p>
              <p className="text-sm text-foreground group-hover:text-accent transition-colors">
                {topRec.entity.name} resuena especialmente con tu energía de {display.name}.
              </p>
            </button>
          </motion.div>
        )}
      </div>

      {onEnter && (
        <div>
          <CrossLinks
            links={[
              { label: "Descubrí qué resuena con vos", description: "Marcas, destinos y entidades que conectan con tu perfil.", onClick: () => onEnter("world") },
              { label: "¿Quién comparte tu energía?", description: "Aliados, opuestos y personas de tu mismo signo.", onClick: () => onEnter("circle") },
              { label: "Explorá tu mapa profundo", description: "Síntesis, patrones y dimensiones de tu perfil.", onClick: () => onEnter("intelligence") },
            ]}
          />
        </div>
      )}
    </div>
  );
}
