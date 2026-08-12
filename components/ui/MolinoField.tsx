/**
 * MolinoField — campo ambiental instrumentado (fondo del Hero).
 *
 * Representa la idea de marca: "un molino hace visible algo que no podés ver
 * directamente: el viento". Aquí el viento es la información que todavía no
 * entró; el rotor gira lento ("está vivo"), un barrido de radar lee el campo
 * ("está detectando") y líneas de flujo se deslizan ("algo invisible ocurre").
 *
 * Es puramente decorativo y de bajo peso: SVG + CSS keyframes. No usa canvas,
 * no captura puntero, no carga nada. `aria-hidden` para accesibilidad.
 * Respeta `prefers-reduced-motion` vía la regla global de globals.css que
 * congela todas las animaciones.
 */
export default function MolinoField() {
  const center = 300;
  const rings = [
    { r: 96, o: 0.07 },
    { r: 158, o: 0.05 },
    { r: 230, o: 0.04 },
    { r: 292, o: 0.03 },
  ];
  // Estaciones radiales = los 8 dígitos de la clave.
  const nodes = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 600 600"
          className="h-[min(92vh,920px)] w-[min(92vh,920px)] opacity-70"
          fill="none"
        >
          {/* Anillos de detección (radar sobrio) */}
          {rings.map((ring) => (
            <circle
              key={ring.r}
              cx={center}
              cy={center}
              r={ring.r}
              stroke="var(--color-accent)"
              strokeOpacity={ring.o}
              strokeWidth="1"
            />
          ))}

          {/* Estaciones de los 8 dígitos */}
          {nodes.map((deg, i) => (
            <circle
              key={deg}
              cx={center + 230 * Math.cos((deg * Math.PI) / 180)}
              cy={center + 230 * Math.sin((deg * Math.PI) / 180)}
              r={i === 0 ? 2.6 : 2}
              stroke="var(--color-accent)"
              strokeOpacity={i === 0 ? 0.55 : 0.18}
              strokeWidth="1"
            />
          ))}

          {/* Reticulado fino entre estaciones */}
          {nodes.map((deg, i) => {
            const x1 = center;
            const y1 = center;
            const x2 = center + 230 * Math.cos((deg * Math.PI) / 180);
            const y2 = center + 230 * Math.sin((deg * Math.PI) / 180);
            return (
              <line
                key={`spoke-${deg}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--color-accent)"
                strokeOpacity={0.035}
                strokeWidth="1"
              />
            );
          })}

          {/* Rodete central — el instrumento que hace visible lo invisible */}
          <g
            className="molino-rotor"
            style={{ transformOrigin: "300px 300px" }}
          >
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 300 300)`}>
                <path
                  d="M300,300 L287,300 L292,258 L300,244 L308,258 L313,300 Z"
                  stroke="var(--color-accent)"
                  strokeOpacity={0.4}
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
              </g>
            ))}
            <circle cx={300} cy={300} r={5} stroke="var(--color-accent)" strokeOpacity={0.6} strokeWidth="1" />
          </g>

          {/* Barrido de lectura */}
          <g
            className="molino-sweep"
            style={{ transformOrigin: "300px 300px" }}
          >
            <path
              d={`M300,300 L300,${center - 292} A292,292 0 0 1 ${center + 206.4},${center - 206.4} Z`}
              fill="var(--color-accent)"
              fillOpacity={0.02}
            />
            <line
              x1={300}
              y1={300}
              x2={300}
              y2={center - 292}
              stroke="var(--color-accent)"
              strokeOpacity={0.5}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>

          {/* Líneas de flujo — el viento invisible */}
          {[
            { y: 168, w: 150, o: 0.16, dur: 9 },
            { y: 432, w: 170, o: 0.12, dur: 12 },
            { y: 470, w: 90, o: 0.1, dur: 7 },
          ].map((f, i) => (
            <g key={i} className="molino-flow" style={{ animation: `molino-flow-drift ${f.dur}s linear infinite` }}>
              <line
                x1={center - f.w}
                y1={f.y}
                x2={center + f.w}
                y2={f.y}
                stroke="var(--color-accent)"
                strokeOpacity={f.o}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
