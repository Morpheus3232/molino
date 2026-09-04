"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { profileFromEncoded } from "@/lib/utils/profileShare";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { PremiumActivationProvider } from "@/components/premium/PremiumActivationContext";
import LaLecturaExperience from "./LaLecturaExperience";

interface Props {
  catalog: LightweightEntity[];
}

// El perfil viaja en el fragmento (#) o en localStorage. Si el usuario entra
// directamente a /lectura (ej. redirect post-pago de Mercado Pago o navegación interna),
// cargamos su perfil guardado en el navegador sin fricción.
export default function LecturaClient({ catalog }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const fromHash = hash ? profileFromEncoded(hash) : null;
    if (fromHash) {
      setProfile(fromHash);
    } else {
      const stored = loadProfileFromStorage();
      if (stored) {
        setProfile(stored as UserProfile);
      }
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <p className="text-muted text-sm">
          Esta lectura necesita tu mapa. Volvé a{" "}
          <Link href="/profile" className="text-accent underline underline-offset-4">
            tu mapa
          </Link>{" "}
          para abrirla de nuevo.
        </p>
      </main>
    );
  }

  return (
    <PremiumActivationProvider>
      <main id="main-content" className="min-h-screen bg-background">
        <header className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-12 border-b border-ink/10">
          <Link
            href="/profile"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors"
          >
            ← Tu mapa
          </Link>
          <h1 className="mt-8 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[0.95] tracking-tight text-foreground uppercase">
            ¿Qué significa
            <br />
            tu mapa?
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted leading-relaxed">
            En tu mapa leés los dígitos de tu fecha, dónde coinciden tus
            sistemas y los dos movimientos. Acá cierra con la síntesis entre
            tus sistemas, la sincronicidad y una conversación abierta con tu
            mapa.
          </p>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/70">
            Tu lectura
          </p>
        </header>

        <LaLecturaExperience profile={profile} catalog={catalog} />
      </main>
    </PremiumActivationProvider>
  );
}
