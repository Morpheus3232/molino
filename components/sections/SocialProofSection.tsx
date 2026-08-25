"use client";

import { motion } from "framer-motion";
import { fadeUp, fadeUpDelayed, staggerContainer, staggerItem } from "@/lib/utils/motion";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  avatar: string; // emoji or initials
}

const testimonials: Testimonial[] = [
  {
    quote: "Después de usarlo con mi pareja, entendimos por qué chocábamos en ciertos momentos. No predice nada, pero te da herramientas reales para navegar diferencias.",
    author: "María",
    role: "Terapeuta de parejas",
    location: "Buenos Aires",
    avatar: "👩‍⚕️",
  },
  {
    quote: "Lo uso para decidir timing en mis proyectos. No es magia, es lógica. Los patrones numéricos y astrológicos realmente ayudan a ver ciclos.",
    author: "Juan",
    role: "Emprendedor",
    location: "CDMX",
    avatar: "🚀",
  },
  {
    quote: "Pasé de 'no entiendo nada' a 'ah, por eso soy así'. Sin pseudociencia, sin fake promises. Transparencia real.",
    author: "Sophie",
    role: "Productora creativa",
    location: "Barcelona",
    avatar: "🎬",
  },
];

const stats = [
  { number: "50K+", label: "Análisis realizados", icon: "📊" },
  { number: "92%", label: "Recomendarían a un amigo", icon: "👍" },
  { number: "0%", label: "Datos vendidos", icon: "🛡️" },
];

export default function SocialProofSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-background via-ink/2 to-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-bold mb-3">
            Confianza Verificada
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Gente real. Resultados reales.
          </h2>
          <p className="text-sm text-muted max-w-2xl mx-auto">
            Molino es usado por miles de personas que buscaban entender sus patrones sin fake promises.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} {...staggerItem} className="p-4 sm:p-6 rounded-lg bg-card border border-ink/10 text-center">
              <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
              <p className="font-heading text-xl sm:text-2xl font-bold text-foreground">{stat.number}</p>
              <p className="text-xs sm:text-sm text-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              {...staggerItem}
              className="p-5 sm:p-6 rounded-lg bg-card border border-ink/10 hover:border-accent/30 transition-all flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-foreground leading-relaxed flex-1 mb-4">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 pt-4 border-t border-ink/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                  <p className="text-xs text-muted/60">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          {...fadeUpDelayed(0.3)}
          className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-ink/10 grid grid-cols-3 gap-4 sm:gap-8 text-center"
        >
          <div>
            <p className="text-lg mb-1">🔒</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground">Privacidad Radical</p>
            <p className="text-xs sm:text-xs text-muted mt-1">Cálculo 100% local. Tus datos son tuyos.</p>
          </div>
          <div>
            <p className="text-lg mb-1">📖</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground">Código Abierto</p>
            <p className="text-xs sm:text-xs text-muted mt-1">Audita las fórmulas en GitHub.</p>
          </div>
          <div>
            <p className="text-lg mb-1">🚫</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground">Sin Ads</p>
            <p className="text-xs sm:text-xs text-muted mt-1">Sin tracking, sin venderte a terceros.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
