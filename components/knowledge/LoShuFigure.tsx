/**
 * El cuadrado mágico Lo Shu con el lugar del número marcado. Cada fila,
 * columna y diagonal suma 15; los números maestros (11, 22, 33) ocupan el
 * lugar de su cifra, repetida.
 */
const GRID = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];
const ROW = ["arriba", "en el medio", "abajo"];
const COL = ["a la izquierda", "al centro", "a la derecha"];

export function loShuPlace(digit: number) {
  for (let r = 0; r < 3; r++) {
    const c = GRID[r].indexOf(digit);
    if (c >= 0) {
      const where = r === 1 && c === 1 ? "en el centro" : `${ROW[r]}, ${COL[c]}`;
      return { row: GRID[r], where };
    }
  }
  return null;
}

export default function LoShuFigure({ number, className = "" }: { number: number; className?: string }) {
  const digit = number > 9 ? Number(String(number)[0]) : number;
  const master = number > 9;
  return (
    <figure className={className}>
      <div
        className="grid grid-cols-3 border-l border-t border-ink/30 w-full max-w-[26rem] mx-auto"
        role="img"
        aria-label={`Cuadrado Lo Shu con el ${digit} marcado${master ? `, que en el ${number} aparece dos veces` : ""}.`}
      >
        {GRID.flat().map((d) => {
          const on = d === digit;
          return (
            <div
              key={d}
              className={`relative aspect-square border-r border-b border-ink/30 flex items-center justify-center ${on ? "bg-ink text-paper" : "text-muted/60"}`}
            >
              <span className="font-display text-6xl sm:text-7xl leading-none">{d}</span>
              {on && master && <span className="absolute bottom-2 right-3 text-base text-paper/80">×2</span>}
            </div>
          );
        })}
      </div>
      <figcaption className="mt-3 text-sm text-muted text-center">El cuadrado Lo Shu: cada fila, columna y diagonal suma 15.</figcaption>
    </figure>
  );
}
