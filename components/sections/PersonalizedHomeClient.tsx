"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getOrCreateProfile } from "@/lib/hooks/useProfile";
import type { UserProfile } from "@/types/user";

/* ═══ Personalized home (with profile) — Client Island ═══ */

export default function PersonalizedHomeClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(getOrCreateProfile());
  }, []);

  if (!mounted) return null;
  if (!profile) return null;

  return (
    <section className="border-t border-ink/10">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        <p className="label-micro mb-6">Ya conocés tu mapa. Entrá por donde quieras.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
          <Link href="/profile" className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors">
            <p className="font-mono text-xs tracking-[0.2em] text-muted mb-3 uppercase">01</p>
            <p className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Tu identidad</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">Tu código, tu elemento y tu animal.</p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              VER MI MAPA
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </span>
          </Link>
          <Link href="/profile?tab=world" className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors">
            <p className="font-mono text-xs tracking-[0.2em] text-muted mb-3 uppercase">02</p>
            <p className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Tu mundo</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">Países, ciudades y marcas que resuenan contigo.</p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              EXPLORAR AFINIDADES
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </span>
          </Link>
          <Link href="/profile?tab=circle" className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors">
            <p className="font-mono text-xs tracking-[0.2em] text-muted mb-3 uppercase">03</p>
            <p className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Tu círculo</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">Compatibilidad con otras personas.</p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              VER COMPATIBILIDADES
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </span>
          </Link>
          <Link href="/profile?tab=reading" className="group block p-6 sm:p-8 bg-background hover:bg-ink/[0.02] transition-colors sm:col-span-3">
            <p className="font-mono text-xs tracking-[0.2em] text-muted mb-3 uppercase">04</p>
            <p className="font-heading uppercase text-xl font-semibold text-foreground group-hover:text-accent transition-colors">Tu lectura completa</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">Síntesis de todos los sistemas: quién sos, tu momento y tu timing.</p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              LEER SÍNTESIS
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
