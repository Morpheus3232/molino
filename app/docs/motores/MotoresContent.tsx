"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { useReducedMotion } from "@/lib/utils/motion-hooks";
import { Code, Calculator, Globe, BookOpen, Hash, Sun, Moon } from "lucide-react";
import UniversityFooter from "@/components/layout/UniversityFooter";

const engines = [
  {
    icon: Hash,
    title: "Motor de Numerología",
    slug: "numerologia",
    description: "Calcula Camino de Vida, Expresión, Alma, Personalidad y Ciclos de vida. Camino de Vida, Personalidad y Ciclos salen de la fecha de nacimiento; Expresión y Alma, del nombre completo.",
    formulas: [
      { name: "Camino de Vida (Life Path)", formula: "Suma reductiva de DD + MM + AAAA → dígito 1-9 (11, 22, 33 como maestros)", example: "15/03/1990 → 1+5+0+3+1+9+9+0 = 28 → 2+8 = 10 → 1+0 = 1" },
      { name: "Expresión (Destiny)", formula: "Suma de valores pitagóricos de cada letra del nombre completo → reducido a 1-9", example: "JUAN PEREZ → J(1)+U(3)+A(1)+N(5) + P(7)+E(5)+R(9)+E(5)+Z(8) = 44 → 4+4 = 8" },
      { name: "Alma (Soul Urge)", formula: "Suma solo de vocales del nombre completo", example: "JUAN PEREZ → U(3)+A(1)+E(5)+E(5) = 14 → 1+4 = 5" },
      { name: "Personalidad", formula: "Se obtiene exclusivamente del día de nacimiento (no del nombre): día del mes reducido a un dígito, o mantenido si es 11/22/33.", example: "Nacido el 9, el 18 o el 27 → Personalidad 9. Nacido el 15 → 1+5 = 6." },
      { name: "Ciclos de Vida (Pinnacles/Challenges)", formula: "Basados en fecha de nacimiento: 4 ciclos de ~27-28 años cada uno", example: "Ciclo 1: 0-27 años, Ciclo 2: 28-55, Ciclo 3: 56-83, Ciclo 4: 84+" },
    ],
    codeExample: `// Cálculo Camino de Vida (simplificado)
function lifePath(day: number, month: number, year: number): number {
  const sum = digits(day) + digits(month) + digits(year);
  return reduceToMaster(sum); // 1-9, 11, 22, 33
}

// Valores pitagóricos A=1, B=2... I=9, J=1...
const PYTHAGOREAN: Record<string, number> = {
  A:1, J:1, S:1, B:2, K:2, T:2, C:3, L:3, U:3,
  D:4, M:4, V:4, E:5, N:5, W:5, F:6, O:6, X:6,
  G:7, P:7, Y:7, H:8, Q:8, Z:8, I:9, R:9
};`,
  },
  {
    icon: Sun,
    title: "Motor de Astrología Tropical",
    slug: "astrologia",
    description: "Calcula signo solar, lunar, ascendente, casas, aspectos y posiciones planetarias usando efemérides suizas (Swiss Ephemeris) para precisión astronómica.",
    formulas: [
      { name: "Signo Solar", formula: "Posición geocéntrica del Sol en el zodíaco tropical al momento exacto de nacimiento", example: "Sol a 23°15' Aries → Signo: Aries, Grado: 23°15'" },
      { name: "Signo Lunar", formula: "Posición geocéntrica de la Luna (rápida: ~13°/día, requiere hora exacta)", example: "Luna a 12°40' Cáncer → Signo: Cáncer" },
      { name: "Ascendente (ASC)", formula: "Punto del eclíptico que surge en el horizonte este al nacer (depende de lat/lon/hora)", example: "ASC a 5°30' Libra → Casa 1 en Libra" },
      { name: "Casas (Placidus)", formula: "División temporal del espacio local en 12 casas desiguales", example: "Casa 10 (MC) a 5°30' Capricornio" },
      { name: "Aspectos mayores", formula: "Ángulos entre planetas: Conjunción(0°), Oposición(180°), Cuadratura(90°), Trígono(120°), Sextil(60°)", example: "Sol 23° Aries □ Luna 12° Cáncer (orbe ~8°)" },
      { name: "Elementos / Modalidades", formula: "Conteo de planetas en Fuego/Tierra/Aire/Agua y Cardinal/Fijo/Mutable", example: "Fuego: 4, Tierra: 2, Aire: 3, Agua: 1 → Dominante: Fuego" },
    ],
    codeExample: `// Cálculo signo solar (aprox., sin efemérides)
function sunSign(day: number, month: number): string {
  const boundaries = [
    [20, 1, "Acuario"], [19, 2, "Piscis"], [21, 3, "Aries"],
    [20, 4, "Tauro"], [21, 5, "Géminis"], [21, 6, "Cáncer"],
    [23, 7, "Leo"], [23, 8, "Virgo"], [23, 9, "Libra"],
    [23, 10, "Escorpio"], [22, 11, "Sagitario"], [22, 12, "Capricornio"]
  ];
  for (const [d, m, sign] of boundaries) {
    if (month === m && day <= d) return sign;
  }
  return "Capricornio";
}

// Para precisión real: Swiss Ephemeris (sweph)
// swe_calc_ut(jd, SE_SUN, SEFLG_SPEED, &pos, &ret);
// signo = Math.floor(pos[0] / 30);`,
  },
  {
    icon: Moon,
    title: "Motor de Zodíaco Chino",
    slug: "zodiaco-chino",
    description: "Determina animal del año, elemento, pilares (Año, Mes, Día, Hora) y ciclo sexagenario (60 combinaciones) usando calendario lunisolar chino.",
    formulas: [
      { name: "Animal del Año", formula: "(Año - 4) % 12 → índice 0-11: Rata, Buey, Tigre, Conejo, Dragón, Serpiente, Caballo, Cabra, Mono, Gallo, Perro, Cerdo", example: "1990 → (1990-4)%12 = 6 → Caballo" },
      { name: "Elemento del Año", formula: "Piso((Año - 4) % 10 / 2) → 0:Madera, 1:Fuego, 2:Tierra, 3:Metal, 4:Agua", example: "1990 → (1986%10)/2 = 3 → Metal → Caballo de Metal" },
      { name: "Ciclo Sexagenario (Ganzhi)", formula: "Combinación de 10 Troncos Celestiales × 12 Ramas Terrestres = 60 pares únicos", example: "1990 = Geng Wu (Metal Caballo) - año 27 del ciclo" },
      { name: "Pilar del Mes", formula: "Basado en mes solar chino (Jieqi) + año; usa tablas de correspondencia", example: "Marzo 1990 → Pilar Mes: Ji Mao (Tierra Conejo)" },
      { name: "Pilar del Día", formula: "Cuenta días desde época base (ej. 1900-01-01 = Jia Zi) módulo 60", example: "15/03/1990 → Día #32874 → 32874%60 = 54 → Ding Hai" },
      { name: "Pilar de la Hora", formula: "Cada hora china = 2h occidental; 12 horas × 5 elementos = ciclo 60", example: "14:30 → Hora Wei (13-15h) → Pilar Hora según día" },
    ],
    codeExample: `// Animal y Elemento del Año
const ANIMALES = [
  "Rata", "Buey", "Tigre", "Conejo", "Dragón", "Serpiente",
  "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"
];

const ELEMENTOS = ["Madera", "Fuego", "Tierra", "Metal", "Agua"];

function chineseYearInfo(year: number) {
  const offset = year - 4; // 1984 = Jia Zi (Madera Rata) = inicio ciclo 60
  const animalIdx = ((offset % 12) + 12) % 12;
  const elementIdx = Math.floor((((offset % 10) + 10) % 10) / 2);
  return {
    animal: ANIMALES[animalIdx],
    elemento: ELEMENTOS[elementIdx],
    ganzhiIndex: ((offset % 60) + 60) % 60 // 0-59
  };
}

// Para pilares exactos: requiere conversión fecha gregoriana → calendario chino
// Librería recomendada: chinese-calendar o implementación propia de Jieqi`
  },
];

