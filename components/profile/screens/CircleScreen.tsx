"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { getRelationshipMap, getRelation, type Animal } from "@/lib/data/animalRelations";
import { getFamousByAnimal, getFamousBySign, type FamousPerson } from "@/lib/data/famousPeople";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import EditorialSection from "@/components/ui/EditorialSection";
import type { ProfileTab } from "@/components/profile/ProfileTabs";

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
          CÍRCULO DE ALIADOS — negro full-bleed
          ═══════════════════════════════════════════════ */}
      <EditorialSection
        tone="ink"
        eyebrow="TUS ALIADOS ZODIACALES"
        title={<>QUIÉN TIENE<br />ARMONÍA CON VOS.</>}
        intro={
          <>
            Estos animales tienen mayor armonía con tu{" "}
            <span className="text-paper font-medium">{display.name}</span> según la tradición.
          </>
        }
        texture="circle"
      >
        <motion.div {...staggerApple} className="pt-10">
          <div className="flex flex-col items-center">
            <motion.div
              {...staggerItemSmooth}
              className="w-20 h-20 rounded-md border-2 border-accent flex items-center justify-center mb-3"
            >
              <span className="text-3xl">{display.emoji}</span>
            </motion.div>
            <p className="font-display text-lg text-paper mb-8">{display.name}</p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {relationMap.friends.filter(f => f.type === 'triad').slice(0, 2).map((rel) => {
                const relDisplay = getZodiacDisplay(rel.animal);
                return (
                  <motion.div
                    key={rel.animal}
                    {...staggerItemSmooth}
                    className="flex flex-col items-center p-4 rounded-md border border-paper/15 bg-paper/[0.03]"
                  >
                    <span className="text-2xl mb-1">{relDisplay.emoji}</span>
                    <p className="text-xs font-medium text-paper text-center">{relDisplay.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-accent-light text-center mt-1">Aliado</p>
                  </motion.div>
                );
              })}
              {relationMap.challenging.slice(0, 1).map((rel) => {
                const relDisplay = getZodiacDisplay(rel.animal);
                return (
                  <motion.div
                    key={rel.animal}
                    {...staggerItemSmooth}
                    className="flex flex-col items-center p-4 rounded-md border border-paper/15 bg-paper/[0.03]"
                  >
                    <span className="text-2xl mb-1">{relDisplay.emoji}</span>
                    <p className="text-xs font-medium text-paper text-center">{relDisplay.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-paper/50 text-center mt-1">Oposición</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-paper/50 italic text-center mt-8">
            Signos tradicionalmente asociados con mayor armonía y sintonía.
          </p>
        </motion.div>
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
            {sameAnimalFamous.map((person, i) => (
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
            {sameSignFamous.map((person, i) => (
              <FamousPersonCard key={person.name} person={person} index={i} userAnimal={userAnimal} inverse />
            ))}
          </div>
        </EditorialSection>
      )}

      {/* ═══════════════════════════════════════════════
          CONTRASTES
          ═══════════════════════════════════════════════ */}
      {relationMap.challenging.length > 0 && (
        <EditorialSection
          tone="paperAlt"
          eyebrow="ENERGÍAS OPUESTAS"
          title="TENSIÓN QUE ENSEÑA."
          intro={
            <>
              Estos animales presentan mayor tensión con tu{" "}
              <span className="text-foreground font-medium">{display.name}</span>. No son
              &ldquo;malos&rdquo;, son oportunidades de aprendizaje.
            </>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-8">
            {relationMap.challenging.map((rel) => {
              const relDisplay = getZodiacDisplay(rel.animal);
              return (
                <motion.div
                  key={rel.animal}
                  {...staggerItemSmooth}
                  className="p-4 rounded-md border border-border bg-card shadow-sm text-center"
                >
                  <span className="text-2xl block mb-1">{relDisplay.emoji}</span>
                  <p className="text-sm font-medium text-foreground">{relDisplay.name}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted mt-1">Contraste</p>
                </motion.div>
              );
            })}
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
  const animalDisplay = getZodiacDisplay(person.animal);
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
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">{animalDisplay.emoji}</span>
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
