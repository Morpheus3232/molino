"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatAnimalEmoji, getZodiacDisplay } from "@/lib/utils/zodiacDisplay";
import { smoothReveal } from "@/lib/utils/premiumMotion";

interface ZodiacExplorerProps {
  animal: string;
  element?: string;
}

const ZODIAC_DATA: Record<string, {
  origin: string;
  tradition: string;
  cycle: string;
  vietnamese: string;
  strengths: string[];
  historicalNote: string;
}> = {
  Rata: {
    origin: "Zodíaco chino — primer animal del ciclo",
    tradition: "La Rata representa ingenio, astucia y adaptabilidad. Es el iniciador del ciclo de 12 animales.",
    cycle: "Cada 12 años: 1900, 1912, 1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020",
    vietnamese: "Rata (mismo nombre)",
    strengths: ["Astucia", "Adaptabilidad", "Curiosidad"],
    historicalNote: "Según la leyenda, la Rata ganó la carrera del Emperador de Jade subiéndose al lomo del Buey.",
  },
  Buey: {
    origin: "Zodíaco chino — segundo animal",
    tradition: "El Buey representa fuerza, determinación y confiabilidad. Símbolo de perseverancia.",
    cycle: "Cada 12 años: 1901, 1913, 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021",
    vietnamese: "Búfalo de Agua",
    strengths: ["Fuerza", "Determinación", "Lealtad"],
    historicalNote: "El Buey es símbolo de agricultura y prosperidad en la cultura china.",
  },
  Tigre: {
    origin: "Zodíaco chino — tercer animal",
    tradition: "El Tigre representa coraje, pasión y liderazgo. Rey de las bestias en la cultura china.",
    cycle: "Cada 12 años: 1902, 1914, 1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022",
    vietnamese: "Gato (reemplaza al Conejo en Vietnam)",
    strengths: ["Coraje", "Pasión", "Liderazgo"],
    historicalNote: "El Tigre es considerado el rey de las bestias en la mitología china.",
  },
  Conejo: {
    origin: "Zodíaco chino — cuarto animal",
    tradition: "El Conejo representa elegancia, diplomacia y sensibilidad. Asociado con la luna.",
    cycle: "Cada 12 años: 1903, 1915, 1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023",
    vietnamese: "Gato (en Vietnam, el Conejo es Gato)",
    strengths: ["Elegancia", "Suavidad", "Intuición"],
    historicalNote: "El Conejo es uno de los animales más apreciados en el zodiaco chino, asociado con la luna.",
  },
  Dragón: {
    origin: "Zodíaco chino — quinto animal",
    tradition: "El Dragón representa poder, visión y ambición. El único animal mítico del ciclo.",
    cycle: "Cada 12 años: 1904, 1916, 1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024",
    vietnamese: "Dragón (mismo nombre)",
    strengths: ["Poder", "Visión", "Ambición"],
    historicalNote: "El Dragón es el único animal mítico del zodiaco chino, símbolo de poder imperial.",
  },
  Serpiente: {
    origin: "Zodíaco chino — sexto animal",
    tradition: "La Serpiente representa sabiduría, intuición y misterio. El más astuto del zodiaco.",
    cycle: "Cada 12 años: 1905, 1917, 1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025",
    vietnamese: "Serpiente (mismo nombre)",
    strengths: ["Sabiduría", "Profundidad", "Magnetismo"],
    historicalNote: "La Serpiente tiene importancia especial en la medicina tradicional china.",
  },
  Caballo: {
    origin: "Zodíaco chino — séptimo animal",
    tradition: "El Caballo representa libertad, energía y aventura. Símbolo de movimiento y dinamismo.",
    cycle: "Cada 12 años: 1906, 1918, 1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026",
    vietnamese: "Caballo (mismo nombre)",
    strengths: ["Movimiento", "Independencia", "Exploración"],
    historicalNote: "El Caballo ha sido símbolo de estatus y libertad en China durante milenios.",
  },
  Cabra: {
    origin: "Zodíaco chino — octavo animal",
    tradition: "La Cabra representa creatividad, sensibilidad y armonía. Símbolo de arte y paz.",
    cycle: "Cada 12 años: 1907, 1919, 1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027",
    vietnamese: "Cabra (mismo nombre)",
    strengths: ["Creatividad", "Armonía", "Sensibilidad"],
    historicalNote: "La Cabra (o Oveja) es uno de los animales más pacíficos del zodiaco.",
  },
  Mono: {
    origin: "Zodíaco chino — noveno animal",
    tradition: "El Mono representa ingenio, versatilidad y curiosidad. El más astuto del zodiaco.",
    cycle: "Cada 12 años: 1908, 1920, 1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028",
    vietnamese: "Mono (mismo nombre)",
    strengths: ["Ingenio", "Versatilidad", "Chispa"],
    historicalNote: "El Mono es considerado el animal más inteligente y juguetón del zodiaco.",
  },
  Gallo: {
    origin: "Zodíaco chino — décimo animal",
    tradition: "El Gallo representa puntualidad, observación y coraje. Anuncia el amanecer.",
    cycle: "Cada 12 años: 1909, 1921, 1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029",
    vietnamese: "Gallo (mismo nombre)",
    strengths: ["Puntualidad", "Observación", "Coraje"],
    historicalNote: "El Gallo simboliza la honestidad y la capacidad de decir las cosas como son.",
  },
  Perro: {
    origin: "Zodíaco chino — undécimo animal",
    tradition: "El Perro representa lealtad, honradez y protección. El guardián del ciclo.",
    cycle: "Cada 12 años: 1910, 1922, 1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030",
    vietnamese: "Perro (mismo nombre)",
    strengths: ["Lealtad", "Honradez", "Protección"],
    historicalNote: "El Perro es símbolo de lealtad incondicional en la cultura china.",
  },
  Cerdo: {
    origin: "Zodíaco chino — duodécimo animal",
    tradition: "El Cerdo representa generosidad, optimismo y calidez. El cierre del ciclo.",
    cycle: "Cada 12 años: 1911, 1923, 1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031",
    vietnamese: "Cerdo (mismo nombre)",
    strengths: ["Generosidad", "Optimismo", "Calidez"],
    historicalNote: "El Cerdo cierra el ciclo y representa la abundancia y la satisfacción.",
  },
};

