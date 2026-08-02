"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { getRelationshipMap, getRelation, type Animal, type AnimalRelation } from "@/lib/data/animalRelations";
import { getFamousByAnimal, getFamousBySign, type FamousPerson } from "@/lib/data/famousPeople";
import { smoothReveal } from "@/lib/utils/premiumMotion";
import EditorialSection from "@/components/ui/EditorialSection";
import ZodiacMark from "@/components/ui/ZodiacMark";
import type { ProfileTab } from "@/components/profile/ProfileTabs";

/** Posiciones fijas (viewBox 0-100, calzan con % del contenedor) para la
 * composición radial: vos en el centro, aliados arriba, tensión abajo. */
const ALLY_SLOTS = [{ x: 24, y: 24 }, { x: 76, y: 24 }];
const TENSION_SLOTS = [{ x: 30, y: 84 }, { x: 70, y: 84 }];

interface CircleScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function CircleScreen({ profile, onNavigate }: CircleScreenProps) {
  const userAnimal = (profile.chineseZodiac ?? "") as Animal;
  const userSunSign = typeof profile.sunSign === "string" ? profile.sunSign : "";
  const userYear = parseInt(profile.birthDate?.split("-")[0] || "0", 10);

  const display = getZodiacDisplay(userAnimal);
  const relationMap = useMemo(() => getRelationshipMap(userAnimal), [userAnimal]);
  const allies: AnimalRelation[] = useMemo(() => relationMap.friends.slice(0, ALLY_SLOTS.length), [relationMap]);
  const tensions: AnimalRelation[] = useMemo(() => relationMap.challenging.slice(0, TENSION_SLOTS.length), [relationMap]);

  // Famous people of same animal (different years)
  const sameAnimalFamous = useMemo(
    () => getFamousByAnimal(userAnimal, userYear),
    [userAnimal, userYear]
  );

  // Famous people of same Western sign (different years)
  const sameSignFamous = useMemo(
    () => getFamousBySign(userSunSign, userYear),
    [userSunSign, userYear]
  );

