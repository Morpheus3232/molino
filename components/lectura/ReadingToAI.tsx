"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from "@/types/user";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";

/**
 * LECTURA → IA. El tercer nivel del producto, nombrado explícitamente al
 * cerrar la Lectura.
 *
 * Antes este puente no existía: `PremiumChatSection` se montaba DENTRO de la
 * rama de `interpretation`, así que un lector sin acceso terminaba la Lectura
 * en el catálogo de afinidades y un CTA de regalo, sin enterarse nunca de que
 * Molino tiene una capa de diálogo. La secuencia del producto —síntesis →
 * tensiones → ahora preguntá— se cortaba justo antes del último paso.
 *
 * Ahora se muestra a todos, con el estado dicho de frente:
 *  - con acceso: la conversación ya está arriba, esto es el puntero a su
 *    espacio propio (/ai) para volver otro día.
 *  - sin acceso: qué es la IA y qué la hace distinta de un chatbot, con
 *    ejemplos reales. Sin urgencia fabricada.
 */
const EJEMPLOS = [
  "Estoy por cambiar de trabajo. ¿Qué de mi mapa conviene tener en cuenta?",
  "¿Por qué me cuesta terminar lo que empiezo?",
  "Tengo una discusión repetida con alguien. ¿Qué dice mi mapa sobre cómo la encaro?",
];

export default function ReadingToAI({
  profile,
  hasAccess,
}: {
  profile: UserProfile;
  hasAccess: boolean;
}) {
  const reduceMotion = useSafeReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
      className="mt-20 sm:mt-24 border-t border-ink/10 pt-12"
      aria-labelledby="ia-bridge-title"
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
        {hasAccess ? "El tercer paso" : "Después de la lectura"}
      </p>
      <h2
        id="ia-bridge-title"
        className="mt-3 font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[0.95] tracking-tight text-foreground uppercase"
      >
        Ya sabés qué dice tu mapa.
        <br />
        Ahora preguntale.
      </h2>
      <p className="mt-5 max-w-xl text-base text-muted leading-relaxed">
        {hasAccess ? (
          <>
            La conversación de arriba vive también en su propio espacio: entrás con el mapa
            ya cargado, sin volver a leer todo esto. Las mismas preguntas, cuando aparezcan.
          </>
        ) : (
          <>
            No es un chatbot al que le tenés que explicar quién sos. Entra sabiendo tu mapa
            completo —patrones, cruces entre sistemas, tensiones y también lo que no se
            puede afirmar de vos— y responde una situación concreta leída a través de esa
            estructura.
          </>
        )}
      </p>

      {!hasAccess && (
        <ul className="mt-8 space-y-3 max-w-xl">
          {EJEMPLOS.map((q) => (
            <li key={q} className="flex items-start gap-3 text-sm text-foreground leading-relaxed">
              <span className="w-3 h-px bg-accent mt-[0.7em] shrink-0" aria-hidden="true" />
              {q}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/ai"
        className="mt-9 inline-flex items-center gap-2 px-6 py-3.5 rounded-[--radius-md] font-heading text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent bg-accent text-accent-foreground hover:bg-accent-hover"
      >
        {hasAccess ? "Abrir Preguntale a tu Molino" : "Ver cómo funciona"}
        <span aria-hidden="true">→</span>
      </Link>
    </motion.section>
  );
}
