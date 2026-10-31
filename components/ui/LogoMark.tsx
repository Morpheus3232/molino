import type { CSSProperties } from "react";

/**
 * El molino del logo, quieto y sin hooks: lo pueden usar componentes de
 * servidor y las imágenes para compartir (Satori, que no lee variables CSS:
 * por eso los colores entran como props). Misma geometría que `Logo`, que es
 * la versión que gira en el header; cualquier molino del sitio sale de acá.
 */
export const LOGO_HUB = { x: 50, y: 36 };
export const LOGO_BLADE_D = "M0,0 L-4,-4 L-5.5,-11 L-3,-20 L0,-28 L3,-20 L5.5,-11 L4,-4 Z";

export default function LogoMark({
  className,
  style,
  color = "currentColor",
  paper = "var(--color-paper, #FFFFFF)",
}: {
  className?: string;
  style?: CSSProperties;
  color?: string;
  paper?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M32,97 L68,97 L57,44 L43,44 Z" fill={color} fillOpacity="0.95" />
      <line x1="37" y1="78" x2="63" y2="78" stroke={paper} strokeWidth="0.7" strokeOpacity="0.25" />
      <line x1="39.5" y1="61" x2="60.5" y2="61" stroke={paper} strokeWidth="0.7" strokeOpacity="0.25" />
      <rect x="42" y="82" width="16" height="15" rx="2" fill={paper} fillOpacity="0.35" />
      <rect x="46" y="85" width="8" height="12" rx="1.5" fill={paper} fillOpacity="0.5" />
      <path d={`M43,44 Q${LOGO_HUB.x},30 57,44 Z`} fill={color} />
      <g transform={`translate(${LOGO_HUB.x} ${LOGO_HUB.y})`}>
        {[45, 135, 225, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d={LOGO_BLADE_D} fill="none" stroke={paper} strokeWidth="2.2" strokeLinejoin="round" />
            <path d={LOGO_BLADE_D} fill={color} />
            <line x1="-4" y1="-4" x2="4" y2="-4" stroke={paper} strokeWidth="0.7" strokeOpacity="0.5" />
            <line x1="-5.5" y1="-11" x2="5.5" y2="-11" stroke={paper} strokeWidth="0.7" strokeOpacity="0.5" />
            <line x1="-3" y1="-20" x2="3" y2="-20" stroke={paper} strokeWidth="0.7" strokeOpacity="0.5" />
          </g>
        ))}
        <circle cx="0" cy="0" r="3" fill={color} stroke={paper} strokeWidth="1" />
      </g>
    </svg>
  );
}
