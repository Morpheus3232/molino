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
    <section className="relative py-20 sm:py-32 px-4 sm:px-8 bg-paper overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-ink leading-tight">
              {isReturningUser ? "Tu mapa te espera." : "¿Listo para ver tu patrón?"}
            </h2>
            <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed font-light">
              {isReturningUser
                ? "Volvé cuando quieras a tu lectura completa, ciclos y decisiones."
                : "Toma 30 segundos. Sin registro. Sin guardar datos."}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href={isReturningUser ? "/profile" : "#mapa-form"}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-accent text-paper rounded-lg font-heading font-bold uppercase tracking-[0.1em] text-lg transition-all duration-200 hover:bg-accent/90 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-[0_4px_25px_rgba(154,74,24,0.25)] hover:shadow-[0_6px_35px_rgba(154,74,24,0.35)] group"
            >
              {isReturningUser ? "Ver mi mapa" : "Descubrir"}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.p variants={itemVariants} className="font-mono text-xs text-muted/70 tracking-wide">
            {isReturningUser ? (
              <>
                <Link href="/ejemplo" className="text-accent hover:underline underline-offset-2">
                  Ver ejemplo interactivo
                </Link>
              </>
            ) : (
              <>
                Gratis · Sin tracking ·{" "}
                <Link href="/ejemplo" className="text-accent hover:underline underline-offset-2">
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
