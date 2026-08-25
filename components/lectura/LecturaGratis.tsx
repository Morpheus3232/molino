"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/user";
import BirthGridSection from "@/components/profile/BirthGridSection";
import ConvergenceSection from "@/components/profile/ConvergenceSection";
import { LecturaLibre, type LecturaPieces } from "@/components/profile/LecturaProfunda";
import FamousMatch from "@/components/profile/FamousMatch";
import CalculationDetails from "@/components/profile/CalculationDetails";

/**
 * LA LECTURA GRATIS — todo lo interpretativo que antes vivía apilado en
 * /profile. Mi Mapa quedó con una sola pregunta ("¿dónde toca el mundo mi
 * signo?"); acá vive la otra ("¿qué significa?").
 *
 * Nada de esto es nuevo ni cambió: son las mismas cuatro secciones, en el
 * mismo orden, movidas de página. El orden va de lo verificable a lo
 * interpretado — dígitos de la fecha, coincidencias entre sistemas, la
 * lectura de los dos movimientos, la sincronicidad — y cierra con el detalle
 * del cálculo, que es el respaldo de todo lo anterior.
 *
 * `onData` deja las piezas calculadas disponibles para la lectura Pro, que se
 * monta abajo: sin esto la parte paga tendría que recalcular lo mismo.
 */
export default function LecturaGratis({
  profile,
  onPieces,
}: {
  profile: UserProfile;
  onPieces?: (pieces: LecturaPieces) => void;
}) {
  const [, setLocal] = useState<LecturaPieces | null>(null);

  return (
    <>
      <BirthGridSection profile={profile} />
      <ConvergenceSection profile={profile} />
      <LecturaLibre
        profile={profile}
        onData={(p) => {
          setLocal(p);
          onPieces?.(p);
        }}
      />
      <FamousMatch profile={profile} />

      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12 pt-6">
        <CalculationDetails profile={profile} />
      </div>
    </>
  );
}
