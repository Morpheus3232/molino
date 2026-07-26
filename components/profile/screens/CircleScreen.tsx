"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils/motion";
import type { UserProfile } from "@/types/user";
import { getZodiacDisplay, formatAnimalSimple } from "@/lib/utils/zodiacDisplay";
import { getRelationshipMap, getRelation, type Animal } from "@/lib/data/animalRelations";
import { getFamousByAnimal, getFamousBySign, type FamousPerson } from "@/lib/data/famousPeople";
import { smoothReveal, staggerApple, staggerItemSmooth, staggerDelay } from "@/lib/utils/premiumMotion";
import CrossLinks from "@/components/profile/CrossLinks";
import type { ProfileTab } from "@/components/profile/ProfileTabs";

interface CircleScreenProps {
  profile: UserProfile;
  onNavigate?: (tab: ProfileTab) => void;
}

export default function CircleScreen({ profile, onNavigate }: CircleScreenProps) {
  const router = useRouter();
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
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-medium mb-3">Tu Círculo</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Las energías que te rodean
            </h1>
            <p className="text-base text-muted mt-4 max-w-xl leading-relaxed">
              Aliados, contrastes y personas que comparten tu energía de{" "}
              <span className="font-medium text-foreground">{display.name}</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CÍRCULO DE ALIADOS — Animal relationships
          ═══════════════════════════════════════════════ */}
      <section className="py-8 sm:py-12 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <motion.div {...smoothReveal}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-border" aria-hidden="true" />
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Tus aliados zodiacales</h2>
            </div>
            <p className="text-sm text-muted max-w-xl leading-relaxed">
              Estos animales tienen mayor armonía con tu <span className="font-medium text-foreground">{display.name}</span> según la tradición.
            </p>
          </motion.div>

          <motion.div {...staggerApple} className="mt-6">
            <div className="flex flex-col items-center">
              <motion.div
                {...staggerItemSmooth}
                className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center mb-3"
              >
                <span className="text-3xl">{display.emoji}</span>
              </motion.div>
              <p className="font-serif text-lg font-semibold text-foreground mb-5">{display.name}</p>

              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                {relationMap.friends.map((rel) => {
                  const relDisplay = getZodiacDisplay(rel.animal);
                  return (
                    <motion.div
                      key={rel.animal}
                      {...staggerItemSmooth}
                      className="flex flex-col items-center p-3 rounded-xl border border-border bg-background/50"
                    >
                      <span className="text-2xl mb-1">{relDisplay.emoji}</span>
                      <p className="text-xs font-medium text-foreground text-center">{relDisplay.name}</p>
                      <p className="text-[9px] text-muted text-center mt-0.5">
                        {rel.type === "triad" ? "Tríada" : "Armonía"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div {...smoothReveal} className="mt-4 text-center">
            <p className="text-xs text-muted/60 italic">
              Signos tradicionalmente asociados con mayor armonía y sintonía.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FAMOSOS DEL MISMO ANIMAL — People like you
          ═══════════════════════════════════════════════ */}
      {sameAnimalFamous.length > 0 && (
        <section className="py-8 sm:py-12 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">
                  Famosos {display.name}
                </h2>
              </div>
              <p className="text-sm text-muted mb-6 max-w-xl">
                Personas nacidas en el mismo animal zodiacal chino, aunque sean de otros años.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sameAnimalFamous.map((person, i) => (
                <FamousPersonCard key={person.name} person={person} index={i} userAnimal={userAnimal} router={router} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          CÍRCULO OCCIDENTAL — Same Western sign
          ═══════════════════════════════════════════════ */}
      {sameSignFamous.length > 0 && (
        <section className="py-8 sm:py-12 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">
                  Círculo Occidental — {userSunSign}
                </h2>
              </div>
              <p className="text-sm text-muted mb-6 max-w-xl">
                Personas del mismo signo zodiacal occidental.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sameSignFamous.map((person, i) => (
                <FamousPersonCard key={person.name} person={person} index={i} userAnimal={userAnimal} router={router} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          CONTRASTES — Challenging animals
          ═══════════════════════════════════════════════ */}
      {relationMap.challenging.length > 0 && (
        <section className="py-8 sm:py-12 border-t border-border">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <motion.div {...smoothReveal}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-px bg-border" aria-hidden="true" />
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">Energías de contraste</h2>
              </div>
              <p className="text-sm text-muted mb-6 max-w-xl">
                Estos animales presentan mayor tensión con tu <span className="font-medium text-foreground">{display.name}</span>. No son &ldquo;malos&rdquo;, son oportunidades de aprendizaje.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relationMap.challenging.map((rel) => {
                const relDisplay = getZodiacDisplay(rel.animal);
                return (
                  <motion.div
                    key={rel.animal}
                    {...staggerItemSmooth}
                    className="p-4 rounded-xl border border-border bg-card text-center"
                  >
                    <span className="text-2xl block mb-1">{relDisplay.emoji}</span>
                    <p className="text-sm font-medium text-foreground">{relDisplay.name}</p>
                    <p className="text-[9px] text-muted mt-0.5">Contraste</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-8 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <motion.div {...smoothReveal}>
            <div className="p-4 rounded-xl border border-accent/20 bg-accent/[0.03]">
              <p className="text-xs text-muted leading-relaxed">
                Las relaciones zodiacales se basan en tradiciones culturales del zodíaco chino.
                Son interpretaciones simbólicas, no predicciones. Cada relación es una oportunidad de aprendizaje.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cross-links */}
      {onNavigate && (
        <CrossLinks
          links={[
            { label: "Descubrí qué resuena con vos", description: "Marcas, destinos y entidades que conectan con tu perfil.", onClick: () => onNavigate("world") },
            { label: "Explorá tu mapa profundo", description: "Síntesis, patrones y dimensiones de tu perfil.", onClick: () => onNavigate("intelligence") },
            { label: "Volvé a tu identidad", description: "Revisá tu perfil base y arquetipo.", onClick: () => onNavigate("identity") },
          ]}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   FAMOUS PERSON CARD
   ════════════════════════════════════════════════════ */

function FamousPersonCard({ person, index, userAnimal, router }: { person: FamousPerson; index: number; userAnimal: Animal; router: ReturnType<typeof useRouter> }) {
  const animalDisplay = getZodiacDisplay(person.animal);
  const relation = getRelation(userAnimal, person.animal as Animal);
  const isChallenging = relation.type === "clash" || relation.type === "harm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="p-4 rounded-xl border border-border bg-card"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{person.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base font-semibold text-foreground truncate">{person.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">{animalDisplay.emoji}</span>
            <p className="text-xs text-muted">{person.animal} · {person.year}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted">{person.field} · {person.country}</span>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/conocimiento/zodiaco-chino/${person.animal.toLowerCase()}`)}
            className="mt-2 text-[10px] text-accent hover:underline"
          >
            {isChallenging ? `Explorar contraste con ${person.animal}` : `Explorar afinidad con ${person.animal}`} →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
