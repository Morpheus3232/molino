"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/utils/motion";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import type { UserProfile } from "@/types/user";

export default function CTAFinal() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  const isReturningUser = mounted && Boolean(profile?.birthDate);

  return (
    <section className="bg-accent/[0.05] border-t border-ink/10 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-8 lg:px-12 text-center">
        <motion.h2 {...fadeUp} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[0.9] mb-3">
          {isReturningUser ? "Tu mapa ya te está esperando." : "Tu claridad está a un clic."}
        </motion.h2>

        <motion.p {...fadeUp} className="text-base sm:text-lg text-muted/70 leading-relaxed mb-8 max-w-md mx-auto">
          {isReturningUser
            ? "Volvé a ver tu lectura completa, tus ciclos y tus afinidades."
            : "Ingresá tu fecha de nacimiento y recibí tu mapa personal en segundos."}
        </motion.p>

        <motion.div {...fadeUp} className="flex justify-center mb-3">
          <Button variant="accent" size="lg" asChild className="w-[90%] sm:w-auto">
            <Link href={isReturningUser ? "/profile" : "/onboarding"}>
              {isReturningUser ? "Ver mi mapa" : "Generá tu mapa"}
            </Link>
          </Button>
        </motion.div>

        <motion.p {...fadeUp} className="font-mono text-xs text-muted/70 tracking-wide">
          Gratis · Sin registro · Sin guardar datos
          {" · "}
          <Link href="/ejemplo" className="underline decoration-muted/40 underline-offset-2 hover:text-foreground hover:decoration-foreground transition-colors">
            Ver un ejemplo →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
