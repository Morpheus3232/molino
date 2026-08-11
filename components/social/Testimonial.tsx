"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { fadeUp } from "@/lib/utils/motion";
import Card from "@/components/ui/Card";

/**
 * Ficticios por ahora (placeholder). Para reemplazar por reseñas reales,
 * solo hace falta actualizar este array — la estructura ya está lista:
 * cada item necesita name, location, text y opcionalmente photoUrl.
 */
const TESTIMONIALS: { name: string; location: string; text: string; photoUrl?: string; color: string }[] = [
  {
    name: "Ana López",
    location: "Buenos Aires, Argentina",
    text: "Entré por curiosidad y me quedé por la profundidad. Es un acercamiento honesto — sin sensacionalismo, sin clickbait.",
    color: "var(--layer-identity)",
  },
  {
    name: "Carlos Méndez",
    location: "Madrid, España",
    text: "Lo que más me gustó es que no guarda nada. Creás tu mapa, leés, y listo. No tenés que dar un mail ni descargar una app.",
    color: "var(--layer-astrology)",
  },
  {
    name: "Lucía Rojas",
    location: "Ciudad de México, México",
    text: "Te muestran la estructura detrás del mapa: por qué un número, por qué un signo. No te lo dan mágicamente, te explican.",
    color: "var(--layer-cycles)",
  },
];

function initials(name: string): string {
  return name.charAt(0).toUpperCase();
}

function Avatar({ name, photoUrl, color }: { name: string; photoUrl?: string; color: string }) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt={`Foto de perfil de ${name}`} className="w-12 h-12 rounded-full object-cover" />;
  }
  return (
    <div
      role="img"
      aria-label={`Foto de perfil de ${name}`}
      style={{ backgroundColor: `${color}26`, color }}
      className="w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg font-semibold shrink-0"
    >
      {initials(name)}
    </div>
  );
}

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label="Calificación: 5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonial() {
  return (
    <section className="bg-ink/[0.02] border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-8xl px-4 sm:px-8 lg:px-12">
        <motion.h2 {...fadeUp} className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted/70 text-center mb-12">
          Lo que dicen quienes ya lo probaron
        </motion.h2>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 list-none">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.li
              key={testimonial.name}
              {...fadeUp}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <Card padding="lg" className="h-full flex flex-col">
                <header className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                  <Avatar name={testimonial.name} photoUrl={testimonial.photoUrl} color={testimonial.color} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted/70 mb-1">{testimonial.location}</p>
                    <StarRating />
                  </div>
                </header>

                <Quote className="w-8 h-8 text-accent/20 mb-4" aria-hidden="true" />

                <blockquote className="text-sm sm:text-base text-foreground/80 leading-relaxed flex-1">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
              </Card>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
