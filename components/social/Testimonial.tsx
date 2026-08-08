"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    text: "Entré por curiosidad y me quedé por la profundidad. Vi mi perfil en un sitio de autoconocimiento y me pareció un acercamiento honesto — sin sensacionalismo, sin clickbait.",
    author: "Valentina R.",
    role: "Profesora, Buenos Aires",
    accent: false,
  },
  {
    text: "Lo que más me gustó es que no guarda nada. Creás tu mapa, leés, y listo. No tenés que dar un mail ni descargar una app. Es lo que debería ser internet.",
    author: "Martín C.",
    role: "Diseñador UX, Córdoba",
    accent: false,
  },
  {
    text: "Usé varios sitios de este tipo. La diferencia acá es que te muestran la estructura detrás del mapa: por qué un número, por qué un signo. No te lo dan mágicamente, te explican.",
    author: "Luciana M.",
    role: "Estudiante de psicología, Rosario",
    accent: false,
  },
  {
    text: "Me sorprendió lo rápido que carga. Pusé mi fecha, en segundos vi el mapa. Lo compartí con amigos y les pareció interesante también.",
    author: "Facundo A.",
    role: "Desarrollador, Mendoza",
    accent: false,
  },
  {
    text: "Me gustó que te dicen qué sistemas están usando y por qué. No es como otros sitios que te dicen 'esto es tu destino' sin explicar nada. Acá se nota que hay trabajo detrás.",
    author: "Camila P.",
    role: "Redactora, Montevideo",
    accent: false,
  },
];

export default function Testimonial() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-12">
        <div
          className="min-h-[160px] relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="font-heading text-lg sm:text-xl lg:text-2xl font-light text-foreground/90 leading-relaxed mb-8">
                &ldquo;{TESTIMONIALS[current].text}&rdquo;
              </p>
              <footer className="flex flex-col items-center gap-1">
                <span className="text-sm text-foreground/70 font-medium">
                  {TESTIMONIALS[current].author}
                </span>
                <span className="text-xs text-muted/70">
                  {TESTIMONIALS[current].role}
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Reseña ${i + 1}`}
              className="group flex items-center justify-center w-6 h-6 -m-1"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-accent w-4"
                    : "bg-ink/15 group-hover:bg-ink/30 w-1.5"
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