export default function ZodiacExplorer({ animal, element }: ZodiacExplorerProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const display = getZodiacDisplay(animal);
  const data = ZODIAC_DATA[animal] ?? ZODIAC_DATA.Caballo;

  return (
    <motion.div {...smoothReveal} className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{display.emoji}</span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-0.5">Tu animal</p>
            <p className="font-serif text-xl font-bold text-foreground">{display.name}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-accent hover:underline"
        >
          {isExpanded ? "Ocultar" : "Explorar la tradición"} →
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border space-y-4">
              {/* Origin */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Origen</p>
                <p className="text-xs text-foreground">{data.origin}</p>
              </div>

              {/* Tradition */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Tradición</p>
                <p className="text-xs text-foreground leading-relaxed">{data.tradition}</p>
              </div>

              {/* Cycle */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Ciclo</p>
                <p className="text-xs text-foreground">{data.cycle}</p>
              </div>

              {/* Vietnamese */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Variante vietnamita</p>
                <p className="text-xs text-foreground">{data.vietnamese}</p>
              </div>

              {/* Element */}
              {element && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Elemento</p>
                  <p className="text-xs text-foreground">{element}</p>
                </div>
              )}

              {/* Strengths */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Cualidades</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.strengths.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical note */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted font-medium mb-1">Nota histórica</p>
                <p className="text-xs text-muted/70 italic">{data.historicalNote}</p>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => router.push("/academy")}
                className="text-[10px] text-accent hover:underline font-medium"
              >
                Explorar la historia completa en La Academia →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
