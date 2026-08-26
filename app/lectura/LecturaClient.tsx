"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { profileFromEncoded } from "@/lib/utils/profileShare";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import LaLecturaExperience from "./LaLecturaExperience";
import LecturaGratis from "@/components/lectura/LecturaGratis";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import type { Animal } from "@/lib/data/animalRelations";

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

  const display = getZodiacDisplay((profile.chineseZodiac ?? "") as Animal);
  const elemento =
    typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";

  return (
    <main id="main-content" className="min-h-screen bg-background">
      {/* Encabezado de la página. Antes /lectura entraba directo al bloque
          pago; ahora abre con lo gratis, así que necesita decir de quién es
          la lectura y de dónde viene. */}
      <header className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-12 border-b border-ink/10">
        <Link
          href="/profile"
          className="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors"
        >
          ← Mi Mapa
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">La lectura</p>
        <h1 className="mt-2 font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.88] tracking-tight text-foreground uppercase">
          ¿QUÉ SIGNIFICA
          <br />
          TU MAPA?
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted leading-relaxed">
          Mi Mapa te dice dónde tu signo toca el mundo. Acá se lee qué dice de vos: los dígitos de
          tu fecha, dónde coinciden tus sistemas y qué sale de cruzarlos.
        </p>
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm text-muted">
          <span>Camino de vida {profile.lifePath}</span>
          <span className="w-px h-4 bg-ink/10" aria-hidden="true" />
          <span>{profile.sunSign}</span>
          <span className="w-px h-4 bg-ink/10" aria-hidden="true" />
          <span>
            {display.name}
            {elemento ? ` de ${elemento}` : ""}
          </span>
        </p>
      </header>

      <LecturaGratis profile={profile} />
      <LaLecturaExperience profile={profile} catalog={catalog} />
    </main>
  );
}
