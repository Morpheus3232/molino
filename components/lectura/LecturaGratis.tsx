"use client";

import type { UserProfile } from "@/types/user";
import FamousMatchCompact from "@/components/profile/FamousMatchCompact";
import CalculationDetails from "@/components/profile/CalculationDetails";

/**
 * LA LECTURA GRATIS — cierre de /lectura. El bloque interpretativo principal
 * (cuadro de nacimiento, coincidencias entre sistemas, los dos movimientos)
 * vive en /profile (Mi Mapa) vía ProfileHub; acá queda la sincronicidad
 * resumida (3 figuras) y el detalle del cálculo, que respaldan lo que ya se
 * vio en el Mapa.
 */
export default function LecturaGratis({ profile, hideBorderTop = false }: { profile: UserProfile; hideBorderTop?: boolean }) {
  return (
    <>
      <FamousMatchCompact profile={profile} hideBorderTop={hideBorderTop} />

      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-6">
        <CalculationDetails profile={profile} />
      </div>
    </>
  );
}
