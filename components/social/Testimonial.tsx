"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    text: "Me tomó 30 segundos crear mi mapa. Sin dar mi mail, sin descargar nada. Y la lectura fue sorprendentemente precisa.",
    author: "Usuario de Molino",
  },
];

export default function Testimonial() {
  return (
    <section className="bg-background border-t border-ink/10 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-12">
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="font-heading text-lg sm:text-xl lg:text-2xl font-light text-foreground/90 leading-relaxed mb-8">
            {TESTIMONIALS[0].text}
          </p>
          <footer className="text-sm text-muted/60">
            &mdash; {TESTIMONIALS[0].author}
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}