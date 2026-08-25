"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { profileFromEncoded } from "@/lib/utils/profileShare";
import LaLecturaExperience from "./LaLecturaExperience";

interface Props {
  catalog: LightweightEntity[];
}

// El perfil viaja en el fragmento (#), nunca en la query string — un
// fragmento no sale del navegador (no llega al servidor ni a logs), mismo
// esquema que /profile#<hash>. Por eso esto es un client component: leer
// location.hash solo es posible después del mount.
export default function LecturaClient({ catalog }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const fromHash = hash ? profileFromEncoded(hash) : null;
    setProfile(fromHash);
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

  return <LaLecturaExperience profile={profile} catalog={catalog} />;
}