  return (
    <div
      id="panel-circle"
      role="tabpanel"
      aria-labelledby="tab-circle"
    >
      {/* Hero */}
      <section className="py-12 sm:pt-16 pb-8">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...fadeUp}>
            <p className="font-mono text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-6">
              TU CÍRCULO
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] tracking-tight text-foreground">
              LAS ENERGÍAS
              <br />
              QUE TE RODEAN.
            </h1>
            <p className="text-base lg:text-lg text-muted mt-8 max-w-xl leading-relaxed">
              Aliados, opuestos y personas que comparten tu energía de{" "}
              <span className="font-medium text-foreground">{display.name}</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TU RED ZODIACAL — composición radial, no grid de cards.
          Vos en el centro; aliados arriba (armonía); tensión abajo
          (oposición). La relación se ve en la posición, no hay que leer
          un párrafo para entenderla.
          ═══════════════════════════════════════════════ */}
      <EditorialSection
        tone="ink"
        eyebrow="TU RED ZODIACAL"
        title="QUIÉN TE RODEA."
        texture="circle"
      >
        <div className="relative mx-auto max-w-sm aspect-square mt-6 mb-4">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {allies.map((rel, i) => (
              <line key={`line-ally-${rel.animal}`} x1="50" y1="50" x2={ALLY_SLOTS[i].x} y2={ALLY_SLOTS[i].y} stroke="var(--color-accent-light)" strokeWidth="0.4" opacity="0.5" />
            ))}
            {tensions.map((rel, i) => (
              <line key={`line-tension-${rel.animal}`} x1="50" y1="50" x2={TENSION_SLOTS[i].x} y2={TENSION_SLOTS[i].y} stroke="var(--color-paper)" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.3" />
            ))}
          </svg>

          <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
            <ZodiacMark animal={userAnimal} color="var(--color-accent)" size="md" showLabel={false} />
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-light text-center mt-2">Vos</p>
          </div>

          {allies.map((rel, i) => (
            <div
              key={rel.animal}
              className="absolute"
              style={{ left: `${ALLY_SLOTS[i].x}%`, top: `${ALLY_SLOTS[i].y}%`, transform: "translate(-50%,-50%)" }}
            >
              <ZodiacMark animal={rel.animal} color="var(--color-accent-light)" size="sm" showLabel={true} />
              <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-accent-light/60 text-center mt-1.5">Aliado</p>
            </div>
          ))}

          {tensions.map((rel, i) => (
            <div
              key={rel.animal}
              className="absolute"
              style={{ left: `${TENSION_SLOTS[i].x}%`, top: `${TENSION_SLOTS[i].y}%`, transform: "translate(-50%,-50%)" }}
            >
              <ZodiacMark animal={rel.animal} color="var(--color-paper)" size="sm" showLabel={true} />
              <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-paper/40 text-center mt-1.5">Tensión</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-paper/50 italic text-center max-w-sm mx-auto">
          Armonía y tensión según la tradición del zodíaco chino — no son predicciones.
        </p>
      </EditorialSection>

      {/* ═══════════════════════════════════════════════
          FAMOSOS DEL MISMO ANIMAL
          ═══════════════════════════════════════════════ */}
      {sameAnimalFamous.length > 0 && (
        <EditorialSection
          eyebrow="GENTE COMO VOS"
          title={<>FAMOSOS<br />{display.name.toUpperCase()}.</>}
          intro="Personas nacidas en el mismo animal zodiacal chino, aunque sean de otros años."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-8">
            {sameAnimalFamous.slice(0, 6).map((person, i) => (
              <FamousPersonCard key={person.name} person={person} index={i} userAnimal={userAnimal} />
            ))}
          </div>
        </EditorialSection>
      )}

      {/* ═══════════════════════════════════════════════
          CÍRCULO OCCIDENTAL — azul full-bleed
          ═══════════════════════════════════════════════ */}
      {sameSignFamous.length > 0 && (
        <EditorialSection
          tone="accent"
          eyebrow="CÍRCULO OCCIDENTAL"
          title={<>MISMO SIGNO,<br />{userSunSign.toUpperCase()}.</>}
          intro="Personas del mismo signo zodiacal occidental."
          texture="wave"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-8">
            {sameSignFamous.slice(0, 6).map((person, i) => (
              <FamousPersonCard key={person.name} person={person} index={i} userAnimal={userAnimal} inverse />
            ))}
          </div>
        </EditorialSection>
      )}

      {/* Disclaimer */}
      <section className="py-8 border-t border-ink/10">
        <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
          <motion.div {...smoothReveal}>
            <div className="p-4 rounded-md border border-accent/20 bg-accent/[0.03]">
              <p className="text-xs text-muted leading-relaxed">
                Las relaciones zodiacales se basan en tradiciones culturales del zodíaco chino.
                Son interpretaciones simbólicas, no predicciones. Cada relación es una oportunidad de aprendizaje.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   FAMOUS PERSON CARD
   ════════════════════════════════════════════════════ */

function FamousPersonCard({
  person,
  index,
  userAnimal,
  inverse = false,
}: {
  person: FamousPerson;
  index: number;
  userAnimal: Animal;
  /** Tarjeta sobre fondo de color (accent): texto claro. */
  inverse?: boolean;
}) {
  const relation = getRelation(userAnimal, person.animal as Animal);
  const isChallenging = relation.type === "clash" || relation.type === "harm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={
        inverse
          ? "p-4 rounded-md border border-paper/20 bg-paper/[0.06]"
          : "p-4 rounded-md border border-border bg-card shadow-sm"
      }
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{person.emoji}</span>
        <div className={`flex-1 min-w-0 ${inverse ? "text-paper" : ""}`}>
          <p className={`font-display text-base font-semibold truncate ${inverse ? "text-paper" : "text-foreground"}`}>
            {person.name}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <ZodiacMark animal={person.animal} color={inverse ? "var(--color-paper)" : "var(--color-accent)"} size="sm" showLabel={false} />
            <p className={`text-xs ${inverse ? "text-paper/70" : "text-muted"}`}>{person.animal} · {person.year}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs ${inverse ? "text-paper/60" : "text-muted"}`}>{person.field} · {person.country}</span>
          </div>
          <Link
            href={`/conocimiento/zodiaco-chino/${person.animal.toLowerCase()}`}
            className={`mt-2 inline-block text-xs hover:underline ${inverse ? "text-paper" : "text-accent"}`}
          >
            {isChallenging ? `Explorar contraste con ${person.animal}` : `Explorar afinidad con ${person.animal}`} →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
