"use client";
import { useL } from "@/lib/i18n/useL";

import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import type { UserProfile } from "@/types/user";
import type { LightweightEntity } from "@/types/atlas";
import { profileFromEncoded } from "@/lib/utils/profileShare";
import { loadProfileFromStorage } from "@/lib/session/localStorage";
import { PremiumActivationProvider } from "@/components/premium/PremiumActivationContext";
import LaLecturaExperience from "./LaLecturaExperience";
import MapWheel from "@/components/profile/MapWheel";
import { ARCHETYPES, archetypeDisplayName } from "@/lib/data";
import { getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { safeNumber } from "@/lib/utils/score";

interface Props {
  catalog: LightweightEntity[];
}

// El perfil viaja en el fragmento (#) o en localStorage. Si el usuario entra
// directamente a /lectura (ej. redirect post-pago de Mercado Pago o navegación interna),
// cargamos su perfil guardado en el navegador sin fricción.
export default function LecturaClient({ catalog }: Props) {
  const L = useL();
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
      <main id="main-content" className="min-h-[70vh] flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <p className="text-sm text-muted label-caps mb-4">{L("Mi lectura", "My reading")}</p>
          <h1 className="font-display text-4xl text-foreground leading-tight">{L("Primero, tu mapa", "First, your map")}</h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">{L("La lectura sale de tu fecha de nacimiento. Creá tu mapa en treinta segundos y volvé acá para leerlo.", "The reading comes from your date of birth. Create your map in thirty seconds and come back here to read it.")}</p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-vermilion text-paper text-sm font-bold label-caps hover:bg-vermilion-hover transition-colors"
          >{L("Crear mi mapa", "Create my map")}</Link>
        </div>
      </main>
    );
  }

  const lifePath = safeNumber(profile.lifePath, 1);
  const archetype = ARCHETYPES[lifePath] || ARCHETYPES[1];
  const animalName = getZodiacDisplay(profile.chineseZodiac ?? "").name;
  const chineseElement = typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";
  const coords = [
    { label: "Numerología", value: `${lifePath} · ${archetypeDisplayName(archetype.name)}`, href: "/profile#pilar-numerologia" },
    { label: "Astrología", value: `Sol en ${profile.sunSign}`, href: "/profile#pilar-astrologia" },
    { label: L("Zodíaco chino", "Chinese zodiac"), value: `${animalName}${chineseElement ? ` de ${chineseElement}` : ""}`, href: "/profile#pilar-zodiaco-chino" },
  ];

  return (
    <PremiumActivationProvider>
      <main id="main-content" className="min-h-screen bg-background">
        <header className="border-b border-ink/10">
          <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-14 sm:pb-20">
            <Link
              href="/profile"
              className="text-sm text-muted hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >{L("← Volver a tu mapa", "← Back to your map")}</Link>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 items-center">
              <div className="lg:col-span-6">
                <p className="text-sm text-accent mb-4 label-caps">{L("Mi lectura", "My reading")}</p>
                <h1 className="page-title text-foreground">{L(<>
                  ¿Qué significa
                  <br />
                  tu mapa?
                </>, <>What does<br />your map mean?</>)}</h1>
                <p className="mt-6 max-w-xl text-lg text-muted leading-relaxed">{L("Tu mapa muestra las piezas por separado. La lectura las pone a conversar: dónde coinciden tus tres sistemas, qué tensión aparece entre ellos y qué conviene mirar ahora.", "Your map shows the pieces separately. The reading puts them in conversation: where your three systems agree, what tension appears between them and what's worth looking at now.")}</p>

                {/* Las tres coordenadas de las que sale todo lo que sigue */}
                <dl className="mt-8 border-t border-ink/15 max-w-xl">
                  {coords.map((c) => (
                    <div key={c.label} className="grid grid-cols-[8.5rem_1fr] gap-x-4 py-3 border-b border-ink/15 items-baseline">
                      <dt className="text-sm text-muted label-caps">{L.t(c.label)}</dt>
                      <dd>
                        <Link href={c.href} className="font-display text-xl text-foreground hover:underline underline-offset-4">
                          {L.t(c.value)}
                        </Link>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lg:col-span-6">
                <MapWheel
                  lifePath={lifePath}
                  sunSign={profile.sunSign || "Aries"}
                  animal={animalName}
                  className="mx-auto w-full max-w-[30rem]"
                />
              </div>
            </div>
          </div>
        </header>

        <LaLecturaExperience profile={profile} catalog={catalog} />
      </main>
    </PremiumActivationProvider>
  );
}
