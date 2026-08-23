"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import type { UserProfile } from "@/types/user";

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function CTASection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  const isReturningUser = mounted && Boolean(profile?.birthDate);

  return (
    <section className="relative py-24 sm:py-40 px-4 sm:px-8 bg-ink">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
          className="space-y-10"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <p className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-paper/50">
              <span className="inline-block h-px w-8 bg-accent/40" aria-hidden="true" />
              Empezá ahora
              <span className="inline-block h-px w-8 bg-accent/40" aria-hidden="true" />
            </p>

            <h2 className="font-display font-normal normal-case tracking-tight text-paper leading-[0.98] text-[clamp(2.75rem,6vw,4.5rem)]">
              {isReturningUser ? (
                <>
                  Tu mapa te <em className="text-gradient-warm-dark">espera.</em>
                </>
              ) : (
                <>
                  Tu patrón ya existe.
                  <span className="block italic text-gradient-warm-dark">Veni a verlo.</span>
                </>
              )}
            </h2>

            <p className="text-lg sm:text-xl text-paper/70 leading-relaxed">
              {isReturningUser
                ? "Volvé cuando quieras a tu lectura completa, ciclos y decisiones."
                : "Toma 30 segundos. Sin registro. Tu fecha no se envía a ningún servidor."}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href={isReturningUser ? "/profile" : "#mapa-form"}
              className="group inline-flex items-center justify-center gap-3 px-12 py-5 bg-accent text-paper rounded-lg font-heading font-bold uppercase tracking-[0.1em] text-lg transition-colors duration-200 hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {isReturningUser ? "Ver mi mapa" : "Descubrir"}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.p variants={itemVariants} className="font-mono text-xs text-paper/50 tracking-wide">
            {isReturningUser ? (
              <>
                <Link href="/ejemplo" className="text-accent-light hover:underline underline-offset-2">
                  Ver ejemplo interactivo
                </Link>
              </>
            ) : (
              <>
                Gratis · Sin tracking ·{" "}
                <Link href="/ejemplo" className="text-accent-light hover:underline underline-offset-2">
                  Ver ejemplo
                </Link>
              </>
            )}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
