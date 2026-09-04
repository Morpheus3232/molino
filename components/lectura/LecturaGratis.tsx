"use client";

import type { UserProfile } from "@/types/user";
import CalculationDetails from "@/components/profile/CalculationDetails";

/**
 * LA LECTURA GRATIS — cierre de /lectura. El bloque interpretativo principal
 * (cuadro de nacimiento, coincidencias entre sistemas, los dos movimientos)
 * vive en /profile (Mi Mapa) vía ProfileHub; acá queda el detalle del
 * cálculo, que respalda lo que ya se vio en el Mapa.
 */
export default function LecturaGratis({ profile }: { profile: UserProfile }) {
  return (
    <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-6">
      <CalculationDetails profile={profile} />
    </div>
  );
}
