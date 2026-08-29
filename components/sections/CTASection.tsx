"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import type { UserProfile } from "@/types/user";

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
        <div className="space-y-10">
          <div className="space-y-6">
            <p className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-paper/50">
              <span className="inline-block h-px w-8 bg-accent/40" aria-hidden="true" />
              Empezá ahora
              <span className="inline-block h-px w-8 bg-accent/40" aria-hidden="true" />
            </p>

            <h2 className="font-display font-normal normal-case tracking-tight text-paper leading-[0.98] text-[clamp(2.75rem,6vw,4.5rem)]">
              {isReturningUser ? (
                <>
                  Seguí donde{" "}
                  <em className="text-gradient-warm-dark">lo dejaste.</em>
                </>
              ) : (
                <>
                  Tu patrón ya existe.
                  <span className="block italic text-gradient-warm-dark">Vení a verlo.</span>
                </>
              )}
            </h2>

            <p className="text-lg sm:text-xl text-paper/70 leading-relaxed">
              {isReturningUser
                ? "Tu lectura completa, tus ciclos y tus afinidades, cuando quieras."
                : "Treinta segundos y ya lo estás leyendo."}
            </p>
          </div>

          <div>
            <Link
              href={isReturningUser ? "/profile" : "#mapa-form"}
              className="group inline-flex items-center justify-center gap-3 px-12 py-5 bg-accent text-paper rounded-lg font-heading font-bold uppercase tracking-[0.1em] text-lg transition-colors duration-200 hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {isReturningUser ? "Ver mi mapa" : "Descubrir"}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {!isReturningUser && (
            <p className="font-mono text-xs text-paper/50 tracking-wide">
              <Link href="/ejemplo" className="text-accent-light hover:underline underline-offset-2">
                Ver un ejemplo primero
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
