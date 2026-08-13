"use client";

import CountUp from "@/components/ui/CountUp";

const esArFormat = new Intl.NumberFormat("es-AR");

/**
 * Contador social reutilizable: muestra un número con animación de conteo
 * (CountUp) seguido de un texto. Ej: "12.847 mapas generados hoy".
 *
 * Props:
 * - number: valor numérico a animar (se formatea con separador de miles).
 * - text:   texto que acompaña al número.
 * - className: clases extra para el contenedor.
 */
export default function SocialCounter({
  number,
  text,
  className = "",
}: {
  number: number;
  text: string;
  className?: string;
}) {
  return (
    <p className={`inline-flex flex-wrap items-center justify-center gap-2 ${className}`}>
      <CountUp target={number} format={n => esArFormat.format(n)} className="tabular-nums font-display" />
      <span className="text-muted/80">{text}</span>
    </p>
  );
}
