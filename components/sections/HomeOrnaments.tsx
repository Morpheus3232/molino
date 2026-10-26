/**
 * Piezas que comparten las tres partes de la portada (el día, tu mapa, el
 * índice) para que se lean como un mismo libro ilustrado, el de la apertura:
 *
 * - `Fleuron`: el molino de la ilustración, chico y en tinta, entre dos
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
      <svg viewBox="-24 -26 48 58" className="h-9 w-9 shrink-0 text-ink" fill="currentColor">
        {/* Aspas en cruz, como las de la apertura */}
        <g stroke="currentColor" strokeWidth="1.6">
          <line x1="-19" y1="-19" x2="19" y2="19" />
          <line x1="19" y1="-19" x2="-19" y2="19" />
        </g>
        {[45, 135, 225, 315].map((deg) => (
          <rect key={deg} x="9" y="-3.2" width="12" height="6.4" transform={`rotate(${deg})`} />
        ))}
        {/* Torre y techo */}
        <path d="M-6 -6 L0 -13 L6 -6 Z" />
        <path d="M-5.5 -5 L5.5 -5 L8 30 L-8 30 Z" />
        <rect x="-1.6" y="20" width="3.2" height="7" fill="rgb(var(--color-paper-rgb))" />
      </svg>
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