export default function MotoresContent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-20 pb-24" id="main-content">
        {/* Hero */}
        <motion.section {...fadeUp} className="mb-16 sm:mb-20">
          <h1 className="font-heading uppercase text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Motores de cálculo
          </h1>
          <p className="text-base sm:text-lg text-muted mt-6 max-w-2xl leading-relaxed">
            Especificaciones fórmulas y ejemplos de código de los tres motores que impulsan Molino.
            Código abierto, auditable, sin cajas negras.
          </p>
        </motion.section>

        {/* Engines grid */}
        <div className="space-y-20" role="list" aria-label="Motores de cálculo">
          {engines.map((engine, engineIndex) => (
            <motion.article
              key={engine.slug}
              role="listitem"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: engineIndex * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              {/* Engine header */}
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-accent/10 text-accent flex-shrink-0 mt-1">
                  <engine.icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-heading uppercase text-2xl sm:text-3xl font-semibold text-foreground">
                    {engine.title}
                  </h2>
                  <p className="text-muted mt-2 max-w-xl leading-relaxed">{engine.description}</p>
                </div>
              </div>

              {/* Formulas table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-4 py-3 font-medium text-sm uppercase tracking-wider text-foreground">Fórmula</th>
                      <th className="px-4 py-3 font-medium text-sm uppercase tracking-wider text-foreground">Descripción</th>
                      <th className="px-4 py-3 font-medium text-sm uppercase tracking-wider text-foreground">Ejemplo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engine.formulas.map((f, i) => (
                      <tr key={f.name} className={`border-b border-border ${i % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
                        <td className="px-4 py-3 font-mono text-sm text-foreground">{f.name}</td>
                        <td className="px-4 py-3 text-sm text-muted">{f.formula}</td>
                        <td className="px-4 py-3 font-mono text-sm text-accent-light">{f.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Code example */}
              <div className="rounded-md border border-border overflow-hidden bg-muted/30">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
                  <Code className="w-4 h-4 text-foreground" aria-hidden="true" />
                  <span className="font-mono text-xs text-foreground uppercase tracking-wider">TypeScript — Implementación de referencia</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm"><code className="text-foreground">{engine.codeExample}</code></pre>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`/conocimiento/${engine.slug}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-border bg-background shadow-sm text-sm font-medium hover:border-accent hover:text-accent transition-colors"
                >
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  Ver en Conocimiento
                </a>
                <a
                  href={`https://github.com/molino/molino/tree/main/lib/engines/${engine.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-border bg-background shadow-sm text-sm font-medium hover:border-accent hover:text-accent transition-colors"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  Código fuente
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Footer note */}
        <motion.section {...fadeUp} className="mt-20 pt-12 border-t border-border text-center">
          <p className="text-sm text-muted max-w-2xl mx-auto leading-relaxed">
            Todas las fórmulas son implementaciones de referencia. Los motores de producción usan
            <a href="https://github.com/aloistr/swisseph" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">
              Swiss Ephemeris
            </a>{" "}
            para posiciones planetarias de precisión astronómica y bibliotecas validadas para conversión de calendario chino.
          </p>
        </motion.section>
      </main>

      <UniversityFooter />
    </div>
  );
}