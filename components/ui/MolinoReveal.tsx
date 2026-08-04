"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks/useSafeReducedMotion";
import type { ReactNode } from "react";
import type { UserProfile } from "@/types/user";

interface MolinoRevealProps {
  profile: UserProfile;
  children: ReactNode;
}

/**
 * Portada de identidad del reveal post-pago. Se monta justo cuando
 * BuildingMolino termina y la lectura real está lista: en vez de que el
 * contenido aparezca con un fade plano, la lectura abre con una portada
 * sobria — símbolo, nombre, fecha y signo cuando existen en el perfil —
 * seguida de mucho espacio negativo y la entrada progresiva del contenido.
 *
 * Solo usa datos reales del perfil: name (opcional), birthDate,
 * sunSignInfo.symbol / chineseZodiacInfo.emoji y sunSignInfo.sign·element.
 * No se inventa ningún dato: cada bloque se omite si el campo no existe.
 *
 * Todo el motion se desactiva con prefers-reduced-motion (useReducedMotion);
 * la secuencia es puramente presentación — no cambia props ni contrato.
 */
const READING_DELAY_MS = 1100;

function formatBirthDate(value: string | undefined): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return "";
  return `${match[3]}.${match[2]}.${match[1]}`;
}

export default function MolinoReveal({ profile, children }: MolinoRevealProps) {
  const reduceMotion = useSafeReducedMotion();
  const sec = (ms: number) => (reduceMotion ? 0 : ms / 1000);

  const symbol = profile.sunSignInfo?.symbol || profile.chineseZodiacInfo?.emoji || "";
  const name = typeof profile.name === "string" && profile.name.trim() ? profile.name.trim() : "";
  const formattedDate = formatBirthDate(profile.birthDate);
  const sign = profile.sunSignInfo?.sign || "";
  const element = profile.sunSignInfo?.element || profile.element || "";
  const signDetail = [sign, element].filter(Boolean).join(" · ");

  return (
    <div>
      {/* Portada — identidad de la lectura, centrada y con aire */}
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        variants={{ hidden: {}, show: {} }}
        className="flex flex-col items-center pt-10 text-center sm:pt-14"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: sec(400), ease: "easeOut" } },
          }}
          className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-accent"
        >
          Lectura completa
        </motion.p>

        {symbol && (
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.92 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: sec(700), ease: "easeOut", delay: sec(100) },
              },
            }}
            className="mt-8 text-5xl leading-none text-accent/60 sm:mt-10 sm:text-6xl"
            aria-hidden="true"
          >
            {symbol}
          </motion.span>
        )}

        <motion.h3
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: sec(550), ease: "easeOut", delay: sec(400) } },
          }}
          className="mt-6 text-balance font-display text-2xl uppercase leading-[1.1] tracking-tight text-foreground sm:text-3xl"
        >
          {name ? `El mapa de ${name}` : "Tu mapa"}
        </motion.h3>

        {(formattedDate || signDetail) && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: sec(500), ease: "easeOut", delay: sec(650) } },
            }}
            className="mt-4 flex flex-col items-center gap-2"
          >
            {formattedDate && (
              <p className="font-mono text-xs tracking-[0.22em] text-muted">{formattedDate}</p>
            )}
            {signDetail && (
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-muted/70">
                {signDetail}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          variants={{
            hidden: { scaleX: 0 },
            show: { scaleX: 1, transition: { duration: sec(500), ease: "easeOut", delay: sec(850) } },
          }}
          className="mt-8 h-px w-16 bg-accent sm:mt-10"
          style={{ transformOrigin: "center" }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Lectura — entra una vez que la portada se asentó */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: sec(500), ease: "easeOut", delay: sec(READING_DELAY_MS) }}
        className="mt-10 sm:mt-14"
      >
        {children}
      </motion.div>
    </div>
  );
}
