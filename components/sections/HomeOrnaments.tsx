import LogoMark from "@/components/ui/LogoMark";

/**
 * Piezas que comparten las tres partes de la portada (el día, tu mapa, el
 * índice) para que se lean como un mismo libro ilustrado, el de la apertura:
 *
 * - `Fleuron`: el molino del logo, chico y en tinta, entre dos
 *   filetes. Separa las partes (el ⁂ queda para separar capítulos dentro
 *   del día).
 * - `Eyebrow`: la etiqueta en versalitas con filetes a los lados que abre
 *   cada parte, siempre centrada y siempre en tinta. El rojo es de la
 *   ilustración y del botón principal; acá no va.
 */

export function Fleuron({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex max-w-5xl items-center gap-5 px-4 sm:px-8 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <LogoMark className="h-10 w-10 shrink-0 text-ink" />
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center justify-center gap-3 text-sm text-muted label-caps ${className}`}>
      <span className="inline-block h-px w-10 bg-ink/30" aria-hidden="true" />
      {children}
      <span className="inline-block h-px w-10 bg-ink/30" aria-hidden="true" />
    </p>
  );
}
