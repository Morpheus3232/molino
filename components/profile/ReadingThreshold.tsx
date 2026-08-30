"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { buildSynthesis } from "@/lib/engines/synthesisEngine";
import { encodeProfileData } from "@/lib/utils/profileShare";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";

/**
 * EL UMBRAL — el paso de MAPA (estructura) a LECTURA (síntesis).
 *
 * Antes, la Lectura era la primera fila de un índice plano de cuatro links,
 * al mismo nivel que "Círculo": el centro intelectual del producto presentado
 * como una utilidad más. El mapa terminaba y simplemente seguían más tarjetas.
 *
 * Este bloque hace el corte explícito y, sobre todo, PERSONAL: no promete
 * profundidad en abstracto, muestra lo que el motor determinista YA encontró
 * en este mapa concreto (cuántos cruces reales entre sistemas, cuántas
 * tensiones estructurales, qué sistemas se cruzan). Si no encontró nada, lo
 * dice — no se fabrica un gancho.
 *
 * Es el único bloque invertido de /profile, igual que "el punto ciego" es el
 * único invertido de /lectura: superficie invertida = "acá pasa algo", en las
 * dos páginas el mismo idioma.
 *
 * Fuente única: `buildSynthesis` (el mismo modelo que consumen la Lectura y la
 * IA). Acá solo se lee — no se re-deriva nada.
 */
export default function ReadingThreshold({ profile }: { profile: UserProfile }) {
  const reduceMotion = useSafeReducedMotion();

  const synth = useMemo(() => {
    try {
      return buildSynthesis(profile);
    } catch {
      return null;
    }
  }, [profile]);

  if (!synth) return null;

  const crossings = synth.convergences.length;
  const tensions = synth.tensions.length;
  const systems = synth.systemsEngaged;

  // El titular sale de lo que REALMENTE tiene este mapa. Tres estados, ninguno
  // inventado: hay cruces, hay solo tensión, o no hay ni una cosa ni la otra.
  const headline =
    crossings > 0
      ? { top: "Tus sistemas", bottom: "coinciden en algo." }
      : tensions > 0
        ? { top: "Tus sistemas", bottom: "no se ponen de acuerdo." }
        : { top: "El mapa está.", bottom: "Falta leerlo." };

  const facts: { n: number; label: string }[] = [
    { n: crossings, label: crossings === 1 ? "cruce entre sistemas" : "cruces entre sistemas" },
    { n: tensions, label: tensions === 1 ? "tensión estructural" : "tensiones estructurales" },
    { n: synth.patterns.length, label: synth.patterns.length === 1 ? "patrón" : "patrones" },
  ];

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
      className="section-dark section-full-bleed mt-20 lg:mt-28"
      aria-labelledby="umbral-title"
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-light">
              Hasta acá, la estructura
            </p>
            <h2
              id="umbral-title"
              className="mt-4 font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[0.92] tracking-tight text-paper uppercase"
            >
              {headline.top}
              <br />
              {headline.bottom}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-paper/70">
              El mapa te mostró qué hay: tus coordenadas y dónde tocan el mundo. La Lectura
              es lo otro — qué pasa cuando esas piezas se leen juntas, dónde se refuerzan,
              dónde se contradicen y qué queda fuera de lo que Molino puede afirmar.
            </p>

            <Link
              href={`/lectura#${encodeProfileData(profile)}`}
              className="mt-9 inline-flex items-center gap-2 px-6 py-3.5 rounded-[--radius-md] bg-accent text-accent-foreground font-heading text-xs sm:text-sm uppercase tracking-wider font-bold hover:bg-accent-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light"
            >
              Leer mi mapa
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Lo que el motor ya encontró en ESTE mapa. Números reales, no una
              promesa de valor. */}
          <div className="lg:pt-2">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40 mb-1">
              Lo que ya se calculó
            </p>
            <ul className="border-t border-paper/15">
              {facts.map((f) => (
                <li
                  key={f.label}
                  className="flex items-baseline justify-between gap-6 py-4 border-b border-paper/15"
                >
                  <span className="text-sm text-paper/70">{f.label}</span>
                  <span
                    className={`font-display text-3xl sm:text-4xl tabular-nums leading-none ${
                      f.n > 0 ? "text-accent-light" : "text-paper/25"
                    }`}
                  >
                    {f.n}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs leading-relaxed text-paper/50">
              {systems.length > 1 ? (
                <>
                  Se cruzan <span className="text-paper/80">{systems.join(", ")}</span>. La
                  Lectura explica la mecánica de cada cruce.
                </>
              ) : crossings === 0 && tensions === 0 ? (
                <>
                  En este mapa los tres sistemas apuntan a lugares distintos y no chocan
                  entre sí. La Lectura trabaja con eso: no todo perfil converge, y forzar una
                  coincidencia sería inventarla.
                </>
              ) : (
                <>
                  La Lectura explica la mecánica de lo que se encontró, y dice con todas las
                  letras lo que no se puede afirmar de vos.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
